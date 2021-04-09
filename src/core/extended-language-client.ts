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

import { Selection, Uri } from "vscode";
import { LanguageClient } from "vscode-languageclient";

export interface BallerinaSyntaxTree {
    kind: string;
    topLevelNodes: any[];
}

export interface BallerinaSyntaxTreeResponse {
    syntaxTree?: BallerinaSyntaxTree;
}

export interface GetSyntaxTreeRequest {
    documentIdentifier: {
        uri: string;
    };
}

export interface GetSyntaxTreeByRangeRequest {
    documentIdentifier: {
        uri: string
    };
    lineRange: Selection;
}

export class ExtendedLangClient extends LanguageClient {
    /**
     * Method to retrieve a syntax tree for a source file from the LS
     * @param uri - the URI of the source file for which the tree is retrieved
     * @returns the mapped syntax tree JSON object
     */
    getSyntaxTree(uri: Uri): Thenable<BallerinaSyntaxTreeResponse> {
        const req: GetSyntaxTreeRequest = {
            documentIdentifier: {
                uri: uri.toString()
            }
        };

        return this.sendRequest("ballerinaDocument/syntaxTree", req);
    }

    /**
     * Method to retrieve the sub syntax trees relevant to a particular range
     * @param uri - the URI of the source file to which the range belongs
     * @param lineRange - the range for which the subtree has to be retrieved
     * @returns the mapped syntax tree of the corresponding code for the range parsed
     */
    getSyntaxTreeByRange(uri: Uri, lineRange: Selection): Thenable<BallerinaSyntaxTreeResponse> {
        const req: GetSyntaxTreeByRangeRequest = {
            documentIdentifier: {
                uri: uri.toString()
            },
            lineRange
        };

        return this.sendRequest("ballerinaDocument/syntaxTreeByRange", req);
    }

    /**
     * Method to retrieve the mapped syntax tree JSON object that points out the path
     * to the node belonging to the particular range
     * @param uri - the URI of the source file for which the tree is retrieved
     * @param lineRange - the range of the node that has to be located
     * @returns the mapped syntax tree JSON object that includes the path to the node
     * belonging to the range parsed
     */
    getSyntaxNodePath(uri: Uri, lineRange: Selection): Thenable<BallerinaSyntaxTreeResponse> {
        const req: GetSyntaxTreeByRangeRequest = {
            documentIdentifier: {
                uri: uri.toString()
            },
            lineRange
        };

        return this.sendRequest("ballerinaDocument/syntaxTreeLocate", req);
    }
}
