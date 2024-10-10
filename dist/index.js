"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server);
// Serve les fichiers statiques depuis le dossier "client"
app.use(express_1.default.static("client"));
app.get("/", function (req, res) {
  res.send("Le serveur de messagerie instantanée fonctionne");
});
io.on("connection", function (socket) {
  console.log("utilisateur connecté");
  socket.on("déconnecté", function () {
    console.log("utilisateur déconnecté");
  });
  socket.on("chat message", function (messageData) {
    io.emit("chat message", messageData);
  });
});
var PORT = process.env.PORT || 4100;
server.listen(PORT, function () {
  console.log("Le serveur est sur le port ".concat(PORT));
});
