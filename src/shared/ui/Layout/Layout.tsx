// Layout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";

import "./Layout.css";

export const Layout = () => (
  <>
    <div className="app-root">
      <Header />
      <Outlet />
    </div>
  </>
);
