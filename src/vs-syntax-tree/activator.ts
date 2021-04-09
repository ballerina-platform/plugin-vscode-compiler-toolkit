"use strict";
/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
import * as _ from "lodash";
import * as vscode from "vscode";
import { BallerinaExtension, ExtendedLangClient } from "../core";
import { SELECTION_NOT_FOUND } from "../core/messages";
import { getCommonWebViewOptions, WebViewRPCHandler } from "../utils";
import { render } from "./renderer";
import { EXTENSION_ID,
         EXTENSION_NAME,
         FULL_TREE_VIEW,
         FULL_TREE_VISUALIZER_COMMAND,
         LOCATE_NODE_COMMAND,
         LOCATE_TREE_VIEW,
         SUB_TREE_VIEW,
         SUBTREE_VISUALIZER_COMMAND } from "./resources/constant-resources";
import { getRemoteMethods } from "./resources/remote-methods";
import { CodeActionProvider, findNode, postWebviewMessage } from "./tools/activator-utils";

let activeTextEditor: vscode.TextEditor;
let syntaxTreePanel: vscode.WebviewPanel;
let hasOpenWebview: boolean = false;

/**
 * Activates the Ballerina Syntax Tree Visualizer extension by
 * registering the command (for full tree visualization) and
 * the two code actions (for subtree visualization and locate option)
 * @param ballerinaExtInstance
 */
export function activate(ballerinaExtInstance: BallerinaExtension) {
    const context = <vscode.ExtensionContext> ballerinaExtInstance.context;
    const langClient = <ExtendedLangClient> ballerinaExtInstance.langClient;

    ballerinaExtInstance.onReady().then(() => {
        context.subscriptions.push(
            vscode.languages.registerCodeActionsProvider(
                { pattern: "**/*.{bal}", scheme: "file" },
                new CodeActionProvider()
            )
        );

        context.subscriptions.push(vscode.commands.registerCommand(SUBTREE_VISUALIZER_COMMAND, () => {
            activateCommand(langClient, ballerinaExtInstance, SUB_TREE_VIEW);
        }));

        context.subscriptions.push(vscode.commands.registerCommand(LOCATE_NODE_COMMAND, () => {
            activateCommand(langClient, ballerinaExtInstance, LOCATE_TREE_VIEW);
        }));

        context.subscriptions.push(vscode.commands.registerCommand(FULL_TREE_VISUALIZER_COMMAND, () => {
            activateCommand(langClient, ballerinaExtInstance, FULL_TREE_VIEW);
        }));
    })
    .catch((e) => {
        console.log(e);
        ballerinaExtInstance.showPluginActivationError();
    });
}

/**
 * Upon invoking the commands,
 * validates the open source file and ranges (if available)
 * @param langClient
 * @param command
 */
function activateCommand(langClient: ExtendedLangClient, ballerinaExtInstance: BallerinaExtension, command: string) {
    if (!vscode.window.activeTextEditor ||
        !vscode.window.activeTextEditor.document.fileName.endsWith(".bal")) {
        ballerinaExtInstance.showMessageInvalidFile();
        return;
    } else if (command !== FULL_TREE_VIEW &&
        vscode.window.activeTextEditor.selection.isEmpty) {
        vscode.window.showWarningMessage(EXTENSION_NAME, ": ", SELECTION_NOT_FOUND);
        return;
    } else if (!hasOpenWebview) {
        createSyntaxTreePanel(langClient);
    }

    visualizeSyntaxTree(vscode.window.activeTextEditor,
                        vscode.window.activeTextEditor.selection,
                        command);
}

/**
 * Takes the client instance and creates the webview panel and registers
 * with the RPCHandler
 * @param langClient
 */
function createSyntaxTreePanel(langClient: ExtendedLangClient) {
    syntaxTreePanel = vscode.window.createWebviewPanel(
        EXTENSION_ID,
        EXTENSION_NAME,
        {
            viewColumn: vscode.ViewColumn.Beside
        },
        getCommonWebViewOptions()
    );
    hasOpenWebview = true;
    syntaxTreePanel.onDidDispose(() => {
        hasOpenWebview = false;
    });

    WebViewRPCHandler.create(syntaxTreePanel, getRemoteMethods(langClient));
}

/**
 * Invokes the rendering of the content on the webview panel.
 * And registers the listeners for sourcefile changes and
 * messages from the webview if an open webview is available.
 * @param activeEditor
 * @param blockRange
 * @param activatedCommand
 */
function visualizeSyntaxTree(activeEditor: vscode.TextEditor,
                             blockRange: vscode.Selection,
                             activatedCommand: string) {
    const sourceRoot = activeEditor.document.uri.path;

    if (hasOpenWebview) {
        vscode.workspace.onDidChangeTextDocument(_.debounce(() => {
            if (vscode.window.activeTextEditor &&
                activeTextEditor.document.uri === vscode.window.activeTextEditor.document.uri) {
                postWebviewMessage(syntaxTreePanel);
            }
        }, 500));

        syntaxTreePanel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "findNode": {
                    findNode(activeEditor, message.position);
                    return;
                }
            }
        });
    }

    const displayHtml = render(sourceRoot, blockRange, activatedCommand);
    syntaxTreePanel.webview.html = displayHtml;
    syntaxTreePanel.reveal();
    activeTextEditor = activeEditor;
}
