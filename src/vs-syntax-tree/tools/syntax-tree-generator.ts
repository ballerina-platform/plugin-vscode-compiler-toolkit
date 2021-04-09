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
import { LAYOUT_OPTIONS, LOCATE_TREE_VIEW } from "../resources/constant-resources";
import { TreeNode } from "../resources/interfaces";
import { mapSyntaxGraph } from "./syntax-graph-mapper";
import { mapSyntaxTree } from "./syntax-tree-mapper";

export let checkNodePath: boolean;
export let nodeMembers: any[];
export let nodeEdges: any[];
export let syntaxTreeObj: TreeNode[];
let graphicalTreeObj: TreeNode[];

/**
 * Maps the retrieved JSON object to the tree object that is to be mapped
 * @param responseTree - the retrieved JSON object from the LS
 * @param activatedCommand - the currently activated command
 * @returns the mapped out syntax tree objects
 */
export function retrieveGraph(responseTree: any, activatedCommand: string) {
    syntaxTreeObj = [];
    checkNodePath = activatedCommand === LOCATE_TREE_VIEW ? true : false;
    mapSyntaxTree(responseTree, {}, 0, false);
    graphicalTreeObj = _.cloneDeep(syntaxTreeObj);
    return updateSyntaxTree("", true);
}

/**
 * Updates the tree object based on the collapsibility property
 * @param nodeID  - the ID of the node that needs to be collapsed
 * @param isGraphical - if the current tree is in graphical representation mode
 * @returns the mapped graph object required to find the graphical tree
 * position coordinates
 */
export function updateSyntaxTree(nodeID: string, isGraphical: boolean) {
    if (isGraphical) {
        nodeEdges = []; nodeMembers = [];
    }
    mapSyntaxGraph(isGraphical ? graphicalTreeObj : syntaxTreeObj, nodeID, isGraphical);

    return setGraph();
}

/**
 * Maps the tree object to the graph required to find positions of the graphical
 * tree nodes and edges
 */
function setGraph() {
    const treeGraph = {
        id: "root",
        layoutOptions: LAYOUT_OPTIONS,
        children: nodeMembers,
        edges: nodeEdges,
        isLocateMode: checkNodePath
    };

    return {treeGraph, syntaxTreeObj};
}
