export interface TreeNode {
    nodeID: string;
    value: string;
    kind: string;
    parentID: string;
    didCollapse: boolean;
    children: TreeNode[];
    leadingMinutiae: any[];
    trailingMinutiae: any[];
    errorNode?: any;
    isNodePath?: boolean;
    diagnostics: any[];
    position: Position;
}

export interface Position {
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
}
