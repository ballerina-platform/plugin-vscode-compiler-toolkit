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
import { expect } from "chai";
import { fullResponseTree, locateResponseTree } from "../language-server/lang-client.test";
import { mappedSyntaxTree } from "../resources/data/dataObjects";
import { retrieveGraph, updateSyntaxTree } from "../../src/vs-syntax-tree/tools/syntax-tree-generator";
import { FULL_TREE_VIEW, LOCATE_TREE_VIEW } from "../../src/vs-syntax-tree/resources/constant-resources";

suite ("Syntax Tree Visualizer Tests", function () {
    test("Test retrieveGraph on full tree mode", function (done): void {
      let mappedResponse: any = retrieveGraph(fullResponseTree, FULL_TREE_VIEW);
      expect(mappedResponse).to.contain.keys("treeGraph", "syntaxTreeObj");
      expect(mappedResponse.treeGraph.children.length).to.equal(6);
      expect(mappedResponse.treeGraph.edges.length).to.equal(5);
      expect(mappedResponse.syntaxTreeObj[0].children.length).to.equal(3);
      expect(mappedResponse.syntaxTreeObj[0].children[0].kind).to.equal("imports");
      expect(mappedResponse.syntaxTreeObj[0].children[1].kind).to.equal("members");
      expect(mappedResponse.syntaxTreeObj[0].children[2].kind).to.equal("EofToken");
      done();
    });

    test("Test retrieveGraph on locate tree mode", function (done): void {
      let mappedResponse: any = retrieveGraph(locateResponseTree, LOCATE_TREE_VIEW);
      expect(mappedResponse).to.contain.keys("treeGraph", "syntaxTreeObj");
      expect(mappedResponse.treeGraph.children.length).to.equal(8);
      expect(mappedResponse.treeGraph.edges.length).to.equal(7);
      done();
    });

    test("Test updateSyntaxTree on locate tree mode", function (done): void {
      let mappedResponse: any = updateSyntaxTree("p40", false);
      expect(mappedResponse).to.contain.keys("treeGraph", "syntaxTreeObj");
      expect(mappedResponse.syntaxTreeObj).to.eql(mappedSyntaxTree);
      done();
    });
});
