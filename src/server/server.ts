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
import { join, sep } from "path";
import { Executable, ExecutableOptions } from "vscode-languageclient";
import { debug } from "../utils/logger";

export function getServerOptions(ballerinaCmd: string): Executable {
    debug(`Using Ballerina CLI command '${ballerinaCmd}' for Language server.`);
    const cmd = process.platform === "win32" ? getConvertedPath(ballerinaCmd) : ballerinaCmd;
    const args = ["start-language-server"];
    const opt: ExecutableOptions = {};
    opt.env = {...process.env};

    if (process.env.SERVER_DEBUG === "true") {
        debug("Language Server is starting in debug mode.");
        const debugPort = 5005;
        opt.env.BAL_JAVA_DEBUG = debugPort;
        opt.env.BAL_DEBUG_OPTS = "-Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=" + debugPort + ",quiet=y";
    }

    if (process.env.LS_CUSTOM_CLASSPATH) {
        args.push("--classpath", process.env.LS_CUSTOM_CLASSPATH);
    }

    return {
        command: cmd,
        args,
        options: opt
    };
}

function getConvertedPath(ballerinaCmd: string): string {
    let paths = ballerinaCmd.split(sep);
    paths = paths.map((path) => path.startsWith("\"") && path.endsWith("\"") ?
        path.substring(1, path.length - 1) : path);
    return join.apply(null, paths);
}
