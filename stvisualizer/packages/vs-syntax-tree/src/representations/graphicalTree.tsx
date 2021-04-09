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
import React, { useEffect, useState } from "react";
import TreeNodeEdge from "../components/graphical/treeEdge";
import TreeNode from "../components/graphical/treeNode";
import { GraphicalTreeProps } from "../resources/tree-interfaces";

function GraphicalTree(props: GraphicalTreeProps) {
    const {treeGraph, onFindNode, onCollapseTree} = props;
    const [isLocateAction, setIsLocateAction] = useState(false);

    useEffect(() => {
        if (treeGraph) {
            setIsLocateAction(treeGraph.isLocateMode);
        }
    }, [treeGraph]);

    return (
        <div>
            {treeGraph && (
                <div>
                    {treeGraph.children.map((item, id) => (
                        <TreeNode
                            key = {id}
                            node = {item}
                            isLocateAction = {isLocateAction}
                            onFindNode = {() => onFindNode(item.position)}
                            onCollapseTree = {() => onCollapseTree(item.id, true)}
                        />
                    ))}

                    <svg
                        width = {treeGraph.width}
                        height = {treeGraph.height}
                    >
                        {treeGraph.edges.map((item, id) => (
                            <TreeNodeEdge
                                key = {id}
                                edge = {item}
                                isLocateAction = {isLocateAction}
                            />
                        ))}
                    </svg>
                </div>
            )}
        </div>
    );
}

export default GraphicalTree;
