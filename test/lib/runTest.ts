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

import * as cp from "child_process";

const downloadAndUnzipVSCode = require("vscode-test").downloadAndUnzipVSCode;
type StringLiteralUnion<T extends U, U = string> = T | (U & {});
type DownloadVersion = StringLiteralUnion<"insiders" | "stable">;
type DownloadPlatform = StringLiteralUnion<"darwin" | "win32-archive" | "win32-x64-archive" | "linux-x64">;

export interface TestOptions {
	/**
	 * The VS Code executable path used for testing.
	 *
	 * If not passed, will use `options.version` to download a copy of VS Code for testing.
	 * If `version` is not specified either, will download and use latest stable release.
	 */
	vscodeExecutablePath?: string;

	/**
	 * The VS Code version to download. Valid versions are:
	 * - `'stable'`
	 * - `'insiders'`
	 * - `'1.32.0'`, `'1.31.1'`, etc
	 *
	 * Defaults to `stable`, which is latest stable version.
	 *
	 * *If a local copy exists at `.vscode-test/vscode-<VERSION>`, skip download.*
	 */
	version?: DownloadVersion;

	/**
	 * The VS Code platform to download. If not specified, defaults to:
	 * - Windows: `win32-archive`
	 * - macOS: `darwin`
	 * - Linux: `linux-x64`
	 *
	 * Possible values are: `win32-archive`, `win32-x64-archive`, `darwin` and `linux-x64`.
	 */
	platform?: DownloadPlatform;

	/**
	 * Absolute path to the extension root. Passed to `--extensionDevelopmentPath`.
	 * Must include a `package.json` Extension Manifest.
	 */
	extensionDevelopmentPath: string;

	/**
	 * Absolute path to the extension tests runner. Passed to `--extensionTestsPath`.
	 * Can be either a file path or a directory path that contains an `index.js`.
	 * Must export a `run` function of the following signature:
	 *
	 * ```ts
	 * function run(): Promise<void>;
	 * ```
	 *
	 * When running the extension test, the Extension Development Host will call this function
	 * that runs the test suite. This function should throws an error if any test fails.
	 *
	 */
	extensionTestsPath: string;

	/**
	 * Environment variables being passed to the extension test script.
	 */
	extensionTestsEnv?: {
		[key: string]: string | undefined;
	};

	/**
	 * A list of launch arguments passed to VS Code executable, in addition to `--extensionDevelopmentPath`
	 * and `--extensionTestsPath` which are provided by `extensionDevelopmentPath` and `extensionTestsPath`
	 * options.
	 *
	 * If the first argument is a path to a file/folder/workspace, the launched VS Code instance
	 * will open it.
	 *
	 * See `code --help` for possible arguments.
	 */
	launchArgs?: string[];
}

/**
 * Run VS Code extension test
 *
 * @returns The exit code of the command to launch VS Code extension test
 */
export async function runTests(options: TestOptions): Promise<number> {
	if (!options.vscodeExecutablePath) {
		options.vscodeExecutablePath = await downloadAndUnzipVSCode(options.version, options.platform);
	}

	let args = [
		"--no-sandbox",
		"--extensionDevelopmentPath=" + options.extensionDevelopmentPath,
		"--extensionTestsPath=" + options.extensionTestsPath
	];

	if (options.launchArgs) {
		args = options.launchArgs.concat(args);
	}
	return innerRunTests(options.vscodeExecutablePath!, args, options.extensionTestsEnv);
}

async function innerRunTests(
	executable: string,
	args: string[],
	testRunnerEnv?: {
		[key: string]: string | undefined;
	}
): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		const fullEnv = Object.assign({}, process.env, testRunnerEnv);
		const cmd = cp.spawn(executable, args, { env: fullEnv });

		cmd.stdout.on("data", function (data) {
			console.log(data.toString());
		});

		cmd.stderr.on("data", function (data) {
			console.error(data.toString());
		});

		cmd.on("error", function (data) {
			console.log("Test error: " + data.toString());
		});

		let finished = false;
		function onProcessClosed(code: number | null, signal: NodeJS.Signals | null): void {
			if (finished) {
				return;
			}
			console.log(`Exit code: ${code}`);
			finished = true;

			if (code === 0) {
				resolve(code);
			} else {
				reject(code);
			}
			console.log("Done\n");
		}

		cmd.on("close", onProcessClosed);
		cmd.on("exit", onProcessClosed);
	});
}
