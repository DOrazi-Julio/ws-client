import { Manager, Socket } from "socket.io-client";
let socket:Socket;
export const connectToServer = (token:string) => {
  const manager = new Manager("https://teslo-api-production.up.railway.app/socket.io/socket.io.js",{
    extraHeaders:{
      authentication:token.trim()
    }
  });
  socket?.removeAllListeners();
  socket = manager.socket("/");

  addListeners();
};

const addListeners = () => {
  const serverStatusLabel = document.querySelector("#server-status")!;
  let clientsUl = document.querySelector("#client-ul")!;

  const messageInput = document.querySelector<HTMLInputElement>("#message-input")!;
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messagesUl = document.querySelector<HTMLUListElement>("#messages-ul")!;

  socket.on("connect", () => {
    serverStatusLabel.innerHTML = "Online";
  });

  socket.on("disconnect", () => {
    serverStatusLabel.innerHTML = "Offline";
  });

  socket.on("clients-updated", (clients: string[]) => {
    let clientHTML = "";
    clients.forEach((clientid) => {
      clientHTML += `
    <li>${clientid}</li>
    `;
    });

    clientsUl.innerHTML = clientHTML;
  });

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit("message-from-client", { id: "YO!!", message: messageInput.value });
    messageInput.value = "";
  });

  socket.on("message-from-server", (payload: { fullname: string; message: string }) => {
    console.log(payload);

    const newMessage = `
    <li>
    <strong>
    ${payload.fullname}: 
    </strong>
    <span>
    ${payload.message}
    </span>
    </li>
    `;

    const li = document.createElement("li");
    li.innerHTML = newMessage;
    messagesUl.append(li);
  });
};