import { Server } from "socket.io";
import { getAuth } from "./api/middleware/auth";

const io = new Server(3000, {
    cors: { origin: '*' }
});

io.use(async (socket: any, next) => {
    const userToken = socket.handshake.auth.token;
    const uid = await getAuth(userToken);
    if (!uid) {
        return next(new Error('Invalid token'));
    }
    socket.uid = uid;
    next();
});

export default io;
