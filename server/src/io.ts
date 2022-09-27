import { Server, Socket } from 'socket.io';
import { getAuth } from './api/middleware/auth';

const io = new Server(3000, {
  cors: { origin: '*' },
});

io.use(async (socket: Socket, next) => {
  const userToken = (
    socket.handshake.auth as unknown as { token: string | null }
  ).token;
  if (!userToken) {
    return next(new Error('Invalid token'));
  }
  const uid = await getAuth(userToken);
  if (!uid) {
    return next(new Error('Invalid token'));
  }
  (socket as unknown as { uid: string }).uid = uid;
  next();
});

export default io;
