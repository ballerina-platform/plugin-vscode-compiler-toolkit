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
import { getSTVisualizerWebViewOptions, getLibraryWebViewContent, WebViewOptions } from "../utils";
import { FETCH_FULL_TREE_METHOD,
         FETCH_LOCATE_TREE_METHOD,
         FETCH_SUB_TREE_METHOD,
         FULL_TREE_VIEW,
         MAP_TREE_GRAPH_METHOD,
         ON_COLLAPSE_METHOD,
         SUB_TREE_VIEW } from "./resources/constant-resources";

export function render(sourceRoot: string, blockRange: any, activatedCommand: string) : string {
    const body = `
            <div class = "container">
                <div id = "treeBody" />
            </div>
    `;
    const bodyCss = ``;
    const styles = `
        .container {
            overflow-x: auto;
            height: 100%;
            padding-top: 15px;
            text-align: center;
        }

        #treeBody {
            display: inline-block;
            position: relative;
        }
    `;
    const scripts = `
        function loadedScript() {
            let docUri = ${JSON.stringify(sourceRoot)};
            let blockRange = ${JSON.stringify(blockRange)};
            let activatedCommand = ${JSON.stringify(activatedCommand)};
            let collapsedNode = "";
            let isGraphical = false;

            window.addEventListener('message', event => {
                let msg = event.data;
                switch(msg.command){
                    case 'update':
                        activatedCommand = msg.activatedCommand;
                        initiateRendering();
                }
            });

            function renderTree(){
                if (activatedCommand == ${JSON.stringify(FULL_TREE_VIEW)}) {
                    return renderFullTree();
                } else {
                    return new Promise((resolve, reject) => {
                        if (activatedCommand == ${JSON.stringify(SUB_TREE_VIEW)}) {
                            webViewRPCHandler.invokeRemoteMethod(${JSON.stringify(FETCH_SUB_TREE_METHOD)}, [docUri, blockRange], (response) => {
                                return resolve(fetchTreeGraph(response));
                            });
                        } else {
                            webViewRPCHandler.invokeRemoteMethod(${JSON.stringify(FETCH_LOCATE_TREE_METHOD)}, [docUri, blockRange], (response) => {
                                return resolve(fetchTreeGraph(response));
                            });
                        }
                    })
                }
            }

            function renderFullTree () {
                return new Promise((resolve, reject) => {
                    webViewRPCHandler.invokeRemoteMethod(${JSON.stringify(FETCH_FULL_TREE_METHOD)}, [docUri], (response) => {
                        return resolve(fetchTreeGraph(response));
                    });
                })
            }

            function fetchTreeGraph(response){
                return new Promise((resolve, reject) => {
                    webViewRPCHandler.invokeRemoteMethod(${JSON.stringify(MAP_TREE_GRAPH_METHOD)}, [response, activatedCommand], (result) => {
                        if(!response.parseSuccess || !response.syntaxTree.source){
                            return resolve("Unsuccessful");
                        } else {
                            return resolve(result);
                        }
                    });
                })
            }

            function findNode (position) {
                vscode.postMessage({
                    command: 'findNode',
                    position: position
                })
            }

            function switchFullTree(){
                activatedCommand = ${JSON.stringify(FULL_TREE_VIEW)};
                ballerinaSTVisualizer.renderSyntaxTree(activatedCommand, findNode, collapseTree, renderFullTree, switchFullTree, document.getElementById("treeBody"));
            }

            function collapseNodes(){
                return new Promise((resolve, reject) => {
                    webViewRPCHandler.invokeRemoteMethod(${JSON.stringify(ON_COLLAPSE_METHOD)}, [collapsedNode, isGraphical], (response) => {
                        resolve(response);
                    });
                })
            }

            function collapseTree(nodeID, representationType){
                collapsedNode = nodeID;
                isGraphical = representationType;
                ballerinaSTVisualizer.renderSyntaxTree(activatedCommand, findNode, collapseTree, collapseNodes, switchFullTree, document.getElementById("treeBody"));
            }

            function initiateRendering(){
                ballerinaSTVisualizer.renderSyntaxTree(activatedCommand, findNode, collapseTree, renderTree, switchFullTree, document.getElementById("treeBody"));
            }

            initiateRendering();
        }
    `;

    const webViewOptions: WebViewOptions = {
        ...getSTVisualizerWebViewOptions(),
        body, scripts, styles, bodyCss
    };

    return getLibraryWebViewContent(webViewOptions);
}
