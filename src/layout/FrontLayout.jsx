import { Outlet } from "react-router";
import Header from "../components/Header"
import Footer from "../components/Footer"
import ScrollToTop from "../components/ScrollToTop";


function FrontLayout() {
  

  return (
    <>
      <ScrollToTop /> 
      <Header />
          <Outlet />
      <Footer />
    </>
  );
}

export default FrontLayout;