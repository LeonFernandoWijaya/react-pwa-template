import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const name = location.state?.name;
  const description = location.state?.description;

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="flex flex-col gap-4 items-start">
        <button
          type="button"
          onClick={() => navigate("/product")}
          className="underline"
        >
          Back
        </button>
        <img
          src={location.state?.src}
          alt={name}
          className="w-full h-auto max-h-48 object-contain"
        />
        <h4 className="text-xl font-bold">Product Details</h4>
        <div>ID: {id}</div>
        <div>Name: {name}</div>
        <div>Desc : {description}</div>
      </div>
    </div>
  );
}

export default ProductDetails;
