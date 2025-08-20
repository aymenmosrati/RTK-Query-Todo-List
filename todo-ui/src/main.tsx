import { createRoot } from "react-dom/client";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { todosApi } from "./api/todosApi.ts";
import App from "./App.tsx";
import "./_index.scss";

createRoot(document.getElementById("root")!).render(
  <ApiProvider api={todosApi}>
    <App />
  </ApiProvider>
);
