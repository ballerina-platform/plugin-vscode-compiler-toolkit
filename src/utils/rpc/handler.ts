import { WebviewPanel } from "vscode";
import { WebViewMethod, WebViewRPCMessage } from "./model";

export class WebViewRPCHandler {

    private _sequence: number = 1;
    private _callbacks: Map<number, Function> = new Map();

    constructor(public methods: Array<WebViewMethod>, public webViewPanel: WebviewPanel) {
        webViewPanel.webview.onDidReceiveMessage(this._onRemoteMessage.bind(this));
        this.webViewPanel = webViewPanel;
    }

    private _getMethod(methodName: string) {
        return this.methods.find(method => (method.methodName === methodName));
    }

    private _onRemoteMessage(msg: WebViewRPCMessage) {
        if (msg.id !== undefined) {
            // this is a request from remote
            const method = this._getMethod(msg.methodName);
            if (method) {
                method.handler(msg.arguments || [], this.webViewPanel)
                    .then((response: Thenable<any>) => {
                        this.webViewPanel.webview.postMessage({
                            originId: msg.id,
                            response: JSON.stringify(response)
                        });
                    });
            }
        } else if (msg.originId !== undefined) {
            // this is a response from remote to one of our requests
            const callback = this._callbacks.get(msg.originId);
            if (callback) {
                callback(JSON.parse(msg.response));
                this._callbacks.delete(msg.originId);
            }
        }
    }

    invokeRemoteMethod(methodName: string, args: any[] = [], callback: Function) {
        const msg = {
            id: this._sequence,
            methodName,
            arguments: args,
        };
        this._callbacks.set(this._sequence, callback);
        this.webViewPanel.webview.postMessage(msg);
        this._sequence++;
    }

    static create(
        webViewPanel: WebviewPanel,
        methods: Array<WebViewMethod> = [])
        : WebViewRPCHandler {
        return new WebViewRPCHandler(
            methods,
            webViewPanel);
    }

    dispose() {
        // TODO unregister event handlers
    }
}
