import React from "react";
import { Outlet } from "react-router";
import AppNavbar from "../Component/Navbar/Navbar";

const Root = () => {
  return (
    <div>
      <AppNavbar />
      <Outlet />
    </div>
  );
};

export default Root;
