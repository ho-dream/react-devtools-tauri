import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import ViteLogo from './assets/vite.svg';
import TauriLogo from './assets/tauri.svg';
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [wsMessage, setWsMessage] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(() => {
    // 创建 WebSocket 连接
    const socket = new WebSocket('ws://127.0.0.1:3000/ws');

    // 监听连接打开事件
    socket.addEventListener('open', (_event) => {
      console.log('WebSocket 连接已打开');
      socket.send('Hello Server!');
    });

    // 监听消息事件
    socket.addEventListener('message', (event) => {
      console.log('收到消息:', event.data);
      setWsMessage(event.data);
    });

    // 监听连接关闭事件
    socket.addEventListener('close', (_event) => {
      console.log('WebSocket 连接已关闭');
    });

    // 监听错误事件
    socket.addEventListener('error', (event) => {
      console.error('WebSocket 发生错误:', event);
    });

    // 组件卸载时关闭 WebSocket 连接
    return () => {
      socket.close();
    };
  }, []);

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={ViteLogo} className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank" rel="noreferrer">
          <img src={TauriLogo} className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
      <p>WebSocket 消息: {wsMessage}</p>
    </main>
  );
}

export default App;
