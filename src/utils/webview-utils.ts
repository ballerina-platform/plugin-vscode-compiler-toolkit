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
import { join } from "path";
import { ExtensionContext, Uri, WebviewOptions, WebviewPanelOptions } from "vscode";
import { ballerinaExtInstance } from "../core";

export function getWebViewResourceRoot(): string {
    return join((ballerinaExtInstance.context as ExtensionContext).extensionPath,
        "resources");
}

export function getNodeModulesRoot(): string {
    return join((ballerinaExtInstance.context as ExtensionContext).extensionPath,
        "node_modules");
}

export function getCommonWebViewOptions(): Partial<WebviewOptions & WebviewPanelOptions> {
    return {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
            Uri.file(join((ballerinaExtInstance.context as ExtensionContext).extensionPath, "resources", "jslibs")),
            Uri.file(getWebViewResourceRoot()),
            Uri.file(getNodeModulesRoot())
        ],
    };
}

export function getVSCodeResourceURI(filePath: string): string {
    return "vscode-resource:" + filePath;
}

export interface WebViewOptions {
    jsFiles?: string[];
    cssFiles?: string[];
    body: string;
    scripts: string;
    styles: string;
    bodyCss?: string;
}

export function getLibraryWebViewContent(options: WebViewOptions) {
    const {
        jsFiles,
        cssFiles,
        body,
        scripts,
        styles,
        bodyCss
    } = options;
    const resourceRoot = getVSCodeResourceURI(getWebViewResourceRoot());
    const nodeModulesRoot = getVSCodeResourceURI(getNodeModulesRoot());
    const externalScripts = jsFiles
        ? jsFiles.map(jsFile =>
            '<script charset="UTF-8" onload="loadedScript();" src="' + jsFile + '"></script>').join("\n")
        : "";
    const externalStyles = cssFiles
        ? cssFiles.map(cssFile =>
            '<link rel="stylesheet" type="text/css" href="' + cssFile + '" />').join("\n")
        : "";

    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                ${externalStyles}
                <style>
                    /* use this class for loader that are shown until the module js is loaded */
                    .root-loader {
                        position: absolute;
                        color: rgba(150, 150, 150, 0.5);
                        left: calc(50% - 20px);
                        top: calc(50% - 20px);
                    }
                    ${styles}
                </style>
            </head>

            <body class="${bodyCss}">
                ${body}
                <script>
                    ${scripts}
                </script>
                <script charset="UTF-8" src="${nodeModulesRoot}/mousetrap/mousetrap.min.js"></script>
                <script charset="UTF-8" src="${resourceRoot}/utils/messaging.js"></script>
                <script charset="UTF-8" src="${resourceRoot}/utils/undo-redo.js"></script>
                ${externalScripts}
            </body>
            </html>
        `;
}

export function getSTVisualizerURI(): string {
    return getVSCodeResourceURI(join((ballerinaExtInstance.context as ExtensionContext).extensionPath, "resources", "jslibs"));
}

export function getSTVisualizerPath(): string {
    return process.env.STVISUALIZER_DEBUG === "true"
        ? process.env.STVISUALIZER_DEV_HOST as string
        : getSTVisualizerURI();
}

export function getSTVisualizerJSFiles(): string[] {
    return [
        join(getSTVisualizerPath(), "stvisualizer.js"),
        process.env.STVISUALIZER_DEBUG === "true" ? "http://localhost:8097" : "" // For React Dev Tools
    ];
}

export function getSTVisualizerCSSFiles(): string[] {
    return [
        join(getSTVisualizerPath(), "themes", "ballerina-default.min.css")
    ];
}

export function getSTVisualizerWebViewOptions(): Partial<WebViewOptions> {
    return {
        jsFiles: getSTVisualizerJSFiles(),
        cssFiles: getSTVisualizerCSSFiles()
    };
}
