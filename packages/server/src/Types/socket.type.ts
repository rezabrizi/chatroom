import {Socket} from 'socket.io';
import { JwtPayload } from 'jsonwebtoken';
interface CustomSocket extends Socket {
    user?: string; 
}

export default CustomSocket;