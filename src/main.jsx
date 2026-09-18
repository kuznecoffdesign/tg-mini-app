import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import '@fontsource-variable/inter';
import './refinement.css';

const root=document.getElementById('root');
const app=(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if(root.dataset.prerendered) hydrateRoot(root,app);
else createRoot(root).render(app);
