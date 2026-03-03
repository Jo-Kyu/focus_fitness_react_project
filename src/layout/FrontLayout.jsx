// import { useRef, useState } from "react";
import { Outlet } from "react-router";

import Header from "../components/Header"
import Footer from "../components/Footer"
import ScrollToTop from "../components/ScrollToTop";
import { CartProvider } from "../components/CartProvider";


function FrontLayout() {
  
  return (
    <>
      <CartProvider>
        <ScrollToTop /> 
        <Header />
            <Outlet />
        <Footer />
      </CartProvider>
    </>
  );
}

export default FrontLayout;