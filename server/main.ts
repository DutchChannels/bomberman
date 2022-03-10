import { createServer } from "http";
import { Server } from "socket.io";
import { state } from "./dto/stateDto";

const httpServer = createServer();
httpServer.listen(3001);

const server = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});
let
    sequenceNumberByClient = new Map();

// event fired every time a new client connects:
server.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    // initialize this client's sequence number
    sequenceNumberByClient.set(socket, 1);

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
        sequenceNumberByClient.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
    });
    setInterval(() => {
        socket.emit("state", state);
    }, 100);
});

// sends each client its current sequence number
setInterval(() => {
    for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
        client.emit("seq-num", sequenceNumber);
        sequenceNumberByClient.set(client, sequenceNumber + 1);
    }
}, 1000);