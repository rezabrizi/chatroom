import express, {Request, Response} from 'express'; 
import User from './models/user.models';
import Session from './models/session.models';
import {IGetUserAuthInfoRequest} from './Types/request.type';
import socketIo, {Socket, Server as SocketIOServer} from 'socket.io';
import jwt, {Jwt, JwtPayload, VerifyErrors} from 'jsonwebtoken';
import CustomSocket from './Types/socket.type';

const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express(); 
const server = http.createServer(app); 
const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

const JWT_SECRET = "THIS IS A TEST"; 


app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/chat-app');

app.post('/api/register', async (req: Request, res: Response)=> {
    console.log(req.body);
    try{ 
        const user = await User.create({
            username: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.json({status :'ok'});
    } catch(err) { 
        console.log(err);
        res.json({status: 'error', error:'Duplicate Email'})
    }
})


app.post('/api/login', async (req: Request, res: Response)=> {
    try {
        const {email, password} = req.body; 
        const user = await User.findOne({email: email, password: password })
        if (user) {
            const existingSession = await Session.findOne({userId: user._id});
            if (existingSession) {
                return res.status(400).json({status: 'error', message: 'User already logged in. '});
            } 
            const token = jwt.sign({userId: user.username, email: user.email }, JWT_SECRET, {expiresIn: '1h'});
            await Session.create({userId: user._id, token}); 
            res.json({status :'ok', token});
        } else {
            res.status(401).json({status: 'error', message: "Invalid credentials"}); 
        }
    } catch (err) {
        console.error(err); 
        res.status(500).json({status: 'error', message: 'Server error'}); 
    }
});


app.post('/api/logout', verifyToken, async(req: Request, res: Response)=> {
    const token = req.headers.authorization?.split(' ')[1];

    const session = await Session.findOne({token});
    if(!session) {
        return res.status(400).json({status: 'error', message: 'Invalid token or expired'});
    }
    
    await Session.deleteOne({ token })
    res.json({status: 'ok', message: 'Logged out.'});
})


app.get('/api/profile', verifyToken, (req: IGetUserAuthInfoRequest, res: Response) => {
    res.json({status: 'ok', user: req.user});
})

function verifyToken (req: IGetUserAuthInfoRequest, res: Response, next: any) {
    const token = req.headers.authorization?.split(' ')[1]; 

    if(!token) {
        return res.status(401).json({status: 'error', message: 'Unauthorized'});
    }

    try {
        jwt.verify(token, JWT_SECRET, (err, decoded)=> {
            if (err && req.path !== "/api/logout"){
                return res.status(401).json({status: "error", message: "Invalid Token"});
            }
            if (!err)
                req.user = decoded as {userId: string; email:string}; 
            next();
        });
    } catch(err) {
        return res.status(401).json({status: 'error', message: 'Invalid token'});
    }
}

io.use((socket: CustomSocket, next) => {
    const token = socket.handshake.query.token as string; 
    if (token) {
        jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
            if (err) {
                return next(new Error('Authentication Error')); 
            }
            socket.user = (decoded as JwtPayload).userId; 
            next();
        });
    } else {
        next(new Error('Authentication Error')); 
    }
});



io.on('connection', (socket: CustomSocket) => {
    console.log('New client connected');
  
    socket.on('sendMessage', (message) => {
      console.log('Message received:', socket.user, ' ', message);
      io.emit('message', {user: socket.user, message: message.message});
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  
server.listen(1337, () => {
    console.log('Server started on port 1337');
});
