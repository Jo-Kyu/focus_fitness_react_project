import { useState, useContext, useCallback } from "react";
import { WishlistContext } from "../context/WishlistContext.js";
// 登入共用狀態
import { LoginAuthContext } from "../context/LoginAuthContext.js";
import { useClearFavorite } from "../hooks/useClearFavorite.js";
import { useLoadFavorite } from "../hooks/useLoadFavorite.js";

export function WishlistProvider({ children }) {
  const { isAuth } = useContext(LoginAuthContext);

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

  const clearWishlist = useCallback(() => {
    setWishlist({});
  }, []);

  const loadWishlist = useCallback(() => {
    const data = localStorage.getItem("wishlist");
    setWishlist(data ? JSON.parse(data) : {});
  }, []);

  useClearFavorite(isAuth, clearWishlist);
  useLoadFavorite(isAuth, loadWishlist);

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
