import { CSSProperties } from "react";

export const treeEdgeStyles: CSSProperties = {
    stroke: "black"
};

export const nodeContainerStyle: CSSProperties = {
    borderRadius: 10,
    cursor: "default",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    lineHeight: "50px",
    paddingLeft: 3,
    paddingRight: 3,
    position: "absolute"
};

export const labelContainerStyle: CSSProperties = {
    color: "white",
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "center"
};

export const iconStyle: CSSProperties = {
    height: "100%",
    paddingLeft: 2,
    paddingRight: 2
};

export const popupArrowStyle: CSSProperties = {
    borderLeft: "7.5px solid transparent",
    borderRight: "7.5px solid transparent",
    height: 0,
    position: "absolute",
    transform: "translateX(-40%)",
    width: 0
};

export const popupBodyStyle: CSSProperties = {
    backgroundColor: "#f5f5f0",
    borderRadius: 8,
    minHeight: 190,
    minWidth: 175,
    padding: 10,
    position: "absolute",
    textAlign: "left",
    zIndex: 1
};

export const diagnosticsBodyStyle: CSSProperties = {
    backgroundColor: "#FFE7E7",
    borderRadius: 5,
    minWidth: 160,
    padding: 10,
    position: "absolute",
    textAlign: "left",
    zIndex: 1
};

export const titleFontStyle: CSSProperties = {
    fontWeight: "bold"
};
