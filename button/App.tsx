import React from "react";
import { Button } from "./Button.tsx";

interface AppProps {
  children?: React.ReactNode;
}
export function App({ children }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>Click it!</title>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
