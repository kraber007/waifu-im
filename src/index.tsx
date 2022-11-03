import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";

ReactDOM.render(
  // strict mode helps by giving useful warnings, will render componets twice
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<App nsfw={false} />} />
          <Route path="nsfw" element={<App nsfw={true} />} />
          <Route path="*" element={<App nsfw={false} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
