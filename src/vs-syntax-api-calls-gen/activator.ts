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
import {BallerinaExtension, ExtendedLangClient} from "../core";
import {COPY_SYNTAX_API_QUOTE_COMMAND} from "./resources/constant-resources";

/**
 * Activates the Ballerina Syntax API Quoter extension by
 * registering the command (to copy the generated code).
 * @param ballerinaExtInstance
 */
export function activate(ballerinaExtInstance: BallerinaExtension) {
    const context = <vscode.ExtensionContext>ballerinaExtInstance.context;
    const langClient = <ExtendedLangClient>ballerinaExtInstance.langClient;

    ballerinaExtInstance.onReady().then(() => {
        context.subscriptions.push(vscode.commands.registerCommand(COPY_SYNTAX_API_QUOTE_COMMAND, () => {
            activateCommand(langClient, ballerinaExtInstance);
        }));
    }).catch((e) => {
        console.log(e);
        ballerinaExtInstance.showPluginActivationError();
    });
}

/**
 * Upon invoking the commands, validates the open source file.
 * @param langClient
 * @param ballerinaExtInstance
 */
function activateCommand(langClient: ExtendedLangClient, ballerinaExtInstance: BallerinaExtension) {
    if (!vscode.window.activeTextEditor ||
        !vscode.window.activeTextEditor.document.fileName.endsWith(".bal")) {
        ballerinaExtInstance.showMessageInvalidFile();
        return;
    }

    copySyntaxApiCalls(langClient, vscode.window.activeTextEditor)
        .then(console.log)
        .catch(console.log);
}

/**
 * Copies syntax api calls required to generate selected text.
 * @param langClient
 * @param activeEditor
 */
async function copySyntaxApiCalls(langClient: ExtendedLangClient, activeEditor: vscode.TextEditor) {
    const result = await langClient.getSyntaxApiCalls(activeEditor.document.uri);
    const code = result.code;
    if (code != null) {
        await vscode.env.clipboard.writeText(code);
    }
    return code;
}
