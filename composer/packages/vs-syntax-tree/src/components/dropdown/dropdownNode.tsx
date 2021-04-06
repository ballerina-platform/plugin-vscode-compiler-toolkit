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
import { Icon } from "semantic-ui-react";
import { COLLAPSED_ARROW_ICON,
         COLLAPSIBLE_ARROW_ICON,
         DEFAULT_DROPDOWN_COLOR,
         DROPDOWN_LOCATE_ICON,
         DROPDOWN_WARNING_ICON,
         LARGE_ICON,
         NON_COLLAPSIBLE_ICON,
         PRIMARY_COLOR,
         SMALL_ICON,
         WARNING_COLOR } from "../../resources/constants";
import { DropdownNodeProps } from "../../resources/tree-interfaces";
import * as styles from "../../styles/dropdown-tree.styles";

function DropdownNode(props: DropdownNodeProps) {
    const [ifCollapsible, setIfCollapsible] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [hoverStatus, setHoverStatus] = useState(false);

    useEffect(() => {
        if (props.treeNode.children && props.treeNode.children.length) {
            setIfCollapsible(true);
        }

        setShowDetails(props.detailedNode === props.treeNode.nodeID ? true : false);
        setIsCollapsed(props.treeNode.didCollapse);
    }, [props.treeNode, props.detailedNode]);

    function updateHoverStatus(state: boolean) {
        setHoverStatus(state);
    }

    function onClickNode() {
        props.onClick(props.treeNode);
        setShowDetails(true);
    }

    return (
        <div>
            <div
                onMouseOver = {() => { props.treeNode.position ? updateHoverStatus(true) : {}; }}
                onMouseLeave = {() => updateHoverStatus(false)}
                style = {{
                    ...styles.dropdownNodeStyle,
                    backgroundColor: showDetails ? "#f5f5f0" : "white",
                    fontStyle: showDetails ? "italic" : "normal",
                    marginLeft: props.treeLevel * 35
                }}
            >
                <div style = {styles.dropdownArrowStyle}>
                    {!ifCollapsible &&
                        <Icon
                            name = {NON_COLLAPSIBLE_ICON}
                            size = {SMALL_ICON}
                            color = {props.treeNode.errorNode ? WARNING_COLOR : DEFAULT_DROPDOWN_COLOR}
                        />
                    }

                    {ifCollapsible && isCollapsed &&
                        <Icon
                            name = {COLLAPSED_ARROW_ICON}
                            size = {LARGE_ICON}
                            color = {props.treeNode.errorNode ? WARNING_COLOR : DEFAULT_DROPDOWN_COLOR}
                            onClick = {ifCollapsible ? () => props.onCollapseTree(props.treeNode.nodeID, false)
                                : () => {}}
                        />
                    }

                    {ifCollapsible && !isCollapsed &&
                        <Icon
                            name = {COLLAPSIBLE_ARROW_ICON}
                            size = {LARGE_ICON}
                            color = {props.treeNode.errorNode ? WARNING_COLOR : DEFAULT_DROPDOWN_COLOR}
                            onClick = {ifCollapsible ? () => props.onCollapseTree(props.treeNode.nodeID, false)
                                : () => {}}
                        />
                    }
                </div>

                <div
                    style = {{
                        ...styles.nodeLabelStyle,
                        color: props.treeNode.errorNode ? WARNING_COLOR : DEFAULT_DROPDOWN_COLOR,
                        fontWeight: props.treeNode.isNodePath ? "bold" : "normal"
                    }}
                    onClick = {onClickNode}
                >
                    {props.treeNode.value.length > 25 ? props.treeNode.kind : props.treeNode.value}

                    {ifCollapsible && !props.treeNode.didCollapse && props.treeNode.diagnostics &&
                        props.treeNode.diagnostics.length > 0 &&
                        <div style = {styles.iconStyle}>
                            <Icon
                                name = {DROPDOWN_WARNING_ICON}
                                color = {WARNING_COLOR}
                            />
                        </div>
                    }
                </div>

                <div style = {{
                    ...styles.iconStyle,
                    cursor: "pointer",
                    marginRight: 4
                }}>
                    {hoverStatus && props.treeNode.position &&
                        <Icon
                            name = {DROPDOWN_LOCATE_ICON}
                            circular
                            inverted
                            color = {PRIMARY_COLOR}
                            size = {SMALL_ICON}
                            onClick = {() => { props.onFindNode(props.treeNode.position); }}
                        />
                    }
                </div>
            </div>

            {ifCollapsible && isCollapsed &&
                props.treeNode.children.map((item, id) => {
                    const level = props.treeLevel + 1;

                    return <DropdownNode
                                key = {id}
                                treeNode = {item}
                                treeLevel = {level}
                                detailedNode = {props.detailedNode}
                                onClick = {props.onClick}
                                onCollapseTree = {props.onCollapseTree}
                                onFindNode = {props.onFindNode}
                            />;
                })
            }
        </div>
    );
}

export default DropdownNode;
