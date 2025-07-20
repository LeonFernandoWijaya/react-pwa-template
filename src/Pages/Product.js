import React from "react";
import { useNavigate } from "react-router-dom";
import { openDB } from "idb";
import { useEffect, useState } from "react";
import productsData from "../Data/productData";

// Utility function to initialize IndexedDB
const initDB = async () => {
  const db = await openDB("ProductDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
  return db;
};

const clearDB = async () => {
  const password = prompt("Enter password to clear data:");
  const correctPassword = "12345"; // Hardcoded password

  if (password === correctPassword) {
    const db = await initDB();
    await db.clear("products"); // Clear all data in the 'products' object store
    alert("All data has been cleared from IndexedDB!");
  } else {
    alert("Incorrect password!");
  }
};

// Function to save product to IndexedDB
const saveProduct = async (productName) => {
  const db = await initDB();
  await db.add("products", {
    name: productName,
    timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
  });
};

// Function to convert data to CSV
const convertToCSV = (data) => {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]).join(","); // Create CSV headers
  const rows = data.map((row) =>
    Object.values(row)
      .map((value) => `"${value}"`) // Escape values with quotes
      .join(",")
  );
  return [headers, ...rows].join("\n"); // Combine headers and rows
};

// Function to download CSV file
const downloadCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Function to retrieve data from IndexedDB and download as CSV
const retrieveData = async () => {
  const password = prompt("Enter password to retrieve data:");
  const correctPassword = "12345"; // Hardcoded password

  if (password === correctPassword) {
    const db = await initDB();
    const products = await db.getAll("products");

    if (products.length === 0) {
      alert("No data found!");
      return;
    }

    const csv = convertToCSV(products); // Convert data to CSV
    downloadCSV(csv, "products.csv"); // Trigger CSV download
    alert("CSV file downloaded!");
  } else {
    alert("Incorrect password!");
  }
};

function Product() {
  const navigate = useNavigate();

  // Ambil startIdx dari localStorage jika ada
  const getInitialIdx = () => {
    const saved = localStorage.getItem("productStartIdx");
    return saved ? parseInt(saved, 10) : 0;
  };

  const [startIdx, setStartIdx] = useState(getInitialIdx());
  const visibleCount = 4;
  const total = productsData.length;

  // Simpan startIdx ke localStorage setiap berubah
  useEffect(() => {
    localStorage.setItem("productStartIdx", startIdx);
  }, [startIdx]);

  useEffect(() => {
    initDB();
  }, []);

  // Fungsi untuk geser kiri
  const handleLeft = () => {
    setStartIdx((prev) => (prev - 1 + total) % total);
  };

  // Fungsi untuk geser kanan
  const handleRight = () => {
    setStartIdx((prev) => (prev + 1) % total);
  };

  // Ambil 4 produk, looping jika perlu
  const visibleProducts = [];
  for (let i = 0; i < visibleCount; i++) {
    visibleProducts.push(productsData[(startIdx + i) % total]);
  }

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="flex flex-col gap-4 items-start">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="underline"
        >
          Back
        </button>
        <h4 className="text-xl font-bold">Product List</h4>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={handleLeft}
          >
            &#8592;
          </button>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
            {visibleProducts.map((productData) => (
              <div
                key={productData.id}
                className="w-full bg-slate-400 cursor-pointer flex items-center justify-center p-4"
                onClick={() => {
                  saveProduct(productData.name);
                  navigate(`/product/${productData.id}`, {
                    state: {
                      name: productData.name,
                      description: productData.description,
                      src: productData.src,
                    },
                  });
                }}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={productData.src}
                    alt={productData.name}
                    className="w-full h-auto max-h-32 object-contain"
                  />
                  <h4 className="md:text-lg text-sm mt-2">
                    {productData.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={handleRight}
          >
            &#8594;
          </button>
        </div>
      </div>
      <div className="fixed bottom-12 right-4 flex space-x-4">
        <button
          type="button"
          className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg rounded-full p-4"
          onClick={retrieveData}
        >
          Retrieve Data
        </button>
        <button
          type="button"
          className="bg-red-600 text-white hover:bg-red-700 shadow-lg rounded-full p-4"
          onClick={clearDB}
        >
          Clear Data
        </button>
      </div>
    </div>
  );
}
// ...existing code...

export default Product;
