import { useState } from "react";
import { WishlistContext } from "../context/WishlistContext.js";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const initWishlist = localStorage.getItem("wishlist")
      ? JSON.parse(localStorage.getItem("wishlist"))
      : {};
    return initWishlist;
  });

  const toggleWishlistItem = (product_id) => {
    const newWishlist = {
      ...wishlist,
      [product_id]: !wishlist[product_id],
    };

    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    setWishlist(newWishlist);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlistItem,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
