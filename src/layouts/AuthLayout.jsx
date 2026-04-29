import React from "react";
import { Outlet } from "react-router-dom";
import img from "../assets/image.png";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex">
      <div className="flex-1 bg-sf-bgGray">
        <div
          className="w-full h-full bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${img})` }}
        />
      </div>

      <div className="w-[420px] bg-sf-greenDark">
        <div className="w-full px-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
