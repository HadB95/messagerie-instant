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

interface PrivateMessage {
  content: string;
  to: string;
  from: string;
}

const userSockets: Record<string, Socket> = {};

io.on("connection", (socket: Socket) => {
  console.log("utilisateur connecté");

  // Associer le socket au username
  const username = "johndoe"; //doit être obtenue au moment de l'authentification de l'utilisateur
  userSockets[username] = socket;

  socket.on("déconnecté", () => {
    console.log("utilisateur déconnecté");
    delete userSockets[username];
  });

  socket.on("private message", (msg: PrivateMessage) => {
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
