import { createHashRouter } from "react-router";
import FrontLayout from "../layout/FrontLayout";
import Home from "../pages/Home";
import ProductList from "../pages/ProductList";
import ProductDetail from "../pages/ProductDetail";
import CartStepOne from "../pages/CartStepOne";
import CartStepTwo from "../pages/CartStepTwo";
import CartStepThree from "../pages/CartStepThree";
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
        path: "/cart-step-one",
        element: <CartStepOne />,
      },
      {
        path: "/cart-step-two",
        element: (
          <CartStepGuard>
            <CartStepTwo />
          </CartStepGuard>
        ),
      },
      {
        path: "/cart-step-three",
        element: (
          <CartStepGuard>
            <CartStepThree />
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
