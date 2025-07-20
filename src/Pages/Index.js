import React from "react";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div
        className="w-full max-w-md aspect-square flex items-center justify-center bg-slate-400 cursor-pointer"
        onClick={() => navigate("/product")}
      >
        <h4 className="text-2xl">Brand ABC</h4>
      </div>
    </div>
  );
}

export default Index;
