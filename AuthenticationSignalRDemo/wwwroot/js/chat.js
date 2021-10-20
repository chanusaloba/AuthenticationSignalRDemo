var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// DOM Binding
function dom(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Unable to bind DOM element: ${id}`);
    }
    return element;
}
function showIf(condition, ifTrue, ifFalse) {
    ifTrue.style.display = condition ? "inherit" : "none";
    if (ifFalse) {
        ifFalse.style.display = condition ? "none" : "inherit";
    }
}
const chatDiv = dom("chatDiv");
const errorDiv = dom("errorDiv");
const logoutButton = dom("logoutButton");
const connectingDiv = dom("connectingDiv");
const connectedDiv = dom("connectedDiv");
const messageForm = dom("messageForm");
const messageInput = dom("messageInput");
const messageList = dom("messageList");
const directMessageForm = dom("directMessageForm");
const directMessageInput = dom("directMessageInput");
const toUserInput = dom("toUserInput");
class ViewModel {
    // TODO: Bind this method to a UI event that is triggered when the user is logging in
    // For example, if you add UI with a username/password box and a login button, this
    // method should be triggered when the login button is clicked.
    connect(evt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                evt.preventDefault();
                // TODO: Use the user input to acquire a JWT token from your authentication provider.
                // Or, trigger an OIDC/OAuth login flow to acquire a token.
                throw new Error("TODO: Add code to acquire the token.");
                this.loginToken = "BOGUS TOKEN. Replace this with the real token.";
                // Update rendering while we connect
                this.render();
                // Connect, using the token we got.
                this.connection = new signalR.HubConnectionBuilder()
                    .withUrl("/hubs/chat", { accessTokenFactory: () => this.loginToken })
                    .build();
                this.connection.on("ReceiveSystemMessage", (message) => this.receiveMessage(message, "green"));
                this.connection.on("ReceiveDirectMessage", (message) => this.receiveMessage(message, "blue"));
                this.connection.on("ReceiveChatMessage", (message) => this.receiveMessage(message));
                yield this.connection.start();
                this.connectionStarted = true;
            }
            catch (e) {
                this.error = `Error connecting: ${e}`;
            }
            finally {
                // Update rendering with any final state.
                this.render();
            }
        });
    }
    directMessageFormSubmitted(evt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                evt.preventDefault();
                yield this.connection.send("SendToUser", toUserInput.value, directMessageInput.value);
                directMessageInput.value = "";
            }
            catch (e) {
                this.error = `Error sending: ${e.toString()}`;
            }
            finally {
                this.render();
            }
        });
    }
    messageFormSubmitted(evt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                evt.preventDefault();
                yield this.connection.invoke("Send", messageInput.value);
                messageInput.value = "";
            }
            catch (e) {
                this.error = `Error sending: ${e.toString()}`;
            }
            finally {
                this.render();
            }
        });
    }
    receiveMessage(message, color) {
        const li = document.createElement("li");
        if (color) {
            li.style.color = color;
        }
        li.textContent = message;
        messageList.appendChild(li);
    }
    // Update the state of DOM elements based on the view model
    render() {
        errorDiv.textContent = this.error;
        // Renders the errorDiv if there's an error
        showIf(this.error, errorDiv);
        // Renders the chatDiv if we're "authenticated" and now connecting.
        showIf(this.loginToken, chatDiv);
        // Renders the "connecting..." message if we're still connecting, or the
        // full chat UI if we've connected.
        showIf(this.connectionStarted, connectedDiv, connectingDiv);
    }
    static run() {
        const model = new ViewModel();
        // Bind events
        messageForm.addEventListener("submit", (e) => model.messageFormSubmitted(e));
        directMessageForm.addEventListener("submit", (e) => model.directMessageFormSubmitted(e));
    }
}
ViewModel.run();
//# sourceMappingURL=chat.js.map