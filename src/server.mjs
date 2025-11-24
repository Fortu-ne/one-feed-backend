import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import route from "./routes/index.mjs";

dotenv.config();

console.log('PORT from env:', process.env.PORT);

const app = express();

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Step 3: Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('io', io);


io.on('connection', (socket) => {
  console.log('✅ New WebSocket connection:', socket.id);
  

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});


app.use("/api", route);


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log('=================================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Socket.io ready for connections`);
  console.log('=================================');
});
