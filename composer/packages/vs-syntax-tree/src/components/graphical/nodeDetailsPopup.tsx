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
import { LEADING_MINUTIAE, NODE_KIND, NONE, TRAILING_MINUTIAE } from "../../resources/constants";
import { GraphicalDetailsProps, Minutiae } from "../../resources/tree-interfaces";
import * as styles from "../../styles/graphical-tree.styles";

function NodeDetails(props: GraphicalDetailsProps) {
    const [isEdgeNode, setIsEdgeNode] = useState(false);
    const [isBottomNode, setIsBottomNode] = useState(false);

    useEffect(() => {
        if (props.node.x + 400 > window.innerWidth) {
            setIsEdgeNode(true);
        }

        if (props.node.y + 350 > window.innerHeight) {
            setIsBottomNode(true);
        }
    }, []);

    const mapMinutiae = (minutiaeArray: Minutiae[]) => {
        return minutiaeArray.map((item, id) => {
            if (!item.isInvalid) {
                return <p key = {id}>
                        {item.kind}
                    </p>;
            } else {
                return ;
            }
        });
    };

    return (
        <div>
            <div
                style = {{
                    ...styles.popupArrowStyle,
                    borderBottom: isBottomNode ? "none" : "15px solid #f5f5f0",
                    borderTop: isBottomNode ? "15px solid #f5f5f0" : "none",
                    left: props.node.x + (props.node.width / 2),
                    top: isBottomNode ? (props.node.y - 15) : (props.node.y + 50),
                    transform: "translateX(-40%)"
                }}
            />
            <div
                style = {{
                    ...styles.popupBodyStyle,
                    left: props.node.x + (props.node.width / 2),
                    top: isBottomNode ? (props.node.y - 15) : (props.node.y + props.node.height + 15),
                    transform: isBottomNode ? (isEdgeNode ? "translate(-80%, -100%)" : "translate(-10%, -100%)") :
                        (isEdgeNode ? "translateX(-80%)" : "translateX(-10%)")
                }}
            >
                <p> <b>{NODE_KIND} :</b>  {props.node.kind}</p><hr/>

                {props.node.position &&
                    <div>
                        <p> <b>Position :</b>
                            {" (" + (props.node.position.startLine + 1) + ", "
                                + (props.node.position.startColumn + 1) + ") , ("
                                + (props.node.position.endLine + 1) + ", "
                                + (props.node.position.endColumn + 1) + ")"
                            }
                        </p> <hr/>
                    </div>
                }

                <p style = {styles.titleFontStyle}>
                    {LEADING_MINUTIAE}
                </p>
                {props.node.leadingMinutiae && props.node.leadingMinutiae.length  > 0 &&
                    mapMinutiae(props.node.leadingMinutiae)
                }
                {(!props.node.leadingMinutiae || props.node.leadingMinutiae.length < 1) && <p> {NONE} </p>} <hr/>

                <p style = {styles.titleFontStyle}>
                    {TRAILING_MINUTIAE}
                </p>
                {props.node.trailingMinutiae && props.node.trailingMinutiae.length > 0 &&
                    mapMinutiae(props.node.trailingMinutiae)
                }
                {(!props.node.trailingMinutiae || props.node.trailingMinutiae.length < 1) && <p> {NONE} </p>}
            </div>
        </div>
    );
}

export default NodeDetails;
