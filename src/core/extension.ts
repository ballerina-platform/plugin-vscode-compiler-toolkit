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

import { AssertionError } from "assert";
import { exec, spawnSync } from "child_process";
import { join, sep } from "path";
import {
    commands, ConfigurationChangeEvent, Extension, ExtensionContext,
    extensions, OutputChannel, Uri, window, workspace
} from "vscode";
import { LanguageClientOptions, RevealOutputChannelOn, ServerOptions, State as LS_STATE } from "vscode-languageclient";
import { getServerOptions } from "../server/server";
import { getOutputChannel, log } from "../utils/index";
import { ExtendedLangClient } from "./extended-language-client";
import {
    COMMAND_NOT_FOUND, CONFIG_CHANGED, DOWNLOAD_BALLERINA, ERROR, INSTALL_BALLERINA,
    INSTALL_NEW_BALLERINA, INVALID_FILE, INVALID_HOME_MSG,
    NO_SUCH_FILE, OLD_BALLERINA_VERSION, OLD_PLUGIN_VERSION, UNKNOWN_ERROR
} from "./messages";
import { BAL_HOME, OVERRIDE_BAL_HOME } from "./preferences";
const any = require("promise.any");

const SWAN_LAKE_REGEX = /(s|S)wan( |-)(l|L)ake/g;

export const EXTENSION_ID = "ballerina.ballerinacompilertoolkit";

export interface ConstructIdentifier {
    sourceRoot?: string;
    filePath?: string;
    moduleName: string;
    constructName: string;
    subConstructName?: string;
    startLine?: number;
    startColumn?: number;
}

export class BallerinaExtension {
    public ballerinaHome: string;
    public ballerinaCmd: string;
    public ballerinaVersion: string;
    public isSwanLake: boolean;
    public extension: Extension<any>;
    public langClient?: ExtendedLangClient;
    public context?: ExtensionContext;
    private clientOptions: LanguageClientOptions;

    constructor() {
        this.ballerinaHome = "";
        this.ballerinaCmd = "";
        this.ballerinaVersion = "";
        this.isSwanLake = false;
        // Load the extension
        this.extension = extensions.getExtension(EXTENSION_ID)!;
        this.clientOptions = {
            documentSelector: [{ scheme: "file", language: "ballerina" }],
            synchronize: { configurationSection: "ballerinaCompilerToolkit" },
            outputChannel: getOutputChannel(),
            revealOutputChannelOn: RevealOutputChannelOn.Never,
            initializationOptions: {
                enableLightWeightMode: true
            }
        };
    }

    setContext(context: ExtensionContext) {
        this.context = context;
    }

    init(): Promise<void> {
        try {
            // Register pre init handlers.
            this.registerPreInitHandlers();

            // Check if ballerina home is set.
            if (this.overrideBallerinaHome()) {
                if (!this.getConfiguredBallerinaHome()) {
                    const message = "Trying to get ballerina version without setting ballerina home.";
                    throw new AssertionError({
                        message
                    });
                }

                log("Ballerina home is configured in settings.");
                this.ballerinaHome = this.getConfiguredBallerinaHome();
            }

            // Validate the ballerina version.
            const pluginVersion = this.extension.packageJSON.version.split("-")[0];
            return this.getBallerinaVersion(this.ballerinaHome, this.overrideBallerinaHome()).then((runtimeVersion) => {
                this.ballerinaVersion = runtimeVersion.split("-")[0];
                if (!this.overrideBallerinaHome()) {
                    const { home } = this.autoDetectBallerinaHome();
                    this.ballerinaHome = home;
                }
                log(`Plugin version: ${pluginVersion}\nBallerina version: ${this.ballerinaVersion}`);

                if (this.ballerinaVersion.match(SWAN_LAKE_REGEX)) {
                    this.isSwanLake = true;
                }

                if (!this.isSwanLake) {
                    this.showMessageOldBallerina();
                    const message = `Ballerina version ${this.ballerinaVersion} is not supported.
                        Please use a compatible VSCode extension version.`;
                    throw new AssertionError({
                        message
                    });
                }

                // if Home is found load Language Server.
                let serverOptions: ServerOptions;
                serverOptions = getServerOptions(this.ballerinaCmd);
                this.langClient = new ExtendedLangClient("ballerina-compiler-toolkit", "Ballerina Compiler Toolkit LS Client",
                    serverOptions, this.clientOptions, false);

                // Following was put in to handle server startup failures.
                const disposeDidChange = this.langClient.onDidChangeState((stateChangeEvent) => {
                    if (stateChangeEvent.newState === LS_STATE.Stopped) {
                        const message = "Couldn't establish language server connection.";
                        log(message);
                        this.showPluginActivationError();
                    }
                });

                const disposable = this.langClient.start();

                this.langClient.onReady().then(() => {
                    disposeDidChange.dispose();
                    this.context!.subscriptions.push(disposable);
                });
            }, (reason) => {
                throw new Error(reason);
            }).catch(e => {
                const msg = `Error when checking ballerina version. ${e.message}`;
                throw new Error(msg);
            });
        } catch (ex) {
            const msg = "Error while activating plugin. " + (ex.message ? ex.message : ex);
            // If any failure occurs while initializing show an error message
            this.showPluginActivationError();
            return Promise.reject(msg);
        }
    }

    onReady(): Promise<void> {
        if (!this.langClient) {
            return Promise.reject("Ballerina Compiler Toolkit is not initialized");
        }

        return this.langClient.onReady();
    }

    showPluginActivationError(): any {
        // message to display on Unknown errors.
        // ask to enable debug logs.
        // we can ask the user to report the issue.
        window.showErrorMessage(UNKNOWN_ERROR);
    }

    registerPreInitHandlers(): any {
        // We need to restart VSCode if we change plugin configurations.
        workspace.onDidChangeConfiguration((params: ConfigurationChangeEvent) => {
            if (params.affectsConfiguration(BAL_HOME) ||
                params.affectsConfiguration(OVERRIDE_BAL_HOME)) {
                this.showMsgAndRestart(CONFIG_CHANGED);
            }
        });
    }

    showMsgAndRestart(msg: string): void {
        const action = "Restart Now";
        window.showInformationMessage(msg, action).then((selection) => {
            if (action === selection) {
                commands.executeCommand("workbench.action.reloadWindow");
            }
        });
    }

    async getBallerinaVersion(ballerinaHome: string, overrideBallerinaHome: boolean): Promise<string> {
        // if ballerina home is overridden, use ballerina cmd inside distribution
        // otherwise use wrapper command
        let distPath = "";
        if (overrideBallerinaHome) {
            distPath = join(ballerinaHome, "bin") + sep;
        }
        let exeExtension = "";
        if (process.platform === "win32") {
            exeExtension = ".bat";
        }

        let ballerinaExecutor = "";
        const balPromise: Promise<string> = new Promise((resolve, reject) => {
            exec(distPath + "bal" + exeExtension + " version", (err, stdout, _stderr) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (stdout.length === 0 ||
                    stdout.startsWith(ERROR) ||
                    stdout.includes(NO_SUCH_FILE) ||
                    stdout.includes(COMMAND_NOT_FOUND)) {
                    reject(stdout);
                    return;
                }

                ballerinaExecutor = "bal";
                log(`'bal' command is picked up from the plugin.`);
                resolve(stdout);
            });
        });
        const ballerinaPromise: Promise<string> = new Promise((resolve, reject) => {
            exec(distPath + "ballerina" + exeExtension + " version", (err, stdout, _stderr) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (stdout.length === 0 ||
                    stdout.startsWith(ERROR) ||
                    stdout.includes(NO_SUCH_FILE) ||
                    stdout.includes(COMMAND_NOT_FOUND)) {
                    reject(stdout);
                    return;
                }

                ballerinaExecutor = "ballerina";
                log(`'ballerina' command is picked up from the plugin.`);
                resolve(stdout);
            });
        });
        const cmdOutput = await any([balPromise, ballerinaPromise]);
        this.ballerinaCmd = distPath + ballerinaExecutor + exeExtension;
        try {
            const implVersionLine = cmdOutput.split("\n")[0];
            const replacePrefix = implVersionLine.startsWith("jBallerina")
                ? /jBallerina /
                : /Ballerina /;
            const parsedVersion = implVersionLine.replace(replacePrefix, "").replace(/[\n\t\r]/g, "");
            return Promise.resolve(parsedVersion);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    showMessageInstallBallerina(): any {
        const download: string = "Download";
        const openSettings: string = "Open Settings";
        const viewLogs: string = "View Logs";
        window.showWarningMessage(INSTALL_BALLERINA, download, openSettings, viewLogs).then((selection) => {
            if (openSettings === selection) {
                commands.executeCommand("workbench.action.openGlobalSettings");
            } else if (download === selection) {
                commands.executeCommand("vscode.open", Uri.parse(DOWNLOAD_BALLERINA));
            } else if (viewLogs === selection) {
                const balOutput = ballerinaExtInstance.getOutPutChannel();
                if (balOutput) {
                    balOutput.show();
                }
            }

        });
    }

    showMessageInstallLatestBallerina(): any {
        const download: string = "Download";
        const openSettings: string = "Open Settings";
        const viewLogs: string = "View Logs";
        window.showWarningMessage(
            ballerinaExtInstance.getVersion() + INSTALL_NEW_BALLERINA, download, openSettings, viewLogs
        ).then((selection) => {
            if (openSettings === selection) {
                commands.executeCommand("workbench.action.openGlobalSettings");
            }
            if (download === selection) {
                commands.executeCommand("vscode.open", Uri.parse(DOWNLOAD_BALLERINA));
            } else if (viewLogs === selection) {
                const balOutput = ballerinaExtInstance.getOutPutChannel();
                if (balOutput) {
                    balOutput.show();
                }
            }
        });
    }

    showMessageInvalidBallerinaHome(): void {
        const action = "Open Settings";
        window.showWarningMessage(INVALID_HOME_MSG, action).then((selection) => {
            if (action === selection) {
                commands.executeCommand("workbench.action.openGlobalSettings");
            }
        });
    }

    showMessageOldBallerina(): any {
        const download: string = "Download";
        window.showWarningMessage(OLD_BALLERINA_VERSION, download).then((selection) => {
            if (download === selection) {
                commands.executeCommand("vscode.open", Uri.parse(DOWNLOAD_BALLERINA));
            }
        });
    }

    showMessageOldPlugin(): any {
        const download: string = "Download";
        window.showWarningMessage(OLD_PLUGIN_VERSION, download).then((selection) => {
            if (download === selection) {
                commands.executeCommand("vscode.open", Uri.parse(DOWNLOAD_BALLERINA));
            }
        });
    }

    showMessageInvalidFile(): any {
        window.showErrorMessage(INVALID_FILE);
    }

    /**
     * Get ballerina home path.
     *
     * @returns {string}
     * @memberof BallerinaExtension
     */
    getBallerinaHome(): string {
        return this.ballerinaHome;
    }

    /**
     * Get ballerina home path configured in preferences.
     *
     * @returns {string}
     * @memberof BallerinaExtension
     */
    getConfiguredBallerinaHome(): string {
        return <string> workspace.getConfiguration().get(BAL_HOME);
    }

    autoDetectBallerinaHome(): { home: string, isOldBallerinaDist: boolean, isBallerinaNotFound: boolean } {
        let balHomeOutput = "";
        let isBallerinaNotFound = false;
        let isOldBallerinaDist = false;
        try {
            const response = spawnSync(this.ballerinaCmd, ["home"]);
            if (response.stdout.length > 0) {
                balHomeOutput = response.stdout.toString().trim();
            } else if (response.stderr.length > 0) {
                const message = response.stderr.toString();
                // ballerina is installed, but ballerina home command is not found
                isOldBallerinaDist = message.includes("bal: unknown command 'home'");
                // ballerina is not installed
                isBallerinaNotFound = message.includes("command not found")
                    || message.includes("unknown command")
                    || message.includes("is not recognized as an internal or external command");
                log("Error executing `bal home`. " + "\n<---- cmd output ---->\n"
                    + message + "<---- cmd output ---->\n");
            }

            // specially handle unknown ballerina command scenario for windows
            if (balHomeOutput === "" && process.platform === "win32") {
                isOldBallerinaDist = true;
            }
        } catch ({ message }) {
            // ballerina is installed, but ballerina home command is not found
            isOldBallerinaDist = message.includes("bal: unknown command 'home'");
            // ballerina is not installed
            isBallerinaNotFound = message.includes("command not found")
                || message.includes("unknown command")
                || message.includes("is not recognized as an internal or external command");
            log("Error executing `bal home`. " + "\n<---- cmd output ---->\n"
                + message + "<---- cmd output ---->\n");
        }

        return {
            home: isBallerinaNotFound || isOldBallerinaDist ? "" : balHomeOutput,
            isBallerinaNotFound,
            isOldBallerinaDist
        };
    }

    public overrideBallerinaHome(): boolean {
        return <boolean>workspace.getConfiguration().get(OVERRIDE_BAL_HOME);
    }

    public getVersion(): string {
        return this.extension.packageJSON.version;
    }

    public getOutPutChannel(): OutputChannel | undefined {
        return getOutputChannel();
    }
}

export const ballerinaExtInstance = new BallerinaExtension();
