/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import React from "react";
import { createRoot } from "react-dom/client";
import { Client } from "./Client.tsx";

const domNode = document.getElementById("root");
if (!domNode) throw new Error("No root element found");

const root = createRoot(domNode);
root.render(<Client />);
