// 匯入Hook
import { useEffect, useState, useContext } from "react";
import { Link,useNavigate } from "react-router";

// 匯入套件
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { ThreeCircles } from "react-loader-spinner";

// 匯入元件
// 光輝
import Glow from "../components/Glow.jsx";
// 空購物車
import CartEmpty from "../pages/CartEmpty.jsx";
// 輪播
import ProductsCardsCarousel from "../components/ProductsCardsCarousel.jsx";
// 載入
import Loading from "../components/Loading.jsx";
// header
import Header from "../components/Header";
// footer
import Footer from "../components/Footer";
// 回到最上方
import BackTop from "../components/BackTop";
// 登入共用狀態
import { LoginAuthContext } from "../context/LoginAuthContext.js";


// 環境變數
const baseUrl = import.meta.env.VITE_BASE_URL;
const path = import.meta.env.VITE_API_PATH;

function CartStepOne() {
  // 導向頁面
  const navigate = useNavigate();
  // 儲存購物車列表資料
  const [cartProducts, setCartProducts] = useState([]);
  // 儲存篩選出來的須配送商品資料
  // const [shippingProducts, setShippingProducts] = useState([]);
  // 儲存篩選出來的免配送商品資料
  // const [shippingFreeProducts, setShippingFreeProducts] = useState([]);
  // 儲存篩選出來的銅板商品資料(<100)
  // const [coinProducts, setCoinProducts] = useState([]);
  // 儲存篩選出來的超值商品資料(<=6折)
  // const [goodValueProducts, setGoodValueProducts] = useState([]);
  // 儲存全部商品資料
  const [allProducts, setallProducts] = useState([]);
  // 判斷購物車是否為空
  const isCartEmpty = cartProducts?.carts?.length === 0;
  // 判斷複選鈕是否已勾
  const [isNoticeChecked, setIsNoticeChecked] = useState(false);
  // 判斷頁面載入
  const [isAllPageLoading, setAllPageLoading] = useState(true);
  // 登入共用狀態解構
  const { isAuth } = useContext(LoginAuthContext);
  // 符號
  const cartIcon = (
    <svg
      width="30"
      height="30"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <path
        d="M9 30C9 28.3431 10.3431 27 12 27C13.6569 27 15 28.3431 15 30C15 31.6569 13.6569 33 12 33C10.3431 33 9 31.6569 9 30ZM24 30C24 28.3431 25.3431 27 27 27C28.6569 27 30 28.3431 30 30C30 31.6569 28.6569 33 27 33C25.3431 33 24 31.6569 24 30ZM4.90283 3C5.23578 3 5.5677 2.99933 5.85059 3.02051C6.07676 3.03745 6.33035 3.07158 6.59619 3.15528L6.86572 3.25635L7.05469 3.34717C7.42358 3.5422 7.74694 3.81262 8.00537 4.13965L8.12988 4.30811L8.27783 4.5542C8.40826 4.80001 8.48822 5.04272 8.5459 5.26172C8.618 5.53562 8.67754 5.86261 8.73779 6.18897L8.97949 7.5H28.4824C28.9703 7.5 29.4353 7.49845 29.8184 7.53223C30.2137 7.56711 30.6936 7.65056 31.1543 7.92627C31.7739 8.29729 32.245 8.88168 32.4697 9.57715C32.6349 10.0884 32.6066 10.5749 32.5518 10.9673C32.4985 11.3482 32.3932 11.8007 32.2837 12.2754V12.2769L29.9297 22.4766L29.9253 22.4971L29.9238 22.5015C29.854 22.8043 29.7845 23.1075 29.7056 23.3628C29.6193 23.6416 29.494 23.958 29.269 24.2666C28.9526 24.7006 28.5247 25.0461 28.0239 25.2598C27.672 25.4099 27.3338 25.4597 27.0425 25.481C26.9061 25.4909 26.7581 25.4963 26.6045 25.4985L26.1328 25.5H10.5C9.77665 25.5 9.15625 24.9838 9.0249 24.2725L5.7876 6.73389C5.71928 6.36381 5.6809 6.16642 5.64404 6.02637C5.64282 6.02173 5.64079 6.01739 5.63965 6.01319C5.63548 6.01284 5.63103 6.01206 5.62647 6.01172C5.48138 6.00087 5.28015 6 4.90283 6H4.5C3.67157 6 3 5.32843 3 4.5C3 3.67158 3.67157 3 4.5 3H4.90283ZM11.748 22.5H26.1328C26.4943 22.5 26.6861 22.4984 26.8242 22.4883C26.8278 22.488 26.8312 22.4871 26.8345 22.4868C26.8355 22.4834 26.8377 22.4802 26.8389 22.4766C26.8796 22.3449 26.9233 22.1587 27.0044 21.8071L27.0059 21.7998L29.3599 11.603V11.6001C29.4816 11.0728 29.5503 10.7722 29.5811 10.5527C29.5825 10.5427 29.5814 10.5324 29.5825 10.5234C29.5738 10.5226 29.5645 10.5214 29.5547 10.5205C29.3342 10.5011 29.0251 10.5 28.4824 10.5H9.5332L11.748 22.5Z"
        fill="#e1ff00"
      />
    </svg>
  );

  // 取得購物車列表(get網路請求)
  function getCartProducts() {
    axios
      .get(`${baseUrl}/v2/api/${path}/cart`)
      .then((res) => {
        setCartProducts(res.data.data);
        console.log("取得購物車列表成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("取得購物車列表失敗");
        console.dir(err);
      })
      .finally(() => {
        setAllPageLoading(false);
      });
  }

  // 取得全部商品(get網路請求)
  function getAllProducts() {
    axios
      .get(`${baseUrl}/v2/api/${path}/products/all`)
      .then((res) => {
        setallProducts(res.data.products);
        console.log(res.data.products);
        console.log("取得全部商品成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("取得全部商品失敗");
        console.dir(err);
      });
  }

  // 呼叫取得購物車列表、呼叫取的所有商品
  useEffect(() => {
    getCartProducts();
    getAllProducts();
  }, []);

  // 在購物車內，增減購商品數量事件處理函式(網路請求API)
  function handleCartProductNum(cartProductId, productId, productQty) {
    if (productQty < 1) return;
    const cartProductNum = {
      data: {
        product_id: productId,
        qty: productQty,
      },
    };
    axios
      .put(`${baseUrl}/v2/api/${path}/cart/${cartProductId}`, cartProductNum)
      .then((res) => {
        getCartProducts();

        console.log("更新特定商品數量成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("更新特定商品數量失敗");
        console.dir(err);
      });
  }

  // 刪除購物車單一商品事件處理函式(網路請求API)
  function handleDelProduct(delProductId) {
    Swal.fire({
      title: "你確定要刪除這個商品嗎？",
      text: "刪除後無法恢復！",
      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#e1ff00" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
</svg>`,
      showCancelButton: true, // 顯示取消按鈕
      confirmButtonText: "刪除！",
      cancelButtonText: "取消！",

      customClass: {
        popup: "handleAddToCartToast",
        confirmButton: "confirmButton",
        cancelButton: "cancelButton",
      },
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(`${baseUrl}/v2/api/${path}/cart/${delProductId}`)
          .then((res) => {
            getCartProducts();
            Swal.fire({
              title: "刪除成功 !",
              text: "已刪除商品 !",
              iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#e1ff00" className=="bi bi-check-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
            </svg>`,
              showConfirmButton: false,
              timer: 800,
              customClass: {
                popup: "handleAddToCartToast",
              },
            });
            console.log("刪除特定商品成功");
            console.log(res);
          })
          .catch((err) => {
            console.log("刪除特定商品失敗");
            console.dir(err);
          });
      }
    });
  }

  // 刪除購物車全部商品事件處理函式(網路請求API)
  function handleDelAllProducts() {
    Swal.fire({
      title: "你確定要刪除這個商品嗎？",
      text: "刪除後無法恢復！",
      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#e1ff00" className=="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
</svg>`,
      showCancelButton: true, // 顯示取消按鈕
      confirmButtonText: "刪除！",
      cancelButtonText: "取消！",

      customClass: {
        popup: "handleAddToCartToast",
        confirmButton: "confirmButton",
        cancelButton: "cancelButton",
      },
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(`${baseUrl}/v2/api/${path}/carts`)
          .then((res) => {
            getCartProducts();
            Swal.fire({
              title: "刪除成功 !",
              text: "已刪除商品 !",
              iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#e1ff00" className=="bi bi-check-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
            </svg>`,
              showConfirmButton: false,
              timer: 800,
              customClass: {
                popup: "handleAddToCartToast",
              },
            });
            console.log("刪除全部商品成功");
            console.log(res);
          })
          .catch((err) => {
            console.log("刪除全部商品失敗");
            console.dir(err);
          });
      }
    });
  }

  // 刪除購物車全部商品事件處理函式(網路請求API)
  // function handleDelAllProducts() {
  //   axios
  //     .delete(`${baseUrl}/v2/api/${path}/carts`)
  //     .then((res) => {
  //       getCartProducts();
  //       console.log("刪除全部商品成功");
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log("刪除全部商品失敗");
  //       console.dir(err);
  //     });
  // }

  // 開始結帳事件處理函式
  function handleStartCheckout() {
    // 判斷登入狀態
    if (!isAuth) {
      Swal.fire({
        title: "您尚未登入帳號",
        text: "登入帳號後，才可以開始結帳！",
        iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#e1ff00" className=="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
      </svg>`,
        showCancelButton: true, // 顯示取消按鈕
        reverseButtons: true, // 按鈕位置對調
        confirmButtonText: "前往登入！",
        cancelButtonText: "取消！",

        customClass: {
          popup: "handleAddToCartToast",
          confirmButton: "cancelButton",
          cancelButton: "confirmButton",
        },
      }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login"); // 確認後導向登入頁
          }
        });
      // console.log(isAuth);
      // console.log("未登入");
      return;
    }

    // 購物車為空（保險）
    if (cartProducts?.carts?.length === 0) return;

    // 有免配送商品 + 尚未勾選須知
    // 有免配送商品 + 尚未勾選
    if (shippingFreeProducts.length && !isNoticeChecked) {
      console.log("請勾選須知");
      Swal.fire({
        title: "您尚未勾選左側購物須知",
        text: "勾選購物須知後，才可以開始結帳！",
        iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#e1ff00" className=="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
      </svg>`,
        confirmButtonText: "關閉！",

        customClass: {
          popup: "handleAddToCartToast",
          confirmButton: "cancelButton",
        },
      });
      return;
    }

    console.log("須知已勾選，轉移頁面");

    // 通過檢查，進結帳
    // navigate("/checkout");

    navigate("/cart-step-two", { state: { fromCheckout: true } });
  }

  // 篩選須配送商品
  const carts = cartProducts?.carts ?? [];

  const shippingProducts = carts.filter((item) => item.product.is_shipping);

  // 篩選免配送商品
  const shippingFreeProducts = carts.filter(
    (item) => !item.product.is_shipping,
  );

  const products = allProducts ?? [];

  // 篩選100元以下商品
  const coinProducts = products.filter((item) => item.price < 100);

  // 篩選大於等於6折商品
  const goodValueProducts = products.filter(
    (item) => item.price / item.origin_price < 0.6,
  );

  // 加總須配送商品總額
  const shippingProductsTotal = shippingProducts.reduce((sum, item) => {
    return sum + item.total;
  }, 0);

  const isFreeShipping = shippingProductsTotal >= 499;

  // JSX
  if (isAllPageLoading) {
    return <Loading />;
  }

  // JSX
  if (cartProducts?.carts?.length === 0) return <CartEmpty />;

  // JSX
  return (
    <>
      
      <main className="px-6 position-relative overflow-hidden">
        <section className="max-h-130 max-h-md-144"></section>
        {/* 光暈 */}
        <Glow position="top-right" />
        <Glow position="bottom-left" />
        {/* 購物車步驟 */}
        <section className="mb-4 mb-md-5 container py-0 px-0 max-w-md-822 max-w-346">
          <ul className="ps-0 mb-0 d-flex justify-content-lg-between justify-content-center">
            {/* 步驟一：確認購買商品 */}
            <li className="d-flex align-items-center  me-md-3 ">
              <div className="me-md-8 me-2 bg-primary-500 rounded-circle py-106 py-md-103 px-2 px-md-102 max-w-md-64 max-w-26 max-h-md-64 max-h-26 d-flex justify-content-center align-items-center">
                <h2 className="fs-8 fs-md-2 text-gray-900 fw-bold lh-sm">1</h2>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-6">
                  <p className="fs-9 fs-md-5 text-white">確認購買商品</p>
                </div>
                <div className="d-none d-md-flex">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.292893 0.292893C0.683417 -0.0976311 1.31643 -0.0976311 1.70696 0.292893L8.70696 7.29289C9.09748 7.68342 9.09748 8.31643 8.70696 8.70696L1.70696 15.707C1.31643 16.0975 0.683417 16.0975 0.292893 15.707C-0.0976311 15.3164 -0.0976311 14.6834 0.292893 14.2929L6.58586 7.99992L0.292893 1.70696C-0.0976311 1.31643 -0.0976311 0.683417 0.292893 0.292893Z"
                      fill="#C5E600"
                    />
                    <path
                      d="M9.29289 0.292893C9.68342 -0.0976311 10.3164 -0.0976311 10.707 0.292893L17.707 7.29289C18.0975 7.68342 18.0975 8.31643 17.707 8.70696L10.707 15.707C10.3164 16.0975 9.68342 16.0975 9.29289 15.707C8.90237 15.3164 8.90237 14.6834 9.29289 14.2929L15.5859 7.99992L9.29289 1.70696C8.90237 1.31643 8.90237 0.683417 9.29289 0.292893Z"
                      fill="#C5E600"
                    />
                  </svg>
                </div>
              </div>
            </li>
            {/* 步驟二：填寫訂購資料 */}
            <li className="d-flex  me-md-3 align-items-center">
              <div className="me-md-8 me-2 bg-white-opacity-20 rounded-circle py-106 py-md-103 px-2 px-md-102 max-w-md-64 max-w-26 max-h-md-64 max-h-26 d-flex justify-content-center align-items-center">
                <h2 className="fs-8 fs-md-2 fw-bold lh-sm text-gray-500">2</h2>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-6">
                  <p className="fs-9 fs-md-5 text-gray-500">填寫訂購資料</p>
                </div>
                <div className="d-none d-md-flex">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.292893 0.292893C0.683417 -0.0976311 1.31643 -0.0976311 1.70696 0.292893L8.70696 7.29289C9.09748 7.68342 9.09748 8.31643 8.70696 8.70696L1.70696 15.707C1.31643 16.0975 0.683417 16.0975 0.292893 15.707C-0.0976311 15.3164 -0.0976311 14.6834 0.292893 14.2929L6.58586 7.99992L0.292893 1.70696C-0.0976311 1.31643 -0.0976311 0.683417 0.292893 0.292893Z"
                      fill="#808080"
                    />
                    <path
                      d="M9.29289 0.292893C9.68342 -0.0976311 10.3164 -0.0976311 10.707 0.292893L17.707 7.29289C18.0975 7.68342 18.0975 8.31643 17.707 8.70696L10.707 15.707C10.3164 16.0975 9.68342 16.0975 9.29289 15.707C8.90237 15.3164 8.90237 14.6834 9.29289 14.2929L15.5859 7.99992L9.29289 1.70696C8.90237 1.31643 8.90237 0.683417 9.29289 0.292893Z"
                      fill="#808080"
                    />
                  </svg>
                </div>
              </div>
            </li>
            {/* 步驟三：完成結帳 */}
            <li className="d-flex align-items-center">
              <div className="me-md-8 me-2 bg-white-opacity-20 rounded-circle py-106 py-md-103 px-2 px-md-102 max-w-md-64 max-w-26 max-h-md-64 max-h-26 d-flex justify-content-center align-items-center">
                <h2 className="fs-8 fs-md-2 fw-bold lh-sm text-gray-500">3</h2>
              </div>
              <div className="d-flex align-items-center">
                <div className=" me-1 me-md-6">
                  <p className="fs-9 fs-md-5 text-gray-500">完成結帳</p>
                </div>
                <div>
                  <svg
                    className="max-w-14 max-w-md-18"
                    width="23"
                    height="18"
                    viewBox="0 0 23 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.3564 0.939411C20.4991 0.800133 20.6695 0.689488 20.8574 0.613953C21.0454 0.538418 21.2472 0.499512 21.4511 0.499512C21.6549 0.499512 21.8568 0.538418 22.0447 0.613953C22.2327 0.689488 22.403 0.800133 22.5457 0.939411C23.1437 1.51745 23.1521 2.45152 22.5666 3.03956L10.2028 17.0205C10.0624 17.168 9.89206 17.2865 9.70216 17.3688C9.51227 17.4511 9.30681 17.4955 9.09836 17.4993C8.88991 17.503 8.68285 17.466 8.48986 17.3906C8.29686 17.3152 8.12198 17.2028 7.97592 17.0605L0.452674 9.76803C0.162528 9.48498 0 9.10437 0 8.70796C0 8.31154 0.162528 7.93093 0.452674 7.64788C0.595373 7.5086 0.765687 7.39796 0.953642 7.32242C1.1416 7.24689 1.34342 7.20798 1.54729 7.20798C1.75116 7.20798 1.95298 7.24689 2.14093 7.32242C2.32889 7.39796 2.4992 7.5086 2.6419 7.64788L9.02349 13.8343L20.3146 0.983414L20.3564 0.939411Z"
                      fill="#808080"
                    />
                  </svg>
                </div>
              </div>
            </li>
          </ul>
        </section>
        <>
          {/* 購物車商品列表 */}
          <section className="mb-5 px-6">
            {/* 須配送商品 */}
            {shippingProducts.length > 0 && (
              <div className="mb-4 mb-sm-8 container px-0 max-w-1296 border border-secondary-600 border-radius-12">
                {/* 須配送商品標題 */}
                <div className="py-6 py-sm-4  bg-blue-700 text-center border-radius-12 border-bottom-leftt-radius-0 border-bottom-right-radius-0">
                  <h2 className="fs-7 text-gray-950 fw-bold">須配送商品</h2>
                </div>
                {shippingProducts.length > 0 ? (
                  <>
                    {/* 選取全部 */}
                    <div className=" py-3 px-106 px-lg-4 border-bottom border-blue-600">
                      {/* 複選按鈕 */}
                      <div className="htmlForm-check ps-0 d-flex align-items-center mb-0">
                        <div className="me-3 p-104">
                          <input
                            className="form-check-input rounded-1 max-w-20 max-h-20 ms-0 mt-0 border-gray-500 border-2 box-shadow-none"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                        </div>

                        <label
                          className="htmlForm-check-label text-gray-950"
                          htmlFor="flexCheckDefault"
                        >
                          選取全部
                        </label>
                      </div>
                    </div>
                    {shippingProducts?.map((cartProduct) => {
                      // 原價
                      const originalPrice = cartProduct?.product?.origin_price;
                      // 總數量售價
                      const totalPrice = cartProduct?.total;
                      // 總數量
                      const cartProductQty = cartProduct?.qty;
                      // 總數量原價
                      const totalOriginalPrice = originalPrice * cartProductQty;
                      // 折扣
                      const discount = Math.round(
                        (1 - totalPrice / totalOriginalPrice) * 100,
                      );

                      return (
                        <div
                          className="py-6 py-lg-8 px-106 px-lg-4 d-flex justify-content-between border-bottom border-blue-600 flex-column flex-sm-row "
                          key={cartProduct?.product_id}
                        >
                          {/*  複選按鈕、商品圖片、商品資訊 */}
                          <div className="d-flex  mb-lg-0 mb-3">
                            {/*  複選按鈕 */}
                            <div className="form-check mb-0 p-0 d-flex align-items-lg-center">
                              <div className="me-2 me-lg-3 p-104">
                                <input
                                  className="form-check-input rounded-1 max-w-20 max-h-20 ms-0 mt-0 border-gray-500 border-2 box-shadow-none"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                              </div>
                            </div>
                            {/*  商品圖片 */}
                            <div className="me-6 me-lg-4 max-w-80 max-w-lg-160">
                              <img
                                className="rounded-3 max-h-73 max-h-lg-145"
                                src={cartProduct?.product?.imageUrl}
                                alt="Focus耐磨皮格拉力帶"
                              />
                            </div>
                            {/*  商品資訊 */}
                            <div>
                              {/*  商品名稱 */}
                              <div className="mb-2 mb-lg-6">
                                <h2 className="fs-8 fs-lg-5 fw-bold lh-sm">
                                  {cartProduct?.product?.title}
                                </h2>
                              </div>
                              {/*  商品規格 */}
                              <div className="mb-2 mb-lg-6">
                                <p className="fs-9 fs-lg-6 text-gray-500">
                                  顏色：{cartProduct?.color}
                                </p>
                              </div>
                              {/*  商品規格 */}
                              <div className="mb-2 mb-lg-6">
                                <p className="fs-9 fs-lg-6 text-gray-500">
                                  尺寸：{cartProduct?.size}
                                </p>
                              </div>
                              {/*  數量增減按鈕 */}
                              {/* 商品數量 */}
                              <div className="mb-4 mb-md-8">
                                {/* 數量標題 */}
                                <div className="mb-6">
                                  <h3 className="mb-0 fs-6 text-gray-200 fw-medium">
                                    數量
                                  </h3>
                                </div>
                                {/*商品數量增減按鈕*/}
                                <div className="rounded-pill bg-white-opacity-20 d-flex justify-content-between justify-content-md-center align-items-center max-w-210 my-3">
                                  <button
                                    className="btn p-2 border-0 text-white fs-2"
                                    onClick={() => {
                                      handleCartProductNum(
                                        cartProduct?.id,
                                        cartProduct?.product_id,
                                        cartProduct?.qty - 1,
                                      );
                                      toast.success(`商品數量已減少 1`, {
                                        className: "handleAddToCartToast",
                                        icon: cartIcon,
                                      });
                                    }}
                                  >
                                    -
                                  </button>
                                  <input
                                    className="w-50 fs-5 placeholder-lg text-gray-950 fw-bold lh-sm border-0 bg-transparent input-focus text-cenetr p-2 text-center remove-spin"
                                    type="number"
                                    value={cartProduct?.qty}
                                    readOnly
                                  />
                                  <button
                                    className="btn p-2 border-0 text-white fs-2"
                                    onClick={() => {
                                      handleCartProductNum(
                                        cartProduct?.id,
                                        cartProduct?.product_id,
                                        cartProduct?.qty + 1,
                                      );
                                      toast.success(`商品數量已增加 1`, {
                                        className: "handleAddToCartToast",
                                        icon: cartIcon,
                                      });
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/*  刪除商品按鈕，手機板出現 */}
                            <div className="d-sm-none ms-auto">
                              <button
                                type="button"
                                className="btn p-0"
                                onClick={() => {
                                  handleDelProduct(cartProduct?.id);
                                }}
                              >
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 40 40"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M17.75 9.5H22.25C22.4489 9.5 22.6397 9.57902 22.7803 9.71967C22.921 9.86032 23 10.0511 23 10.25V11.75H17V10.25C17 10.0511 17.079 9.86032 17.2197 9.71967C17.3603 9.57902 17.5511 9.5 17.75 9.5ZM24.5 11.75V10.25C24.5 9.65326 24.2629 9.08097 23.841 8.65901C23.419 8.23705 22.8467 8 22.25 8H17.75C17.1533 8 16.581 8.23705 16.159 8.65901C15.7371 9.08097 15.5 9.65326 15.5 10.25V11.75H10.25C10.0511 11.75 9.86032 11.829 9.71967 11.9697C9.57902 12.1103 9.5 12.3011 9.5 12.5C9.5 12.6989 9.57902 12.8897 9.71967 13.0303C9.86032 13.171 10.0511 13.25 10.25 13.25H11.057L12.3365 29.24C12.3968 29.9918 12.7381 30.6933 13.2924 31.2048C13.8467 31.7162 14.5733 32.0002 15.3275 32H24.6725C25.4267 32.0002 26.1533 31.7162 26.7076 31.2048C27.2619 30.6933 27.6032 29.9918 27.6635 29.24L28.943 13.25H29.75C29.9489 13.25 30.1397 13.171 30.2803 13.0303C30.421 12.8897 30.5 12.6989 30.5 12.5C30.5 12.3011 30.421 12.1103 30.2803 11.9697C30.1397 11.829 29.9489 11.75 29.75 11.75H24.5ZM27.437 13.25L26.168 29.12C26.1378 29.4959 25.9672 29.8466 25.69 30.1024C25.4129 30.3581 25.0496 30.5001 24.6725 30.5H15.3275C14.9504 30.5001 14.5871 30.3581 14.31 30.1024C14.0328 29.8466 13.8622 29.4959 13.832 29.12L12.563 13.25H27.437ZM16.2065 14.75C16.405 14.7385 16.5999 14.8063 16.7484 14.9385C16.897 15.0707 16.9869 15.2565 16.9985 15.455L17.7485 28.205C17.7564 28.4012 17.687 28.5926 17.5553 28.7382C17.4236 28.8838 17.2401 28.972 17.0441 28.9838C16.8481 28.9955 16.6554 28.93 16.5072 28.8012C16.359 28.6725 16.2672 28.4907 16.2515 28.295L15.5 15.545C15.4939 15.4465 15.5073 15.3477 15.5395 15.2544C15.5717 15.161 15.6219 15.075 15.6874 15.0011C15.7529 14.9273 15.8324 14.8671 15.9212 14.824C16.01 14.7809 16.1064 14.7557 16.205 14.75H16.2065ZM23.7935 14.75C23.8921 14.7557 23.9885 14.7809 24.0773 14.824C24.1661 14.8671 24.2456 14.9273 24.3111 15.0011C24.3766 15.075 24.4268 15.161 24.459 15.2544C24.4912 15.3477 24.5046 15.4465 24.4985 15.545L23.7485 28.295C23.7445 28.3947 23.7207 28.4925 23.6784 28.5829C23.6361 28.6732 23.5762 28.7542 23.5022 28.8211C23.4282 28.888 23.3417 28.9395 23.2475 28.9726C23.1534 29.0056 23.0537 29.0195 22.9541 29.0135C22.8545 29.0076 22.7572 28.9818 22.6677 28.9377C22.5782 28.8936 22.4984 28.8321 22.433 28.7568C22.3676 28.6815 22.3178 28.594 22.2866 28.4992C22.2555 28.4044 22.2435 28.3044 22.2515 28.205L23.0015 15.455C23.0131 15.2565 23.103 15.0707 23.2516 14.9385C23.4001 14.8063 23.595 14.7385 23.7935 14.75ZM20 14.75C20.1989 14.75 20.3897 14.829 20.5303 14.9697C20.671 15.1103 20.75 15.3011 20.75 15.5V28.25C20.75 28.4489 20.671 28.6397 20.5303 28.7803C20.3897 28.921 20.1989 29 20 29C19.8011 29 19.6103 28.921 19.4697 28.7803C19.329 28.6397 19.25 28.4489 19.25 28.25V15.5C19.25 15.3011 19.329 15.1103 19.4697 14.9697C19.6103 14.829 19.8011 14.75 20 14.75Z"
                                    fill="white"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {/*  售價、原價、優惠資訊、刪除按鈕 */}
                          <div className="d-flex align-items-top justify-content-end">
                            {/*  售價、原價、優惠資訊 */}
                            <div className="me-5 me-sm-4">
                              {/*  售價、原價 */}
                              <div className="mb-6 d-flex align-items-center">
                                {/*  售價 */}
                                <div className="me-6">
                                  <h2 className="fs-8 fs-lg-7 text-gray-950 fw-bold lh-sm">
                                    NT${cartProduct?.total}
                                  </h2>
                                </div>
                                {/*  原價 */}
                                <div>
                                  <h3 className="fs-9 fs-lg-6 fw-bold text-gray-500 text-decoration-line-through">
                                    NT${totalOriginalPrice}
                                  </h3>
                                </div>
                              </div>
                              {/*  優惠資訊 */}
                              <div className="mb-6 text-end">
                                <h3 className="fs-9 fs-lg-7 text-warning-dark fw-regular">
                                  為您省下{discount}%
                                </h3>
                              </div>
                            </div>
                            {/*  刪除商品按鈕，電腦版出現 */}
                            <div className="d-none d-sm-flex d-flex align-items-start">
                              <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                  handleDelProduct(cartProduct?.id);
                                }}
                              >
                                <svg
                                  width="40"
                                  height="40"
                                  viewBox="0 0 40 40"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M17.75 9.5H22.25C22.4489 9.5 22.6397 9.57902 22.7803 9.71967C22.921 9.86032 23 10.0511 23 10.25V11.75H17V10.25C17 10.0511 17.079 9.86032 17.2197 9.71967C17.3603 9.57902 17.5511 9.5 17.75 9.5ZM24.5 11.75V10.25C24.5 9.65326 24.2629 9.08097 23.841 8.65901C23.419 8.23705 22.8467 8 22.25 8H17.75C17.1533 8 16.581 8.23705 16.159 8.65901C15.7371 9.08097 15.5 9.65326 15.5 10.25V11.75H10.25C10.0511 11.75 9.86032 11.829 9.71967 11.9697C9.57902 12.1103 9.5 12.3011 9.5 12.5C9.5 12.6989 9.57902 12.8897 9.71967 13.0303C9.86032 13.171 10.0511 13.25 10.25 13.25H11.057L12.3365 29.24C12.3968 29.9918 12.7381 30.6933 13.2924 31.2048C13.8467 31.7162 14.5733 32.0002 15.3275 32H24.6725C25.4267 32.0002 26.1533 31.7162 26.7076 31.2048C27.2619 30.6933 27.6032 29.9918 27.6635 29.24L28.943 13.25H29.75C29.9489 13.25 30.1397 13.171 30.2803 13.0303C30.421 12.8897 30.5 12.6989 30.5 12.5C30.5 12.3011 30.421 12.1103 30.2803 11.9697C30.1397 11.829 29.9489 11.75 29.75 11.75H24.5ZM27.437 13.25L26.168 29.12C26.1378 29.4959 25.9672 29.8466 25.69 30.1024C25.4129 30.3581 25.0496 30.5001 24.6725 30.5H15.3275C14.9504 30.5001 14.5871 30.3581 14.31 30.1024C14.0328 29.8466 13.8622 29.4959 13.832 29.12L12.563 13.25H27.437ZM16.2065 14.75C16.405 14.7385 16.5999 14.8063 16.7484 14.9385C16.897 15.0707 16.9869 15.2565 16.9985 15.455L17.7485 28.205C17.7564 28.4012 17.687 28.5926 17.5553 28.7382C17.4236 28.8838 17.2401 28.972 17.0441 28.9838C16.8481 28.9955 16.6554 28.93 16.5072 28.8012C16.359 28.6725 16.2672 28.4907 16.2515 28.295L15.5 15.545C15.4939 15.4465 15.5073 15.3477 15.5395 15.2544C15.5717 15.161 15.6219 15.075 15.6874 15.0011C15.7529 14.9273 15.8324 14.8671 15.9212 14.824C16.01 14.7809 16.1064 14.7557 16.205 14.75H16.2065ZM23.7935 14.75C23.8921 14.7557 23.9885 14.7809 24.0773 14.824C24.1661 14.8671 24.2456 14.9273 24.3111 15.0011C24.3766 15.075 24.4268 15.161 24.459 15.2544C24.4912 15.3477 24.5046 15.4465 24.4985 15.545L23.7485 28.295C23.7445 28.3947 23.7207 28.4925 23.6784 28.5829C23.6361 28.6732 23.5762 28.7542 23.5022 28.8211C23.4282 28.888 23.3417 28.9395 23.2475 28.9726C23.1534 29.0056 23.0537 29.0195 22.9541 29.0135C22.8545 29.0076 22.7572 28.9818 22.6677 28.9377C22.5782 28.8936 22.4984 28.8321 22.433 28.7568C22.3676 28.6815 22.3178 28.594 22.2866 28.4992C22.2555 28.4044 22.2435 28.3044 22.2515 28.205L23.0015 15.455C23.0131 15.2565 23.103 15.0707 23.2516 14.9385C23.4001 14.8063 23.595 14.7385 23.7935 14.75ZM20 14.75C20.1989 14.75 20.3897 14.829 20.5303 14.9697C20.671 15.1103 20.75 15.3011 20.75 15.5V28.25C20.75 28.4489 20.671 28.6397 20.5303 28.7803C20.3897 28.921 20.1989 29 20 29C19.8011 29 19.6103 28.921 19.4697 28.7803C19.329 28.6397 19.25 28.4489 19.25 28.25V15.5C19.25 15.3011 19.329 15.1103 19.4697 14.9697C19.6103 14.829 19.8011 14.75 20 14.75Z"
                                    fill="white"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "50vh" }}
                  >
                    <div>
                      <ThreeCircles
                        visible={true}
                        height={100}
                        width={100}
                        color="#e1ff00"
                        ariaLabel="three-circles-loading"
                      />
                      <p className="mt-4">載入中，請稍後...</p>
                    </div>
                  </div>
                )}

                {/*  已達免運門檻 */}
                <div>
                  <h2 className="py-6 py-sm-8 ps-sm-105 px-3 fs-8 text-primary-200 fw-regular">
                    {isFreeShipping ? "已達宅配免運門檻" : ""}
                  </h2>
                </div>
              </div>
            )}

            {/* 免配送商品 */}
            {shippingFreeProducts.length > 0 && (
              <div className="mb-4 mb-sm-8 container px-0 max-w-1296 border border-secondary-600 border-radius-12">
                {/* 免配送商品標題 */}
                <div className="py-6 py-sm-4  bg-blue-700 text-center border-radius-12 border-bottom-leftt-radius-0 border-bottom-right-radius-0">
                  <h2 className="fs-7 text-gray-950 fw-bold mb-2">
                    免配送商品
                  </h2>
                  <h3 className="fs-6 text-secondary-400 fw-regular">
                    ( 請至實體門市櫃台出示訂單編號，並辦理相關手續 )
                  </h3>
                </div>
                {shippingFreeProducts.length > 0 ? (
                  <>
                    {/* 選取全部 */}
                    <div className=" py-3 px-106 px-lg-4 border-bottom border-blue-600">
                      {/* 複選按鈕 */}
                      <div className="form-check ps-0 d-flex align-items-center mb-0">
                        <div className="me-3 p-104">
                          <input
                            className="form-check-input rounded-1 max-w-20 max-h-20 ms-0 mt-0 border-gray-500 border-2 box-shadow-none"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                        </div>

                        <label
                          className="htmlForm-check-label text-gray-950"
                          htmlFor="flexCheckDefault"
                        >
                          選取全部
                        </label>
                      </div>
                    </div>
                    {shippingFreeProducts?.map((cartProduct) => {
                      // 原價
                      const originalPrice = cartProduct?.product?.origin_price;
                      // 總數量售價
                      const totalPrice = cartProduct?.total;
                      // 總數量
                      const cartProductQty = cartProduct?.qty;
                      // 總數量原價
                      const totalOriginalPrice = originalPrice * cartProductQty;
                      // 折扣
                      const discount = Math.round(
                        (1 - totalPrice / totalOriginalPrice) * 100,
                      );
                      console.log("免配送商品", shippingFreeProducts);

                      return (
                        <div
                          className="py-6 py-lg-8 px-106 px-lg-4 d-flex justify-content-between border-bottom border-blue-600 flex-column flex-sm-row "
                          key={cartProduct?.product_id}
                        >
                          {/*  複選按鈕、商品圖片、商品資訊 */}
                          <div className="d-flex  mb-lg-0 mb-3">
                            {/*  複選按鈕 */}
                            <div className="form-check mb-0 p-0 d-flex align-items-lg-center">
                              <div className="me-2 me-lg-3 p-104">
                                <input
                                  className="form-check-input rounded-1 max-w-20 max-h-20 ms-0 mt-0 border-gray-500 border-2 box-shadow-none"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                              </div>
                            </div>
                            {/*  商品圖片 */}
                            <div className="me-6 me-lg-4 max-w-80 max-w-lg-160">
                              <img
                                className="rounded-3 max-h-73 max-h-lg-145"
                                src={cartProduct?.product?.imageUrl}
                                alt="Focus耐磨皮格拉力帶"
                              />
                            </div>
                            {/*  商品資訊 */}
                            <div>
                              {/*  商品名稱 */}
                              <div className="mb-2 mb-lg-6">
                                <h2 className="fs-8 fs-lg-5 fw-bold lh-sm">
                                  {cartProduct?.product?.title}
                                </h2>
                              </div>
                              {/*  商品規格顏色 */}

                              {/*  商品規格尺寸 */}

                              {/*  數量增減按鈕 */}
                              {/* 商品數量 */}
                              <div className="mb-4 mb-md-8">
                                {/* 數量標題 */}
                                <div className="mb-6">
                                  <h3 className="mb-0 fs-6 text-gray-200 fw-medium">
                                    數量
                                  </h3>
                                </div>
                                {/*商品數量增減按鈕*/}
                                <div className="rounded-pill bg-white-opacity-20 d-flex justify-content-between justify-content-md-center align-items-center max-w-210 my-3">
                                  <button
                                    className="btn p-2 border-0 text-white fs-2"
                                    onClick={() => {
                                      handleCartProductNum(
                                        cartProduct?.id,
                                        cartProduct?.product_id,
                                        cartProduct?.qty - 1,
                                      );
                                      toast.success(`商品數量已減少 1`, {
                                        className: "handleAddToCartToast",
                                        icon: cartIcon,
                                      });
                                    }}
                                  >
                                    -
                                  </button>
                                  <input
                                    className="w-50 fs-5 placeholder-lg text-gray-950 fw-bold lh-sm border-0 bg-transparent input-focus text-cenetr p-2 text-center remove-spin"
                                    type="number"
                                    value={cartProduct?.qty}
                                    readOnly
                                  />
                                  <button
                                    className="btn p-2 border-0 text-white fs-2"
                                    onClick={() => {
                                      handleCartProductNum(
                                        cartProduct?.id,
                                        cartProduct?.product_id,
                                        cartProduct?.qty + 1,
                                      );
                                      toast.success(`商品數量已增加 1`, {
                                        className: "handleAddToCartToast",
                                        icon: cartIcon,
                                      });
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/*  刪除商品按鈕，手機板出現 */}
                            <div className="d-sm-none ms-auto">
                              <button
                                type="button"
                                className="btn p-0"
                                onClick={() => {
                                  handleDelProduct(cartProduct?.id);
                                }}
                              >
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 40 40"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M17.75 9.5H22.25C22.4489 9.5 22.6397 9.57902 22.7803 9.71967C22.921 9.86032 23 10.0511 23 10.25V11.75H17V10.25C17 10.0511 17.079 9.86032 17.2197 9.71967C17.3603 9.57902 17.5511 9.5 17.75 9.5ZM24.5 11.75V10.25C24.5 9.65326 24.2629 9.08097 23.841 8.65901C23.419 8.23705 22.8467 8 22.25 8H17.75C17.1533 8 16.581 8.23705 16.159 8.65901C15.7371 9.08097 15.5 9.65326 15.5 10.25V11.75H10.25C10.0511 11.75 9.86032 11.829 9.71967 11.9697C9.57902 12.1103 9.5 12.3011 9.5 12.5C9.5 12.6989 9.57902 12.8897 9.71967 13.0303C9.86032 13.171 10.0511 13.25 10.25 13.25H11.057L12.3365 29.24C12.3968 29.9918 12.7381 30.6933 13.2924 31.2048C13.8467 31.7162 14.5733 32.0002 15.3275 32H24.6725C25.4267 32.0002 26.1533 31.7162 26.7076 31.2048C27.2619 30.6933 27.6032 29.9918 27.6635 29.24L28.943 13.25H29.75C29.9489 13.25 30.1397 13.171 30.2803 13.0303C30.421 12.8897 30.5 12.6989 30.5 12.5C30.5 12.3011 30.421 12.1103 30.2803 11.9697C30.1397 11.829 29.9489 11.75 29.75 11.75H24.5ZM27.437 13.25L26.168 29.12C26.1378 29.4959 25.9672 29.8466 25.69 30.1024C25.4129 30.3581 25.0496 30.5001 24.6725 30.5H15.3275C14.9504 30.5001 14.5871 30.3581 14.31 30.1024C14.0328 29.8466 13.8622 29.4959 13.832 29.12L12.563 13.25H27.437ZM16.2065 14.75C16.405 14.7385 16.5999 14.8063 16.7484 14.9385C16.897 15.0707 16.9869 15.2565 16.9985 15.455L17.7485 28.205C17.7564 28.4012 17.687 28.5926 17.5553 28.7382C17.4236 28.8838 17.2401 28.972 17.0441 28.9838C16.8481 28.9955 16.6554 28.93 16.5072 28.8012C16.359 28.6725 16.2672 28.4907 16.2515 28.295L15.5 15.545C15.4939 15.4465 15.5073 15.3477 15.5395 15.2544C15.5717 15.161 15.6219 15.075 15.6874 15.0011C15.7529 14.9273 15.8324 14.8671 15.9212 14.824C16.01 14.7809 16.1064 14.7557 16.205 14.75H16.2065ZM23.7935 14.75C23.8921 14.7557 23.9885 14.7809 24.0773 14.824C24.1661 14.8671 24.2456 14.9273 24.3111 15.0011C24.3766 15.075 24.4268 15.161 24.459 15.2544C24.4912 15.3477 24.5046 15.4465 24.4985 15.545L23.7485 28.295C23.7445 28.3947 23.7207 28.4925 23.6784 28.5829C23.6361 28.6732 23.5762 28.7542 23.5022 28.8211C23.4282 28.888 23.3417 28.9395 23.2475 28.9726C23.1534 29.0056 23.0537 29.0195 22.9541 29.0135C22.8545 29.0076 22.7572 28.9818 22.6677 28.9377C22.5782 28.8936 22.4984 28.8321 22.433 28.7568C22.3676 28.6815 22.3178 28.594 22.2866 28.4992C22.2555 28.4044 22.2435 28.3044 22.2515 28.205L23.0015 15.455C23.0131 15.2565 23.103 15.0707 23.2516 14.9385C23.4001 14.8063 23.595 14.7385 23.7935 14.75ZM20 14.75C20.1989 14.75 20.3897 14.829 20.5303 14.9697C20.671 15.1103 20.75 15.3011 20.75 15.5V28.25C20.75 28.4489 20.671 28.6397 20.5303 28.7803C20.3897 28.921 20.1989 29 20 29C19.8011 29 19.6103 28.921 19.4697 28.7803C19.329 28.6397 19.25 28.4489 19.25 28.25V15.5C19.25 15.3011 19.329 15.1103 19.4697 14.9697C19.6103 14.829 19.8011 14.75 20 14.75Z"
                                    fill="white"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {/*  售價、原價、優惠資訊、刪除按鈕 */}
                          <div className="d-flex align-items-top justify-content-end">
                            {/*  售價、原價、優惠資訊 */}
                            <div className="me-5 me-sm-4">
                              {/*  售價、原價 */}
                              <div className="mb-6 d-flex align-items-center">
                                {/*  售價 */}
                                <div className="me-6">
                                  <h2 className="fs-8 fs-lg-7 text-gray-950 fw-bold lh-sm">
                                    NT${cartProduct?.total}
                                  </h2>
                                </div>
                                {/*  原價 */}
                                <div>
                                  <h3 className="fs-9 fs-lg-6 fw-bold text-gray-500 text-decoration-line-through">
                                    NT${totalOriginalPrice}
                                  </h3>
                                </div>
                              </div>
                              {/*  優惠資訊 */}
                              <div className="mb-6 text-end">
                                <h3 className="fs-9 fs-lg-7 text-warning-dark fw-regular">
                                  為您省下{discount}%
                                </h3>
                              </div>
                            </div>
                            {/*  刪除商品按鈕，電腦版出現 */}
                            <div className="d-none d-sm-flex d-flex align-items-start">
                              <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                  handleDelProduct(cartProduct?.id);
                                }}
                              >
                                <svg
                                  width="40"
                                  height="40"
                                  viewBox="0 0 40 40"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M17.75 9.5H22.25C22.4489 9.5 22.6397 9.57902 22.7803 9.71967C22.921 9.86032 23 10.0511 23 10.25V11.75H17V10.25C17 10.0511 17.079 9.86032 17.2197 9.71967C17.3603 9.57902 17.5511 9.5 17.75 9.5ZM24.5 11.75V10.25C24.5 9.65326 24.2629 9.08097 23.841 8.65901C23.419 8.23705 22.8467 8 22.25 8H17.75C17.1533 8 16.581 8.23705 16.159 8.65901C15.7371 9.08097 15.5 9.65326 15.5 10.25V11.75H10.25C10.0511 11.75 9.86032 11.829 9.71967 11.9697C9.57902 12.1103 9.5 12.3011 9.5 12.5C9.5 12.6989 9.57902 12.8897 9.71967 13.0303C9.86032 13.171 10.0511 13.25 10.25 13.25H11.057L12.3365 29.24C12.3968 29.9918 12.7381 30.6933 13.2924 31.2048C13.8467 31.7162 14.5733 32.0002 15.3275 32H24.6725C25.4267 32.0002 26.1533 31.7162 26.7076 31.2048C27.2619 30.6933 27.6032 29.9918 27.6635 29.24L28.943 13.25H29.75C29.9489 13.25 30.1397 13.171 30.2803 13.0303C30.421 12.8897 30.5 12.6989 30.5 12.5C30.5 12.3011 30.421 12.1103 30.2803 11.9697C30.1397 11.829 29.9489 11.75 29.75 11.75H24.5ZM27.437 13.25L26.168 29.12C26.1378 29.4959 25.9672 29.8466 25.69 30.1024C25.4129 30.3581 25.0496 30.5001 24.6725 30.5H15.3275C14.9504 30.5001 14.5871 30.3581 14.31 30.1024C14.0328 29.8466 13.8622 29.4959 13.832 29.12L12.563 13.25H27.437ZM16.2065 14.75C16.405 14.7385 16.5999 14.8063 16.7484 14.9385C16.897 15.0707 16.9869 15.2565 16.9985 15.455L17.7485 28.205C17.7564 28.4012 17.687 28.5926 17.5553 28.7382C17.4236 28.8838 17.2401 28.972 17.0441 28.9838C16.8481 28.9955 16.6554 28.93 16.5072 28.8012C16.359 28.6725 16.2672 28.4907 16.2515 28.295L15.5 15.545C15.4939 15.4465 15.5073 15.3477 15.5395 15.2544C15.5717 15.161 15.6219 15.075 15.6874 15.0011C15.7529 14.9273 15.8324 14.8671 15.9212 14.824C16.01 14.7809 16.1064 14.7557 16.205 14.75H16.2065ZM23.7935 14.75C23.8921 14.7557 23.9885 14.7809 24.0773 14.824C24.1661 14.8671 24.2456 14.9273 24.3111 15.0011C24.3766 15.075 24.4268 15.161 24.459 15.2544C24.4912 15.3477 24.5046 15.4465 24.4985 15.545L23.7485 28.295C23.7445 28.3947 23.7207 28.4925 23.6784 28.5829C23.6361 28.6732 23.5762 28.7542 23.5022 28.8211C23.4282 28.888 23.3417 28.9395 23.2475 28.9726C23.1534 29.0056 23.0537 29.0195 22.9541 29.0135C22.8545 29.0076 22.7572 28.9818 22.6677 28.9377C22.5782 28.8936 22.4984 28.8321 22.433 28.7568C22.3676 28.6815 22.3178 28.594 22.2866 28.4992C22.2555 28.4044 22.2435 28.3044 22.2515 28.205L23.0015 15.455C23.0131 15.2565 23.103 15.0707 23.2516 14.9385C23.4001 14.8063 23.595 14.7385 23.7935 14.75ZM20 14.75C20.1989 14.75 20.3897 14.829 20.5303 14.9697C20.671 15.1103 20.75 15.3011 20.75 15.5V28.25C20.75 28.4489 20.671 28.6397 20.5303 28.7803C20.3897 28.921 20.1989 29 20 29C19.8011 29 19.6103 28.921 19.4697 28.7803C19.329 28.6397 19.25 28.4489 19.25 28.25V15.5C19.25 15.3011 19.329 15.1103 19.4697 14.9697C19.6103 14.829 19.8011 14.75 20 14.75Z"
                                    fill="white"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/*  已達免運門檻 */}
                    {/* 刪除全部商品按鈕 */}
                    <div className="d-flex justify-content-between align-items-center p-1">
                      <div>
                        <h2 className="py-6 py-sm-8 ps-sm-105 px-3 fs-8 text-primary-200 fw-regular">
                          已達宅配免運門檻
                        </h2>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn text-danger-normal d-flex justify-content-center align-items-center fs-8"
                          onClick={handleDelAllProducts}
                        >
                          刪除全部商品
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.75 9.5H22.25C22.4489 9.5 22.6397 9.57902 22.7803 9.71967C22.921 9.86032 23 10.0511 23 10.25V11.75H17V10.25C17 10.0511 17.079 9.86032 17.2197 9.71967C17.3603 9.57902 17.5511 9.5 17.75 9.5ZM24.5 11.75V10.25C24.5 9.65326 24.2629 9.08097 23.841 8.65901C23.419 8.23705 22.8467 8 22.25 8H17.75C17.1533 8 16.581 8.23705 16.159 8.65901C15.7371 9.08097 15.5 9.65326 15.5 10.25V11.75H10.25C10.0511 11.75 9.86032 11.829 9.71967 11.9697C9.57902 12.1103 9.5 12.3011 9.5 12.5C9.5 12.6989 9.57902 12.8897 9.71967 13.0303C9.86032 13.171 10.0511 13.25 10.25 13.25H11.057L12.3365 29.24C12.3968 29.9918 12.7381 30.6933 13.2924 31.2048C13.8467 31.7162 14.5733 32.0002 15.3275 32H24.6725C25.4267 32.0002 26.1533 31.7162 26.7076 31.2048C27.2619 30.6933 27.6032 29.9918 27.6635 29.24L28.943 13.25H29.75C29.9489 13.25 30.1397 13.171 30.2803 13.0303C30.421 12.8897 30.5 12.6989 30.5 12.5C30.5 12.3011 30.421 12.1103 30.2803 11.9697C30.1397 11.829 29.9489 11.75 29.75 11.75H24.5ZM27.437 13.25L26.168 29.12C26.1378 29.4959 25.9672 29.8466 25.69 30.1024C25.4129 30.3581 25.0496 30.5001 24.6725 30.5H15.3275C14.9504 30.5001 14.5871 30.3581 14.31 30.1024C14.0328 29.8466 13.8622 29.4959 13.832 29.12L12.563 13.25H27.437ZM16.2065 14.75C16.405 14.7385 16.5999 14.8063 16.7484 14.9385C16.897 15.0707 16.9869 15.2565 16.9985 15.455L17.7485 28.205C17.7564 28.4012 17.687 28.5926 17.5553 28.7382C17.4236 28.8838 17.2401 28.972 17.0441 28.9838C16.8481 28.9955 16.6554 28.93 16.5072 28.8012C16.359 28.6725 16.2672 28.4907 16.2515 28.295L15.5 15.545C15.4939 15.4465 15.5073 15.3477 15.5395 15.2544C15.5717 15.161 15.6219 15.075 15.6874 15.0011C15.7529 14.9273 15.8324 14.8671 15.9212 14.824C16.01 14.7809 16.1064 14.7557 16.205 14.75H16.2065ZM23.7935 14.75C23.8921 14.7557 23.9885 14.7809 24.0773 14.824C24.1661 14.8671 24.2456 14.9273 24.3111 15.0011C24.3766 15.075 24.4268 15.161 24.459 15.2544C24.4912 15.3477 24.5046 15.4465 24.4985 15.545L23.7485 28.295C23.7445 28.3947 23.7207 28.4925 23.6784 28.5829C23.6361 28.6732 23.5762 28.7542 23.5022 28.8211C23.4282 28.888 23.3417 28.9395 23.2475 28.9726C23.1534 29.0056 23.0537 29.0195 22.9541 29.0135C22.8545 29.0076 22.7572 28.9818 22.6677 28.9377C22.5782 28.8936 22.4984 28.8321 22.433 28.7568C22.3676 28.6815 22.3178 28.594 22.2866 28.4992C22.2555 28.4044 22.2435 28.3044 22.2515 28.205L23.0015 15.455C23.0131 15.2565 23.103 15.0707 23.2516 14.9385C23.4001 14.8063 23.595 14.7385 23.7935 14.75ZM20 14.75C20.1989 14.75 20.3897 14.829 20.5303 14.9697C20.671 15.1103 20.75 15.3011 20.75 15.5V28.25C20.75 28.4489 20.671 28.6397 20.5303 28.7803C20.3897 28.921 20.1989 29 20 29C19.8011 29 19.6103 28.921 19.4697 28.7803C19.329 28.6397 19.25 28.4489 19.25 28.25V15.5C19.25 15.3011 19.329 15.1103 19.4697 14.9697C19.6103 14.829 19.8011 14.75 20 14.75Z"
                              fill="white"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "50vh" }}
                  >
                    <div>
                      <ThreeCircles
                        visible={true}
                        height={100}
                        width={100}
                        color="#e1ff00"
                        ariaLabel="three-circles-loading"
                      />
                      <p className="mt-4">載入中，請稍後...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 套用優惠券、總價格 */}
            {cartProducts?.final_total && (
              <div className="mb-8 py-3 py-md-8 px-4 container px-0 max-w-1296 border border-secondary-600 border-radius-12">
                <div className="">
                  {/* 套用優惠券按鈕 */}
                  {/* <div className="mb-6 text-end">
                <button className="btn py-6 px-8 px-md-9 mb-6 mb-md-0 bg-blue-900 rounded-3 text-gray-950 hover-effect">
                  使用優惠券
                </button>
              </div> */}
                  {/* 是否套用優惠券提醒 */}
                  {/* <div className="mb-6 text-end">
                <h3 className="fs-6 fs-md-7 text-warning-dark fw-regular">
                  已套用 滿1000折抵100
                </h3>
              </div> */}
                  {/* 總價格 */}
                  <div className="d-flex flex-md-row flex-column  justify-content-sm-end">
                    {cartProducts?.final_total ? (
                      <>
                        <div>
                          {/* 商品金額 */}
                          {/* <div className="me-md-5 ">
                    <p className="d-flex justify-content-between">
                      <span className="text-gray-500">商品金額：</span>
                      <span className="text-primary-400 fw-bold">NT$3,726</span>
                    </p>
                  </div> */}
                          {/* 優惠券折抵 */}
                          {/* <div className="me-md-5">
                    <p className="d-flex justify-content-between">
                      <span className="text-gray-500">優惠券折抵：</span>
                      <span className="text-warning-dark fw-bold">-NT$100</span>
                    </p>
                  </div> */}
                          {/* 商品總金額 */}
                          <div>
                            <p className="d-flex justify-content-between">
                              <span className="text-primary-500">
                                商品總金額：
                              </span>
                              <span className="text-gray-950 fw-bold">
                                NT${cartProducts?.final_total}
                              </span>
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "30vh" }}
                      >
                        <div>
                          <ThreeCircles
                            visible={true}
                            height={100}
                            width={100}
                            color="#e1ff00"
                            ariaLabel="three-circles-loading"
                          />
                          <p className="mt-4">載入中，請稍後...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 購物須知、繼續購物按鈕、開始結帳按鈕 */}
            <div className="container px-0 max-w-1296 d-flex flex-column flex-lg-row  justify-content-between">
              {/* 複選鈕、購物須知 */}
              <div className="d-flex mb-lg-0 mb-4">
                {/* 複選鈕 */}
                <div className="form-check ps-0 d-flex align-items-center mb-0">
                  <div className="me-3 p-104">
                    <input
                      className="form-check-input rounded-1 max-w-20 max-h-20 ms-0 mt-0 border-gray-500 border-2 box-shadow-none"
                      type="checkbox"
                      id="shippingFreeCheck"
                      checked={isNoticeChecked}
                      onChange={(e) => {
                        setIsNoticeChecked(e.target.checked);
                        if (!isNoticeChecked) {
                          toast.success("已勾選購物須知 !", {
                            className: "handleAddToCartToast",
                            icon: (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                fill="#e1ff00"
                                className="bi bi-check-square-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                              </svg>
                            ),
                          });
                        } else {
                          toast.error("已取消勾選購物須知", {
                            className: "handleAddToCartToast",
                            icon: (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                fill="#ff514f"
                                className="bi bi-x-square-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
                              </svg>
                            ),
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                {/* 購物須知 */}
                <div>
                  <div>
                    <p className="fs-8 fs-md-6 text-gray-950">
                      若您有購買健身課程相關服務或入場方案 ( 免配送商品 )。
                    </p>
                  </div>
                  <div>
                    <p className="fs-8 fs-md-6 text-gray-950">
                      結帳完成後，請務必至實體門市櫃台出示訂單編號，並辦理相關手續
                    </p>
                  </div>
                  <div>
                    <p className="fs-8 text-primary-400">
                      ( 請攜帶身分證、健保卡 )
                    </p>
                  </div>
                </div>
              </div>
              {/* 繼續購物按鈕、開始結帳按鈕 */}
              <div className="d-flex flex-column flex-md-row align-items-md-center">
                <Link 
                  className="mb-6 mb-md-0 me-md-6 px-9 py-2 py-md-3 fill-btn btn fs-7 fw-bold  flex-fill border-radius-12"
                  to="/product-list"
                  state={{ openCategory: "all" }}
                >
                  繼續購物
                </Link>
                <button
                  type="button"
                  className="me-md-6 py-2 px-9 py-md-3 btn py-md-3 fill-btn fs-7 fw-bold flex-fill border-radius-12"
                  disabled={isCartEmpty}
                  onClick={handleStartCheckout}
                >
                  開始結帳
                </button>
              </div>
            </div>
          </section>
          {/* 銅板價湊免運加購專區  */}
          <section className="px-6 mb-9 mb-md-11 container max-w-1296">
            {/* 銅板價湊免運加購專區標題 */}
            <div className="mb-3 mb-md-8">
              <h2 className="mb-0 fs-5 fs-md-10 text-gray-950 fw-bold lh-sm">
                銅板價湊免運加購專區
              </h2>
            </div>
            {/* 銅板價湊免運加購專區卡片 */}
            <div className="position-relative">
              {coinProducts.length > 0 ? (
                <ProductsCardsCarousel cardsCarouselProducts={coinProducts} />
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <ThreeCircles
                    visible={true}
                    height={100}
                    width={100}
                    color="#e1ff00"
                    ariaLabel="three-circles-loading"
                  />
                  <p className="mt-4">載入中，請稍後...</p>
                </div>
              )}
            </div>
          </section>
          {/* 超值加購專區 */}
          <section className="px-6 mb-9 mb-md-11 container max-w-1296">
            {/* 超值加購專區 */}
            <div className="mb-3 mb-md-8">
              <h2 className="mb-0 fs-5 fs-md-10 text-gray-950 fw-bold lh-sm">
                超值加購專區
              </h2>
            </div>
            {/* 超值加購專區卡片 */}
            <div className="position-relative">
              {goodValueProducts.length > 0 ? (
                <ProductsCardsCarousel
                  cardsCarouselProducts={goodValueProducts}
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <ThreeCircles
                    visible={true}
                    height={100}
                    width={100}
                    color="#e1ff00"
                    ariaLabel="three-circles-loading"
                  />
                  <p className="mt-4">載入中，請稍後...</p>
                </div>
              )}
            </div>
          </section>
          {/* 回到頂部按鈕 */}
          <BackTop />
        </>
      </main>
    </>
  );
}

export default CartStepOne;
