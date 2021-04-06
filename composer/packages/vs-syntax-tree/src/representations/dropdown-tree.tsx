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
import DropdownNode from "../components/dropdown/dropdownNode";
import DropdownNodeDetails from "../components/dropdown/dropdownNodeDetails";
import { DropdownTreeProps, TreeNodeObject } from "../resources/tree-interfaces";
import * as styles from "../styles/dropdown-tree.styles";

function DropdownTree(props: DropdownTreeProps) {
    const [detailedNode, setDetailedNode] = useState<TreeNodeObject | undefined>(undefined);

    useEffect(() => {
        setDetailedNode(props.treeNode);
    }, [props.treeNode.nodeID]);

    function updateDetailedNode(nodeProp: TreeNodeObject) {
        setDetailedNode(nodeProp);
    }

    return (
        <div style = {styles.containerStyle}>
            <div style = {{
                ...styles.sideDividerStyle,
                marginRight: 30,
                paddingRight: 20
            }}>
                <DropdownNode
                    treeNode = {props.treeNode}
                    treeLevel = {0}
                    detailedNode = {detailedNode ? detailedNode.nodeID : props.treeNode.nodeID}
                    onClick = {updateDetailedNode}
                    onCollapseTree = {props.onCollapseTree}
                    onFindNode = {props.onFindNode}
                />
            </div>

            <div style = {{
                ...styles.sideDividerStyle,
                maxWidth: 450,
                minWidth: 400
            }}>
                {detailedNode &&
                    <DropdownNodeDetails treeNode = {detailedNode} />
                }
            </div>
        </div>
    );
}

export default DropdownTree;
