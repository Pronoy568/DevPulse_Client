import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../app/hooks';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: number[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken) {
      setSocket(null);
      setOnlineUsers([]);
      return;
    }
    
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';
    const s = io(socketUrl, {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    setSocket(s);

    s.on('connect', () => {
      console.log('🔌 Connected to Socket.io');
    });

    s.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error.message);
    });

    s.on('users:online_list', (usersList: number[]) => {
      setOnlineUsers(usersList);
    });

    s.on('user:online', ({ userId }: { userId: number }) => {
      setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    });

    s.on('user:offline', ({ userId }: { userId: number }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      s.disconnect();
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
