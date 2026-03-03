import { useEffect } from "react";

export function useLoadFavorite(isAuth, loadFn) {
  useEffect(() => {
    if (isAuth) {
      loadFn();
    }
  }, [isAuth, loadFn]);
}
