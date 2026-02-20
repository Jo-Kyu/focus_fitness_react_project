import { useEffect } from "react";

export function useClearFavorite(isAuth, clearFn) {
  useEffect(() => {
    if (!isAuth) {
      clearFn();
    }
  }, [isAuth, clearFn]);
}
