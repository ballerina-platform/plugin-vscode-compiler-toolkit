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
import * as vscode from "vscode";
import { FULL_TREE_VIEW,
    LOCATE_NODE_COMMAND,
    LOCATE_NODE_TITLE,
    SUBTREE_VISUALIZER_COMMAND,
    SUBTREE_VISUALIZER_TITLE } from "../resources/constant-resources";

export class CodeActionProvider implements vscode.CodeActionProvider {
    public provideCodeActions(): vscode.Command[] {
        if (!vscode.window.activeTextEditor || vscode.window.activeTextEditor.selection.isEmpty) {
            return [];
        } else {
            const codeActions: any = [];
            codeActions.push(
            {
                command: SUBTREE_VISUALIZER_COMMAND,
                title: SUBTREE_VISUALIZER_TITLE
            },
            {
                command: LOCATE_NODE_COMMAND,
                title: LOCATE_NODE_TITLE
            });
            return codeActions;
        }
    }
}

/**
 * Posts the update command to the webview if changes have undergone
 * in the source file for which the syntax tree is rendered.
 * The update command will re-render the syntax tree for the new source.
 * @param syntaxTreePanel
 */
export function postWebviewMessage(syntaxTreePanel: vscode.WebviewPanel) {
    syntaxTreePanel.webview.postMessage({
        command: "update",
        activatedCommand: FULL_TREE_VIEW
    });
}

/**
 * Locates and selects the range of code corresponding to the tree node
 * for which the locate was called.
 * @param editor
 * @param position
 */
export function findNode(editor: vscode.TextEditor, position: any) {
    vscode.window.showTextDocument(editor.document, {
        viewColumn: vscode.ViewColumn.One
    }).then((textEditor) => {
        const startPos = new vscode.Position(position.startLine, position.startColumn);
        const endPos = new vscode.Position(position.endLine, position.endColumn);
        textEditor.selection = new vscode.Selection(startPos, endPos);
    });
}
