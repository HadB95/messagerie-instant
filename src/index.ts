import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve les fichiers statiques depuis le dossier "client"
app.use(express.static("client"));

app.get("/", (req, res) => {
  res.send("Le serveur de messagerie instantanée fonctionne");
});

io.on("connection", (socket: Socket) => {
  console.log("utilisateur connecté");

  socket.on("déconnecté", () => {
    console.log("utilisateur déconnecté");
  });

  socket.on("chat message", (messageData) => {
    io.emit("chat message", messageData);
  });
});

const PORT = process.env.PORT || 4100;
server.listen(PORT, () => {
  console.log(`Le serveur est sur le port ${PORT}`);
});
