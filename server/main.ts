import { createServer } from "http";
import { Server } from "socket.io";
import { intitialState } from "./dto/stateDto";

const httpServer = createServer();
httpServer.listen(3001);

const server = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});
let
    sequenceNumberByClient = new Map();

let state = intitialState;

// event fired every time a new client connects:
server.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    // initialize this client's sequence number
    sequenceNumberByClient.set(socket, 1);

    socket.on("join", (userName: string) => {
        state.users.push({
            userID : socket.id,
            userName: userName,
            kills: 0,
            deaths: 0,
            xCoordinates: 0,
            yCoordinates: 0
        })
    })

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
        state.users = state.users.filter((user) => { 
            user.userID != socket.id;
        });
        
        sequenceNumberByClient.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
    });

    setInterval(() => {  
        state.gameTime += 100;
        state.timeLeft -= 100;
        socket.emit("state", state);
    }, 10000);
});

// sends each client its current sequence number
setInterval(() => {
    for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
        client.emit("seq-num", sequenceNumber);
        sequenceNumberByClient.set(client, sequenceNumber + 1);
    }
}, 1000);