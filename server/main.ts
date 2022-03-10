import { createServer } from "http";
import { Server } from "socket.io";
import { intitialState, tileState } from "./dto/stateDto";

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

    socket.on("key", (value) => {
        let userState = state.users.filter((user) => { 
            user.userID == socket.id;
        }).pop();
        console.log(socket.id);
        console.log(userState);

        if(value == 'left'){
            let newXCoordinate = userState.xCoordinates - 1;
            if(state.grid[newXCoordinate][userState.yCoordinates] == (tileState.Free ||
                tileState.Damage)){
                userState.xCoordinates = newXCoordinate;
            }
        } else if(value == 'up'){
            let newYCoordinate = userState.yCoordinates + 1;
            if(state.grid[newYCoordinate][userState.yCoordinates] == (tileState.Free ||
                tileState.Damage)){
                userState.xCoordinates = newYCoordinate;
            }
        } else if(value == 'right'){
            let newXCoordinate = userState.xCoordinates + 1;
            if(state.grid[newXCoordinate][userState.yCoordinates] == (tileState.Free ||
                tileState.Damage)){
                userState.xCoordinates = newXCoordinate;
            }       
        } else if(value == 'down'){
            let newYCoordinate = userState.yCoordinates - 1;
            if(state.grid[newYCoordinate][userState.yCoordinates] == (tileState.Free ||
                tileState.Damage)){
                userState.xCoordinates = newYCoordinate;
            }
        } else if(value == 'space'){

        } else {
            return 'WUUUTTT'
        }
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