"use strict";
exports.__esModule = true;
var socket_io_1 = require("socket.io");
var io = new socket_io_1.Server();
io.on("connection", function (socket) {
    socket.emit("noArg");
    socket.emit("basicEmit", 1, "2", Buffer.from([3]));
    socket.emit("withAck", "4", function (e) {
        // e is inferred as number
    });
    // works when broadcast to all
    io.emit("noArg");
    // works when broadcasting to a room
    io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));
});
