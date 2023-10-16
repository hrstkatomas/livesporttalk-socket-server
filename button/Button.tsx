import React, { useEffect } from "react";

const socket = new WebSocket("ws://localhost:4000");

export function Button() {
  const [count, setCount] = React.useState(0);

  const onClick = () => {
    socket.send("update");
    setCount((count) => count + 1);
  };

  useEffect(() => {
    // TODO: track current enforcers count
    const onMessage = (event: MessageEvent) => console.log(event.data);
    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);
  }, []);

  return (
    <>
      <div className={"text"}>Updates caused:</div>
      <div className={"text text-large"}>{count}</div>

      <div className={"button-wrapper"}>
        <button onClick={onClick}>
          Cause an update!!!
          {Array.from({ length: 6 }, (v, i) => (
            <div key={`parrot-${i}`} className={"parrot"} />
          ))}
        </button>
      </div>
    </>
  );
}
