import React from "react";
import { renderToReadableStream } from "react-dom/server";
import { App } from "./button/App.tsx";
import { Button } from "./button/Button.tsx";

const server = Bun.serve<{ authToken: string }>({
  async fetch(req) {
    const url = new URL(req.url);

    switch (url.pathname) {
      // homepage
      case "/": {
        const stream = await renderToReadableStream(
          <App>
            <Button />
          </App>,
          {
            bootstrapScripts: ["hydrateClient.js"],
          },
        );
        return new Response(stream, {
          headers: { "Content-Type": "text/html" },
        });
      }

      // .js assets
      case "/hydrateClient.js":
        return new Response(
          Bun.file(import.meta.dir + "/public/hydrateClient.js"),
        );

      // .css assets
      case "/styles.css":
        return new Response(Bun.file(import.meta.dir + "/public/styles.css"));

      // API
      case "/updateStats":
        console.log("got an update request");
        return new Response("", { status: 204 });

      // test client app
      case "/client":
        return new Response("Client!");

      default:
        return new Response("404!", { status: 404 });
    }
  },

  websocket: {
    // handler called when a message is received
    async message(ws, message) {
      console.log(`Received: ${message}`);
      // const user = getUserFromToken(ws.data.authToken);
      // await db.Message.insert({
      //     message: String(message),
      //     userId: user.id,
      // });
    },
  },
});

console.log(`Listening on localhost:${server.port}`);
