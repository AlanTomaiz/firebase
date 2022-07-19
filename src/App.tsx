import React, { useCallback, useEffect, useState } from 'react'

import { Firebase, IChatData } from './services/firebase'

const App: React.FC = () => {
  const [user, setUser] = useState('');
  const [messages, setMessages] = useState<IChatData[]>([]);

  const start = useCallback(async () => {
    const userName = await prompt('Qual seu nick?');
    setUser(userName as string);

    await Firebase.getMessages(setMessages);
  }, []);

  // @ts-expect-error Type
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const input = document.getElementById('messageInput') as HTMLInputElement;
    const message = input.value

    await Firebase.addMessage(user, message);
    input.value = '';
  }, [user]);

  useEffect(() => {
    start();
  }, [start]);

  return (
    <div id="container">
      <div className="chat-box">
        <div className="timeline">
          {messages.map(item => (
          <div className={`message-box ${user === item.userName ? 'me' : ''}`} key={item.id}>
            <header>
              <strong>{item.userName}</strong>
              <span>{item.createdAt}</span>
            </header>
            <p>{item.body}</p>
          </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input placeholder="Mensagem" id='messageInput' />
          <button>
            <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    </div>
  )
}

export default App;
