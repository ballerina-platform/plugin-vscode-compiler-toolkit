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
import * as path from "path";
import { Executable, ExecutableOptions } from "vscode-languageclient";
import { debug } from "../utils/logger";

export function getServerOptions(ballerinaCmd: string): Executable {
    debug(`Using Ballerina CLI command '${ballerinaCmd}' for Language server.`);
    const cmd = ballerinaCmd;
    const args = ["start-language-server"];

    const opt: ExecutableOptions = {};
    opt.env = {...process.env};
    if (process.env.LSEXTENSIONS_PATH !== "") {
        if (opt.env.BALLERINA_CLASSPATH_EXT) {
            opt.env.BALLERINA_CLASSPATH_EXT += path.delimiter + process.env.LSEXTENSIONS_PATH;
        } else {
            opt.env.BALLERINA_CLASSPATH_EXT = process.env.LSEXTENSIONS_PATH;
        }
    }
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
