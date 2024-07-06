import http from 'http';
import {Server as SocketIOServer} from 'socket.io'; 
import app from './app'; 

const server = http.createServer(app); 
const io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
}); 


const PORT = 1337; 
server.listen(PORT, ()=> {
    console.log(`SERVER LISTENING ON ${PORT}`); 
})