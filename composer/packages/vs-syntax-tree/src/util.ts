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
import { createElement } from "react";
import { render } from "react-dom";
import { ResponseProps } from "./resources/tree-interfaces";
import SyntaxTree from "./syntaxTree";

export function renderSyntaxTree(activatedCommand: string,
                                 onFindNode: (node: object) => void,
                                 onCollapseTree: (position: string) => void,
                                 renderTree: () => Promise<ResponseProps>,
                                 switchFullTree: () => Promise<ResponseProps>,
                                 target: HTMLElement
                                ) {
    const responseDataProps = {
        activatedCommand,
        onCollapseTree,
        onFindNode,
        renderTree,
        switchFullTree
    };

    const SyntaxTreeElement = createElement(SyntaxTree, responseDataProps);
    render(SyntaxTreeElement, target);
}
