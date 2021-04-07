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
import React from "react";
import { DIAGNOSTICS,
         ENDING_POS,
         ERROR_MESSAGE,
         INVALID_TOKEN,
         LEADING_MINUTIAE,
         MINUTIAE,
         NODE_KIND,
         NONE,
         STARTING_POS,
         TRAILING_MINUTIAE } from "../../resources/constants";
import { DropdownDetailsProps } from "../../resources/tree-interfaces";
import * as styles from "../../styles/dropdown-tree.styles";
import DropdownArrayDetails from "./detailsArrayCard";
import DropdownDetails from "./detailsCard";

function DropdownNodeDetails(props: DropdownDetailsProps) {
    const {treeNode} = props;

    return (
        <div style = {styles.detailsBlockStyle}>
            {!treeNode && <text> {ERROR_MESSAGE} </text>}

            {treeNode &&
                <div>
                    {treeNode.value.length > 25 && treeNode.kind === INVALID_TOKEN &&
                        <DropdownDetails
                            title = "Value"
                            value = {treeNode.value}
                        />
                    }

                    <DropdownDetails
                        title = {NODE_KIND}
                        value = {treeNode.kind}
                    />

                    {treeNode.position &&
                        <div>
                            <DropdownDetails
                                title = {STARTING_POS}
                                value = {"(" + (treeNode.position.startLine + 1) + ", "
                                            + (treeNode.position.startColumn + 1) + ")"}
                            />

                            <DropdownDetails
                                title = {ENDING_POS}
                                value = {"(" + (treeNode.position.endLine + 1) + ", "
                                            + (treeNode.position.endColumn + 1) + ")"}
                            />
                        </div>
                    }

                    {treeNode.leadingMinutiae && treeNode.leadingMinutiae.length > 0 &&
                        <DropdownArrayDetails
                            title = {LEADING_MINUTIAE}
                            type = {MINUTIAE}
                            value = {treeNode.leadingMinutiae}
                        />
                    }

                    {(!treeNode.leadingMinutiae || treeNode.leadingMinutiae.length < 1) &&
                        <DropdownDetails
                            title = {LEADING_MINUTIAE}
                            value = {NONE}
                        />
                    }

                    {treeNode.trailingMinutiae && treeNode.trailingMinutiae.length > 0 &&
                        <DropdownArrayDetails
                            title = {TRAILING_MINUTIAE}
                            type = {MINUTIAE}
                            value = {treeNode.trailingMinutiae}
                        />
                    }

                    {(!treeNode.trailingMinutiae || treeNode.trailingMinutiae.length < 1) &&
                        <DropdownDetails
                            title = {TRAILING_MINUTIAE}
                            value = {NONE}
                        />
                    }

                    {treeNode.diagnostics && treeNode.diagnostics.length > 0 &&
                        <DropdownArrayDetails
                            title = {DIAGNOSTICS}
                            type = {DIAGNOSTICS}
                            value = {treeNode.diagnostics}
                        />
                    }

                    {(!treeNode.diagnostics || treeNode.diagnostics.length < 1) &&
                        <DropdownDetails
                            title = {DIAGNOSTICS}
                            value = {NONE}
                        />
                    }
                </div>
            }
        </div>
    );
}

export default DropdownNodeDetails;
