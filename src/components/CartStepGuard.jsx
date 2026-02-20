import { Navigate, useLocation } from "react-router";

function CartStepGuard({ children }) {
  const location = useLocation();
  const canAccess = location.state?.fromCheckout;
  
  if (!canAccess) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default CartStepGuard;