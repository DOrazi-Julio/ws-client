import { Manager, Socket } from "socket.io-client";

export const connectToServer = () => {
  const manager = new Manager("http://teslo-api-production.up.railway.app/socket.io/socket.io.js");

  const socket = manager.socket("/");
  addListeners(socket);
};

const addListeners = (socker: Socket) => {
  const serverStatusLabel = document.querySelector("#server-status")!;
  let clientsUl = document.querySelector("#client-ul")!;

  const messageInput = document.querySelector<HTMLInputElement>("#message-input")!;
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messagesUl = document.querySelector<HTMLUListElement>("#messages-ul")!;

  socker.on("connect", () => {
    serverStatusLabel.innerHTML = "Online";
  });

  socker.on("disconnect", () => {
    serverStatusLabel.innerHTML = "Offline";
  });

  socker.on("clients-updated", (clients: string[]) => {
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

    socker.emit("message-from-client", { id: "YO!!", message: messageInput.value });
    messageInput.value = "";
  });

  socker.on("message-from-server", (payload: { fullname: string; message: string }) => {
    console.log(payload);

    const newMessage = `
    <li>
    <strong>
    ${payload.fullname}
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
