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
import { toInteger } from "lodash";
import { ERROR_NODE_COLOR,
         PARENT_NODE_COLOR,
         PATH_NODE_COLOR,
         TOKEN_COLOR } from "../resources/constant-resources";
import { TreeNode } from "../resources/interfaces";
import { checkNodePath, nodeEdges, nodeMembers } from "./syntax-tree-generator";

/**
 * Handles the collapsible property of the tree object and maps out the
 * graph for the graphical tree representation
 * @param targetArray - the graphical or dropdown tree object
 * @param nodeID - the ID of the node that is to be collapsed
 * @param isGraphical - whether the tree is in graphical or dropdown mode
 */
export function mapSyntaxGraph(targetArray: TreeNode[], nodeID: string, isGraphical: boolean) {
    for (let i = 0; i < targetArray.length; i++) {
        if (targetArray[i].nodeID === nodeID) {
            const status = targetArray[i].didCollapse;
            targetArray[i] = {
                ...targetArray[i],
                didCollapse: !status
            };
        }

        if (isGraphical) {
            const position = toInteger(targetArray[i].nodeID.replace(/\D/g, ""));
            const ifParent: boolean = targetArray[i].nodeID.charAt(0) === "p";
            let isNodePath: boolean = false;
            let diagnostics: any[] = [];

            if (!targetArray[i].didCollapse && ifParent) {
                diagnostics = targetArray[i].diagnostics;
            }
            if (checkNodePath && targetArray[i].isNodePath) {
                isNodePath = true;
            }

            nodeMembers.push({
                id: targetArray[i].nodeID,
                height: 50,
                width: diagnostics.length ? Math.max((targetArray[i].value.length * 7) + 80, 145) :
                    Math.max((targetArray[i].value.length * 9) + 30, 115),
                label: targetArray[i].value,
                kind: targetArray[i].kind,
                leadingMinutiae: targetArray[i].leadingMinutiae,
                trailingMinutiae: targetArray[i].trailingMinutiae,
                hasDiagnostics: diagnostics.length > 0 ? true : false,
                diagnostics:  targetArray[i].diagnostics,
                layoutOptions: {
                    "elk.position": "(" + position + ", 0)"
                },
                ifParent,
                isCollapsible: targetArray[i].didCollapse ? false : (ifParent ? true : false),
                isNodePath,
                nodeColor: targetArray[i].errorNode ? ERROR_NODE_COLOR :
                    (ifParent ? (checkNodePath ? PATH_NODE_COLOR : PARENT_NODE_COLOR) : TOKEN_COLOR),
                position: targetArray[i].position
            });

            if (nodeMembers.length > 1) {
                nodeEdges.push({
                    id: `e${targetArray[i].nodeID}`,
                    sources: [targetArray[i].parentID],
                    targets: [targetArray[i].nodeID],
                    isNodePath
                });
            }
        }

        if (targetArray[i].didCollapse) {
            mapSyntaxGraph(targetArray[i].children, nodeID, isGraphical);
        }
    }
}
