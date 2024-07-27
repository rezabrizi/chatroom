import { Socket } from "socket.io";
import { JwtPayload } from "jsonwebtoken";

// for TS you have to create an interface for the type of the socket
// it has an optional decoded field

interface CustomSocket extends Socket {
  decoded?: JwtPayload;
}

export default CustomSocket;
