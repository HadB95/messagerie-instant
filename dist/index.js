"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
// Serve les fichiers statiques depuis le dossier "client"
app.use(express_1.default.static("client"));
app.get("/", (req, res) => {
    res.send("Le serveur de messagerie instantanée fonctionne");
});
const userSockets = {};
io.on("connection", (socket) => {
    console.log("utilisateur connecté");
    // Associer le socket au username
    const username = "johndoe"; //doit être obtenue au moment de l'authentification de l'utilisateur
    userSockets[username] = socket;
    socket.on("déconnecté", () => {
        console.log("utilisateur déconnecté");
        delete userSockets[username];
    });
    socket.on("private message", (msg) => {
        const receiverSocket = userSockets[msg.to];
        if (receiverSocket) {
            receiverSocket.emit("private message", {
                content: msg.content,
                from: msg.from,
            });
        }
    });
});
//   socket.on("chat message", (msg) => {
//     io.emit("chat message", msg);
//   });
// });
const PORT = process.env.PORT || 4200;
server.listen(PORT, () => {
    console.log(`Le serveur est sur le port ${PORT}`);
});
