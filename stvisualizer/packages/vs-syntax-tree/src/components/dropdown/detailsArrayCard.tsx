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
import { MINUTIAE } from "../../resources/constants";
import { DetailsArrayCardProp } from "../../resources/tree-interfaces";
import * as styles from "../../styles/dropdown-tree.styles";

function DropdownArrayDetails(props: DetailsArrayCardProp) {
    const {title, type, value} = props;

    return (
        <div style = {styles.detailsCardStyle}>
            <div style = {styles.detailsCardTitleStyle}>
                {title}
            </div>

            {value && (
                <div style = {styles.detailsArrayValueBlock}>
                    {value.map((item, id) => {
                        if (type === MINUTIAE) {
                            if (!item.isInvalid) {
                                return (
                                    <div
                                        key = {id}
                                        style = {styles.detailsCardValueStyle}
                                    >
                                        - {item.kind}
                                    </div>
                                );
                            } else {
                                return;
                            }
                        } else {
                            return (
                                <div
                                    key = {id}
                                    style = {styles.detailsCardValueStyle}
                                >
                                    - {item.message}
                                </div>
                            );
                        }
                    })}
                </div>
            )}
        </div>
    );
}

export default DropdownArrayDetails;
