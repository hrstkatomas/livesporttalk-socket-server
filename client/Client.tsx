import React, { useEffect } from "react";

const socket = new WebSocket("ws://localhost:4000/listener");

export function Client() {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => console.log(event.data);
    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);
  }, []);

  return <div>Listening to web sockets!</div>;
}
