import ELK from "elkjs/lib/elk.bundled";
import * as vscode from "vscode";

import { ExtendedLangClient } from "../../core";
import { WebViewMethod } from "../../utils";
import { retrieveGraph, updateSyntaxTree } from "../tools/syntax-tree-generator";
import { ERROR_MESSAGE,
         EXTENSION_NAME,
         FETCH_FULL_TREE_METHOD,
         FETCH_LOCATE_TREE_METHOD,
         FETCH_SUB_TREE_METHOD,
         MAP_TREE_GRAPH_METHOD,
         ON_COLLAPSE_METHOD } from "./constant-resources";

const elk = new ELK();

export function getRemoteMethods(langClient: ExtendedLangClient) {
    const remoteMethods: WebViewMethod[] = [
        {
            methodName: FETCH_FULL_TREE_METHOD,
            handler: (args: any[]): Thenable<any> => {
                return langClient.getSyntaxTree(vscode.Uri.file(args[0]));
            }
        },
        {
            methodName: FETCH_SUB_TREE_METHOD,
            handler: (args: any[]): Thenable<any> => {
                return langClient.getSyntaxTreeByRange(vscode.Uri.file(args[0]), args[1]);
            }
        },
        {
            methodName: FETCH_LOCATE_TREE_METHOD,
            handler: (args: any[]): Thenable<any> => {
                return langClient.getSyntaxNodePath(vscode.Uri.file(args[0]), args[1]);
            }
        },
        {
            methodName: MAP_TREE_GRAPH_METHOD,
            handler: (args: any[]): Thenable<any> => {
                const response = retrieveGraph(args[0], args[1]);
                return evaluatePromise(response);
            }
        },
        {
            methodName: ON_COLLAPSE_METHOD,
            handler: (args: any[]): Thenable<any> => {
                const response = updateSyntaxTree(args[0], args[1]);
                return evaluatePromise(response);
            }
        }
    ];

    return remoteMethods;
}

function evaluatePromise(mapGeneratorResponse: any) {
    const retrieveProps = new Promise((resolve, reject) => {
        elk.layout(mapGeneratorResponse.treeGraph)
            .then((result) => {
                const props = {
                    treeGraph: result,
                    treeArray: mapGeneratorResponse.syntaxTreeObj
                };
                resolve(props);
            })

            .catch((e) => {
                console.log(EXTENSION_NAME, ": ", ERROR_MESSAGE, e);
                reject(e);
            });
    });

    return retrieveProps;
}
