import React, { useState } from "react";
import { Outlet } from "react-router-dom";

export const AuthContainer = () => {
  return (
    <div>
      <Outlet />
      {/* 🇨🇲 Gérez vos finances en Franc CFA au Cameroun
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500"></p>
      </div> */}
    </div>
  );
};
