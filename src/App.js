import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import { Box, Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import ProductPage from "./components/ProductPage";
function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/product/list");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching products");
    }
  };

  const addProduct = async (newProduct) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/product/create",
        newProduct
      );
      if (response.status === 201) {
        fetchProducts(); // Re-fetch products after adding
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product");
    }
  };

  return (
    <Box p={4}>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
      </Routes>
    </Box>
  );
}

export default App;
