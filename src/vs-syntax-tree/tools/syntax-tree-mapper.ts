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
import { END_TOKEN, INVALID_TOKEN, INVALID_TOKEN_MESSAGE, MISSING, TRAILING_QUOTATION } from "../resources/constant-resources";
import { TreeNode } from "../resources/interfaces";
import { checkNodePath, syntaxTreeObj } from "./syntax-tree-generator";
import { assignProperties } from "./syntax-tree-mapper-utils";

let treeNode: any;
let nodeCount: number = -1;

/**
 * Recursively maps the syntax tree JSON object to a tree object that includes
 * the parent-child relationship all the nodes that need to be rendered
 * @param nodeObj - the tree object
 * @param parentObj - the parent of the parsed tree object
 * @param treeLevel - the level of the tree
 * @param foundNodeBlock - the node block to handle the path highlighting for the locate mode
 */
export function mapSyntaxTree(nodeObj: JSON, parentObj: TreeNode | any, treeLevel: number, foundNodeBlock: boolean) {
    for (const props in nodeObj) {
        if (props === "source") {
            return;
        } else if (props !== "relativeResourcePath" && nodeObj[props] instanceof Object) {
            if (Array.isArray(nodeObj[props]) && !nodeObj[props].length) {
                continue;
            } else if (nodeObj[props].hasOwnProperty("isToken")) {
                if (nodeObj[props].leadingMinutiae && nodeObj[props].leadingMinutiae.length) {
                    for (const element of Object.keys(nodeObj[props].leadingMinutiae)) {
                        if (nodeObj[props].leadingMinutiae[element].isInvalid) {
                            parentObj.children.push({
                                nodeID: `c${++nodeCount}`,
                                value: nodeObj[props].leadingMinutiae[element].minutiae,
                                kind: INVALID_TOKEN,
                                parentID: parentObj.nodeID,
                                children: [],
                                errorNode: true,
                                diagnostics: [{
                                    message: INVALID_TOKEN_MESSAGE + nodeObj[props].leadingMinutiae[element].minutiae
                                        + TRAILING_QUOTATION
                                }]
                            });
                        }
                    }
                }

                const isMissing = nodeObj[props].isMissing;

                parentObj.children.push({
                    nodeID: `c${++nodeCount}`,
                    value: ((isMissing && nodeObj[props].value.length < 1) || nodeObj[props].kind === END_TOKEN) ?
                        nodeObj[props].kind : nodeObj[props].value,
                    parentID: parentObj.nodeID,
                    children: [],
                    kind: isMissing ? MISSING + nodeObj[props].kind : nodeObj[props].kind,
                    leadingMinutiae: nodeObj[props].leadingMinutiae,
                    trailingMinutiae: nodeObj[props].trailingMinutiae,
                    isNodePath: foundNodeBlock,
                    errorNode: isMissing,
                    diagnostics: isMissing ? [{
                        message: MISSING + nodeObj[props].kind
                    }] : [],
                    position: nodeObj[props].position
                });
            } else if (!props.match(/^[0-9]+$/) || nodeObj[props].kind) {
                treeNode = {
                    nodeID: `p${++nodeCount}`,
                    leadingMinutiae: nodeObj[props].leadingMinutiae,
                    trailingMinutiae: nodeObj[props].trailingMinutiae,
                    parentID: parentObj.nodeID,
                    didCollapse: checkNodePath ?
                        (nodeObj[props].isNodePath ? (nodeObj[props].isLocatedNode ? false : true) : false) :
                        (treeLevel < 2 ? true : false),
                    isNodePath: nodeObj[props].isNodePath ? nodeObj[props].isNodePath : foundNodeBlock,
                    children: [],
                    diagnostics: nodeObj[props].syntaxDiagnostics ? nodeObj[props].syntaxDiagnostics : [],
                    position: nodeObj[props].position
                };

                let currentBlockStatus: boolean;
                currentBlockStatus = (checkNodePath && nodeObj[props].isNodePath && nodeObj[props].isLocatedNode) ?
                                        true : foundNodeBlock;

                if (!props.match(/^[0-9]+$/)) {
                    const parentNode: any = {
                        ...treeNode,
                        value: syntaxTreeObj.length ? props : (nodeObj[props].kind ? nodeObj[props].kind : props),
                        kind: syntaxTreeObj.length ? props : (nodeObj[props].kind ? nodeObj[props].kind : props)
                    };
                    syntaxTreeObj.length ? parentObj.children.push(parentNode) : syntaxTreeObj.push(parentNode);
                    mapSyntaxTree(nodeObj[props], parentNode, treeLevel + 1, currentBlockStatus);

                    if (!nodeObj[props].source && parentNode.children.length) {
                        assignProperties(parentNode);
                    }
                } else {
                    treeNode = {
                        ...treeNode,
                        value: nodeObj[props].kind,
                        kind: nodeObj[props].kind
                    };
                    parentObj.children.push(treeNode);
                    mapSyntaxTree(nodeObj[props], treeNode, treeLevel + 1, currentBlockStatus);
                }
            }
        }
    }
}
