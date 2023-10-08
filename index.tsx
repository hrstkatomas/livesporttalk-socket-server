import React from "react";
import { renderToReadableStream } from "react-dom/server";
import { App } from "./button/App.tsx";
import { Button } from "./button/Button.tsx";

const webServer = Bun.serve({
  port: process.env.WEB_SERVER_PORT,
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
            bootstrapScripts: ["hydrateButton.js"],
          },
        );
        return new Response(stream, {
          headers: { "Content-Type": "text/html" },
        });
      }

      // .js assets
      case "/hydrateButton.js":
        return new Response(
          Bun.file(import.meta.dir + "/public/hydrateButton.js"),
        );

      // .css assets
      case "/styles.css":
        return new Response(Bun.file(import.meta.dir + "/public/styles.css"));

      // test client app
      case "/client": {
        const stream = await renderToReadableStream(<App />, {
          bootstrapScripts: ["renderClient.js"],
        });
        return new Response(stream, {
          headers: { "Content-Type": "text/html" },
        });
      }

      // .js assets
      case "/renderClient.js":
        return new Response(
          Bun.file(import.meta.dir + "/public/renderClient.js"),
        );

      default:
        return new Response("404!", { status: 404 });
    }
  },
});

console.log(`Web server listening on localhost:${webServer.port}`);

const ENFORCER = "enforcer";
const LISTENER = "listener";

const users = new Set<string>();

const socketServer = Bun.serve<{
  username: string;
  role: typeof ENFORCER | typeof LISTENER;
}>({
  port: process.env.SOCKET_SERVER_PORT,
  fetch(req, server) {
    const username = "user_" + Math.random().toString(16).slice(12);
    const url = new URL(req.url);
    const role = url.pathname === "/listener" ? LISTENER : ENFORCER;

    const success = server.upgrade(req, {
      data: { username, role },
    });

    return success
      ? undefined
      : new Response("Upgrade failed!", { status: 500 });
  },

  websocket: {
    open(ws) {
      // Subscribe to the channel for given role
      ws.subscribe(ws.data.role);

      // track enforcers count
      if (ws.data.role === ENFORCER) {
        users.add(ws.data.username);

        ws.publish(
          ENFORCER,
          JSON.stringify({ type: "ENFORCER_COUNT", data: users.size }),
        );
      }
    },

    message(ws, data) {
      // on whatever enforcer message udpate listeners
      if (ws.data.role === ENFORCER) {
        // TODO: create custom data instead of string
        ws.publish(LISTENER, JSON.stringify({ type: "UPDATE", data: "ping!" }));
      }
    },

    close(ws) {
      // Unsubscribe from the channel for given role
      ws.unsubscribe(ws.data.role);

      // track enforcers count
      if (ws.data.role === ENFORCER) {
        users.delete(ws.data.username);

        socketServer.publish(
          ENFORCER,
          JSON.stringify({ type: "ENFORCER_COUNT", data: users.size }),
        );
      }
    },
  },
});

console.log(`Socket server listening on localhost:${socketServer.port}`);
