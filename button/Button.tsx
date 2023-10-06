import React from "react";

export function Button() {
  const [count, setCount] = React.useState(0);
  const onClick = () => {
    void fetch("/updateStats");
    setCount((count) => count + 1);
  };

  return (
    <>
      <div className={"text"}>Updates caused:</div>
      <div className={"text text-large"}>{count}</div>

      <div className={"button-wrapper"}>
        <button onClick={onClick}>
          Cause an update!
          {Array.from({ length: 6 }, (v, i) => (
            <div key={`parrot-${i}`} className={"parrot"} />
          ))}
        </button>
      </div>
    </>
  );
}
