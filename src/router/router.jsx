import { createHashRouter } from "react-router";
import FrontLayout from "../layout/FrontLayout";
import Home from "../pages/Home";
import ProductList from "../pages/ProductList";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import OrderForm from "../pages/OrderForm";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import FavoriteProducts from "../pages/FavoriteProducts";
import PageNotFound from "../pages/PageNotFound";
import CartStepGuard from "../components/CartStepGuard";

const router = createHashRouter([
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product-list",
        element: <ProductList />,
      },
      {
        path: "/product-detail/:id",
        element: <ProductDetail />,
      },
      {
        // path: "/cart-step-one",
        path: "/cart",
        element: <Cart />,
      },
      {
        // path: "/cart-step-two",
        path: "/order-form",
        element: (
          <CartStepGuard>
            <OrderForm />
          </CartStepGuard>
        ),
      },
      {
        // path: "/cart-step-three",
        path: "/checkout",
        element: (
          <CartStepGuard>
            <Checkout />
          </CartStepGuard>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/favorite-products",
        element: <FavoriteProducts />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
