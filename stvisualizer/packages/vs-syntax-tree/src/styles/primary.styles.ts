import { CSSProperties } from "react";

export const bodyStyle: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    position: "relative"
};

export const optionsContainer: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    minWidth: 450,
    padding: 12,
    paddingRight: 20,
    position: "fixed",
    right: 0,
    top: 0,
    width: "30vw",
    zIndex: 10
};

export const errorStyle: CSSProperties = {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10
};

export const optionBlock: CSSProperties = {
    marginRight: 10
};
