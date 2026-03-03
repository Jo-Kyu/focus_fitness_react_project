import { useState, useCallback } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const baseUrl = import.meta.env.VITE_BASE_URL;
const path = import.meta.env.VITE_API_PATH;

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
// 提取購物車數量
  const fetchCartCount = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${path}/cart`);
      const count = res.data.data?.carts?.reduce((sum, item) => sum + item.qty, 0) ?? 0;
      setCartCount(count);
    } catch (error) {
      console.dir("error:", error.response);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
}