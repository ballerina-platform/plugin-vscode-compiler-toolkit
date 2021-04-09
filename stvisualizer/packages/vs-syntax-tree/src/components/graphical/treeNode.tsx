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
import React, { useState } from "react";
import { Icon } from "semantic-ui-react";
import { GRAPHICAL_LOCATE_ICON,
         GRAPHICAL_WARNING_ICON,
         LARGE_ICON, PRIMARY_COLOR,
         SECONDARY_COLOR,
         TOKEN_COLOR,
         WARNING_COLOR } from "../../resources/constants";
import { GraphicalNodeProps } from "../../resources/tree-interfaces";
import * as styles from "../../styles/graphical-tree.styles";
import Diagnostics from "./diagnosticsPopup";
import NodeDetails from "./nodeDetailsPopup";

function TreeNode(props: GraphicalNodeProps) {
    const {node, isLocateAction, onCollapseTree, onFindNode} = props;

    const [didHoverNode, setHoverNodeState] = useState(false);
    const [didHoverWarning, setHoverWarningState] = useState(false);

    function updateHoverNodeState(status: boolean) {
        setHoverNodeState(status);
    }

    function updateHoverWarningState(status: boolean) {
        setHoverWarningState(status);
    }

    function onClickNode() {
        if (node.ifParent) {
            updateHoverNodeState(false);
            onCollapseTree();
        }
    }

    return (
        <div>
            <div
                style = {{
                    ...styles.nodeContainerStyle,
                    backgroundColor: node.nodeColor,
                    boxShadow: node.isCollapsible ? "2px 4px 2px #9E9E9E" : "none",
                    height: node.height,
                    left: node.x,
                    opacity: isLocateAction ? (node.isNodePath ? 1 : 0.55) : 1,
                    top: node.y,
                    width: node.width
                }}
            >
                <div
                    style = {styles.labelContainerStyle}
                    onMouseLeave = {() => updateHoverNodeState(false)}
                    onMouseOver = {() => updateHoverNodeState(true)}
                >
                    {didHoverNode && node.position && (
                        <div
                            style = {{
                                ...styles.iconStyle,
                                cursor: "pointer"
                            }}
                            onClick = {onFindNode}
                        >
                            <Icon
                                name = {GRAPHICAL_LOCATE_ICON}
                                color = {node.nodeColor === TOKEN_COLOR ? PRIMARY_COLOR : SECONDARY_COLOR}
                                circular
                                inverted
                            />
                        </div>
                    )}
                    <div onClick = {onClickNode}>
                        {node.label}
                    </div>
                </div>

                {node.hasDiagnostics && node.diagnostics.length && (
                    <div
                        style = {styles.iconStyle}
                        onMouseLeave = {() => updateHoverWarningState(false)}
                        onMouseOver = {() => updateHoverWarningState(true)}
                    >
                        <Icon
                            name = {GRAPHICAL_WARNING_ICON}
                            size = {LARGE_ICON}
                            color = {WARNING_COLOR}
                        />
                    </div>
                )}
            </div>

            {didHoverNode && <NodeDetails node = {node} />}
            {didHoverWarning && <Diagnostics node = {node} />}
        </div>
    );
}

export default TreeNode;
