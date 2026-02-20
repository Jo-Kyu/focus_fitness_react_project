import { Navigate } from "react-router";

function CartStepGuard({ children }) {
  const canAccess = sessionStorage.getItem("cartStepOnePassed");
  
  if (!canAccess) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default CartStepGuard;