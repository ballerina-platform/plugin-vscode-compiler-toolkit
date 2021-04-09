export const EXTENSION_NAME = "Ballerina Syntax Tree Visualizer";
export const EXTENSION_ID = "visualizeSyntaxTree";

export const FULL_TREE_VISUALIZER_COMMAND = "ballerinaCompilerToolkit.visualizeSyntaxTree";
export const SUBTREE_VISUALIZER_COMMAND = "ballerinaCompilerToolkit.codeBlock.visualizeSyntaxTree";
export const LOCATE_NODE_COMMAND = "ballerinaCompilerToolkit.codeBlock.locateTreeNode";

export const SUBTREE_VISUALIZER_TITLE = "Visualize Sub Syntax Tree";
export const LOCATE_NODE_TITLE = "Locate Node on Syntax Tree";

export const FULL_TREE_VIEW  = "Full Tree View";
export const SUB_TREE_VIEW = "Sub Tree View";
export const LOCATE_TREE_VIEW = "Locate Node View";

export const FETCH_FULL_TREE_METHOD = "fetchSyntaxTree";
export const FETCH_SUB_TREE_METHOD = "fetchSubTree";
export const FETCH_LOCATE_TREE_METHOD = "fetchLocateTree";
export const ON_COLLAPSE_METHOD = "onCollapseTree";
export const MAP_TREE_GRAPH_METHOD = "fetchTreeGraph";

export const ERROR_MESSAGE = "Oops! Something went wrong!";
export const END_TOKEN = "EofToken";
export const INVALID_TOKEN = "InvalidToken";
export const INVALID_TOKEN_MESSAGE = "Invalid Token '";
export const TRAILING_QUOTATION = "'";
export const MISSING = "Missing ";

export const ERROR_NODE_COLOR = "#DB3247";
export const PARENT_NODE_COLOR = "#20b6b0";
export const TOKEN_COLOR = "#7f7f7f";
export const PATH_NODE_COLOR = "#1b9894";

export const LAYOUT_OPTIONS = {
    "elk.algorithm": "layered",
    "elk.direction": "DOWN",
    "elk.edgeRouting": "POLYLINE",
    "elk.layered.crossingMinimization.semiInteractive": "true",
    "elk.layered.mergeEdges": "true",
    "elk.spacing.nodeNode": "15"
};
