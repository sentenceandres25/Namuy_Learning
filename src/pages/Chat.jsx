import { io } from 'socket.io-client';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Chat = () => {
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const newSocket = io('http://localhost:4000', { auth: { token }});
      setSocket(newSocket);

      newSocket.on('message', (data) => {
        setMessages(prev => [...prev, data]);
      });

      return () => newSocket.close();
    }
  }, [token]);

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.emit('message', input);
      setInput('');
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      {messages.map((m, i) => (
        <div key={i}><strong>{m.user}:</strong> {m.message}</div>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Escribe un mensaje" />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default Chat;
