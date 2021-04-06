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
import { NONE } from "../../resources/constants";
import { GraphicalDetailsProps } from "../../resources/tree-interfaces";
import * as styles from "../../styles/graphical-tree.styles";

function Diagnostics(props: GraphicalDetailsProps) {
    const [isEdgeNode, setIsEdgeNode] = useState(false);
    const [isBottomNode, setIsBottomNode] = useState(false);

    useEffect(() => {
        if (props.node.x + 400 > window.innerWidth) {
            setIsEdgeNode(true);
        }

        if (props.node.y + 250 > window.innerHeight) {
            setIsBottomNode(true);
        }
    }, []);

    return (
        <div>
            <div
                style = {{
                    ...styles.popupArrowStyle,
                    borderBottom: isBottomNode ? NONE : "15px solid #FFE7E7",
                    borderTop: isBottomNode ? "15px solid #FFE7E7" : "none",
                    left: props.node.x + props.node.width - 25,
                    top: isBottomNode ? props.node.y - 10 : props.node.y + 45
                }}
            />

            <div
                style = {{
                    ...styles.diagnosticsBodyStyle,
                    left: props.node.x + props.node.width - 40,
                    top: isBottomNode ? props.node.y - 10 : props.node.y + props.node.height + 10,
                    transform: isBottomNode ? (isEdgeNode ? "translate(-80%, -100%)" : "translate(-10%, -100%)")
                        : (isEdgeNode ? "translateX(-80%)" : "translateX(-10%)")
                }}
            >
                <p> <b>This block contains :</b></p> <hr/>
                {props.node.diagnostics.map((item, id) => {
                        return <p key = {id}>
                                   {item.message}
                               </p>;
                    })
                }
            </div>
        </div>
    );
}

export default Diagnostics;
