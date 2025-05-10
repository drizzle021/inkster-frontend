import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { BaseToast, ToastConfig } from 'react-native-toast-message';
import { useTheme } from '../contexts/ThemeContext';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL;

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);



export const getToastConfig = (theme: 'light' | 'dark'): ToastConfig => ({
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#7B61FF',
        backgroundColor: theme === 'dark' ? '#222' : '#fff',
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: theme === 'dark' ? '#fff' : '#000',
      }}
      text2Style={{
        fontSize: 13,
        color: theme === 'dark' ? '#ccc' : '#444',
      }}
    />
  ),

});


export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const { theme } = useTheme();
    useEffect(() => {
      let newSocket: Socket;
  
      const connectSocket = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token || !SOCKET_URL) return;
  
        try {
          const res = await fetch(`${SOCKET_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const data = await res.json();
          setUserId(data?.id); 
        } catch (err) {
          console.error('Failed to fetch user ID for socket:', err);
          return;
        }

        newSocket = io(SOCKET_URL, {
          transports: ['websocket'],
          auth: { token },
        });
  
        setSocket(newSocket);
  
        newSocket.on('connect', () => {
          console.log('WebSocket connected');
          newSocket.emit('login');
        });
  
        newSocket.on('notification', (json: { message: string}) => {
          Toast.show({
            type: 'info',
            text1: 'New Post',
            text2: json.message,
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 50,
          });

        });

        newSocket.on('follow_notification', (json: { message: string, id: number}) => {
          if (json.id == userId){
            Toast.show({
              type: 'info',
              text1: json.message,
              position: 'top',
              visibilityTime: 4000,
              autoHide: true,
              topOffset: 50,
            });
          }
          console.log(userId)
          console.log(json.id)
        });
      };
  
      connectSocket();
  
      return () => {
        if (newSocket) {
          console.log('Disconnecting socket');
          newSocket.disconnect();
        }
      };
    }, []);
  
    return (
      <>
        <SocketContext.Provider value={{ socket }}>
          {children}
        </SocketContext.Provider>
        <Toast config={getToastConfig(theme)} />
      </>
    );
  };
  