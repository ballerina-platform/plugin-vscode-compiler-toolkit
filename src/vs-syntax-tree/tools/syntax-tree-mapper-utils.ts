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
import * as _ from "lodash";
import { INVALID_TOKEN } from "../resources/constant-resources";
import { TreeNode } from "../resources/interfaces";
import { checkNodePath } from "./syntax-tree-generator";

/**
 * The method to assign propeties for the self-made nodes
 * @param node - the node for which properties need to be assigned
 */
export function assignProperties(node: TreeNode | any) {
    let preceedingNode: number | any = -1;

    for (let count = 0; count < node.children.length; count++) {
        if (preceedingNode < 0 && node.children[count].kind !== INVALID_TOKEN) {
            preceedingNode = count;
        }
        if (node.children[count].diagnostics.length) {
            node.diagnostics = node.diagnostics.concat(_.cloneDeep(node.children[count].diagnostics));
        }
        if (checkNodePath && !node.isNodePath) {
            if (node.children[count].isNodePath) {
                node.isNodePath = true;
                node.didCollapse = true;
            }
        }
    }

    if (preceedingNode >= 0) {
        node.leadingMinutiae = _.cloneDeep(node.children[preceedingNode].leadingMinutiae);
        node.trailingMinutiae = _.cloneDeep(node.children[node.children.length - 1].trailingMinutiae);
        node.position = {
            startLine: node.children[preceedingNode].position.startLine,
            startColumn: node.children[preceedingNode].position.startColumn,
            endLine: node.children[node.children.length - 1].position.endLine,
            endColumn: node.children[node.children.length - 1].position.endColumn
        };
    }
}
