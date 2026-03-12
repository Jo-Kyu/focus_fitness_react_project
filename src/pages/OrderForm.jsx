// 匯入Hook
import { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router";

// 匯入套件
import { useForm } from "react-hook-form";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ThreeCircles } from "react-loader-spinner";
import { CartContext } from "../context/CartContext";

// 匯入元件
import Glow from "../components/Glow.jsx";
import CartEmpty from "../pages/CartEmpty.jsx";
import Loading from "../components/Loading.jsx";
// 回到最上方
import BackTop from "../components/BackTop";

// 環境變數
const baseUrl = import.meta.env.VITE_BASE_URL;
const path = import.meta.env.VITE_API_PATH;

function OrderForm() {
  // 購物車商品輸量狀態撈取
  const { fetchCartCount } = useContext(CartContext);
  // 初始化導航工具
  const navigate = useNavigate();
  // 儲存購物車列表資料
  const [cartProducts, setCartProducts] = useState([]);
  // 判斷頁面載入
  const [isAllPageLoading, setAllPageLoading] = useState(true);

  // 篩選須配送商品
  const carts = cartProducts?.carts ?? [];
  const shippingProducts = carts.filter((item) => item.product.is_shipping);

  // 篩選免配送商品
  const shippingFreeProducts = carts.filter(
    (item) => !item.product.is_shipping,
  );

  // 須配送商品總額
  const shippingProductsTotal = calcProductsTotal(shippingProducts);
  // 免配送商品總額
  const shippingFreeProductsTotal = calcProductsTotal(shippingFreeProducts);

  // 運費判斷
  const shippingTotal = useMemo(() => {
    return shippingProducts.reduce((sum, item) => {
      return sum + item.total;
    }, 0);
  }, [shippingProducts]);

  const shippingFee = useMemo(() => {
    if (shippingProducts.length === 0) return 0;
    return shippingTotal >= 499 ? 0 : 60;
  }, [shippingProducts, shippingTotal]);

  // 呼叫取得購物車列表、呼叫取的所有商品
  useEffect(() => {
    getCartProducts();
  }, []);

  // 取得購物車列表(get網路請求)
  async function getCartProducts() {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${path}/cart`);
      setCartProducts(res.data.data);
    } catch (err) {
      if (err.status === 404) {
        alert("發生錯誤");
      }
    } finally {
      setAllPageLoading(false);
    }
  }

  // 篩選須配送商品

  // 須配送商品、免配送商品的個別的商品總額
  function calcProductsTotal(products) {
    return products.reduce((sum, item) => sum + item.total, 0);
  }

  // ReactHookForm

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      invoiceType: "member",
      paymentMethod: "credit",
    },
    mode: "onTouched",
  });

  // 表單提交事件處理函式、成立訂單 (post網路請求)
  const handleOnSubmit = async (data) => {
    const userSetOrder = {
      data: {
        user: {
          name: data.userName,
          email: data.userEmail,
          tel: data.userPhone,
          address: data.userAddress,
        },
        message: data.userNote,
      },
    };

    try {
      const res = await axios.post(
        `${baseUrl}/v2/api/${path}/order`,
        userSetOrder,
      );

      reset();
      getCartProducts();
      checkout(res.data.orderId);
    } catch (err) {
      // 錯誤判斷使用 err.response.status，比 err.status 穩定
      if (err?.response?.status === 404) {
        alert("發生錯誤");
      }
    }
  };

  // 結帳 (post網路請求)
  async function checkout(orderId) {
    try {
      await axios.post(`${baseUrl}/v2/api/${path}/pay/${orderId}`);
      fetchCartCount();
    } catch (err) {
      // 使用 err.response.status 判斷錯誤，比 err.status 更可靠
      if (err?.response?.status === 404) {
        alert("發生錯誤");
      }
    }
  }

  // 監聽付款方式
  const paymentMethod = watch("paymentMethod");

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
              <div className="me-md-8 me-2 bg-primary-500 rounded-circle py-106 py-md-103 px-2 px-md-102 max-w-md-64 max-w-26 max-h-md-64 max-h-26 d-flex justify-content-center align-items-center">
                <h2 className="fs-8 fs-md-2 text-gray-900 fw-bold lh-sm">2</h2>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-6">
                  <h1 className="fs-9 fs-md-5 text-white">填寫訂購資料</h1>
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

        {/* 填寫訂購資訊 */}
        <section className="mb-4 container max-w-1296">
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="row flex-column flex-md-row">
              {/* 收件人資訊 */}
              <div className="col col-md-5">
                {/* 收件人資訊欄位 */}
                <div className="mb-4 mb-sm-8 container px-0 max-w-1296 border border-secondary-600 border-radius-12">
                  {/* 收件人資料標題 */}
                  <div className="py-6 py-sm-4  bg-blue-700 text-center border-radius-12 border-bottom-leftt-radius-0 border-bottom-right-radius-0">
                    <h2 className="fs-7 text-gray-950 fw-bold">收件人資料</h2>
                  </div>
                  {/* 收件人資料輸入欄位 */}
                  <div className="p-6 p-xl-8">
                    {/* 姓名 */}
                    <div className="mb-8">
                      <label htmlFor="userName" className="form-label">
                        姓名<span className="must">*</span>
                      </label>
                      <input
                        {...register("userName", {
                          required: "使用者名稱為必填",
                        })}
                        type="text"
                        className={`form-control ${errors.userName && "is-invalid"}`}
                        id="userName"
                        placeholder="請輸入姓名"
                      />
                      {errors.userName && (
                        <div className="invalid-feedback text-primary-400">
                          {errors?.userName?.message}
                        </div>
                      )}
                    </div>
                    {/* 信箱 */}
                    <div className="mb-8">
                      <label htmlFor="userEmail" className="form-label fs-8">
                        信箱<span className="must">*</span>
                      </label>
                      <input
                        {...register("userEmail", {
                          required: "電子郵件為必填",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "請輸入正確的電子郵件格式",
                          },
                        })}
                        type="email"
                        className={`form-control ${errors.userEmail && "is-invalid"}`}
                        id="userEmail"
                        placeholder="請輸入聯絡信箱，例如example@gmail.com"
                      />
                      {errors.userEmail && (
                        <div className="invalid-feedback text-primary-400">
                          {errors?.userEmail?.message}
                        </div>
                      )}
                    </div>
                    {/* 電話 */}
                    <div className="mb-8">
                      <label htmlFor="userPhone" className="form-label">
                        連絡電話<span className="must">*</span>
                      </label>
                      <input
                        {...register("userPhone", {
                          required: "連絡電話為必填",
                          pattern: {
                            value: /^(0[2-8]\d{7}|09\d{8})$/,
                            message: "請輸入正確的手機號碼",
                          },
                          minLength: { value: 10, message: "手機號碼長度不足" },
                          maxLength: { value: 11, message: "手機號碼長度過長" },
                        })}
                        type="tel"
                        className={`form-control ${errors.userPhone && "is-invalid"}`}
                        id="userPhone"
                        placeholder="請輸入手機號碼"
                      />
                      {errors.userPhone && (
                        <div className="invalid-feedback text-primary-400">
                          {errors?.userPhone?.message}
                        </div>
                      )}
                    </div>
                    {/* 地址 */}
                    <div className="mb-8">
                      <label htmlFor="userAddress" className="form-label">
                        地址<span className="must">*</span>
                      </label>
                      <input
                        {...register("userAddress", {
                          required: "地址為必填",
                          minLength: { value: 10, message: "地址長度過短" },
                        })}
                        type="text"
                        className={`form-control ${errors.userAddress && "is-invalid"}`}
                        id="inputAddres"
                        placeholder="請輸入完整配送地址，例如台北市信義區信義路100號1樓"
                      />
                      {errors.userAddress && (
                        <div className="invalid-feedback text-primary-400">
                          {errors?.userAddress?.message}
                        </div>
                      )}
                    </div>
                    {/* 備註 */}
                    <div>
                      <label htmlFor="userNote" className="form-label">
                        備註欄
                      </label>
                      <textarea
                        {...register("userNote")}
                        className="form-control"
                        type="text"
                        id="exampleFormControlTextarea1"
                        placeholder="備註內容"
                        rows="8"
                      ></textarea>
                    </div>
                  </div>
                </div>
                {/* 發票 */}
                <div className="mb-4 mb-sm-8 container px-0 max-w-1296 border border-secondary-600 border-radius-12">
                  {/* 發票方式標題 */}
                  <div className="py-6 py-sm-4  bg-blue-700 text-center border-radius-12 border-bottom-leftt-radius-0 border-bottom-right-radius-0">
                    <h2 className="fs-7 text-gray-950 fw-bold">發票方式</h2>
                  </div>
                  {/* 發票方式 */}
                  <div className="container">
                    <div className="row p-6 p-xl-8">
                      {/* 電子 */}
                      <div className="col-12 col-md-6 py-2 px-4 p-md-6 mb-0">
                        <div className="form-check text-white">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="invoice-member"
                            value="member"
                            {...register("invoiceType")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="invoice-member"
                          >
                            電子發票(會員載具)
                          </label>
                        </div>
                      </div>
                      {/* 電子 */}
                      <div className="col-12 col-md-6 py-2 px-4 p-md-6 mb-0">
                        <div className="form-check text-white mb-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="invoice-mobile"
                            value="mobile"
                            {...register("invoiceType")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="invoice-mobile"
                          >
                            電子發票(手機載具)
                          </label>
                        </div>
                      </div>
                      {/* 捐贈 */}
                      <div className="col-12 col-md-6 py-2 px-4 p-md-6 mb-0">
                        <div className="form-check text-white mb-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="invoice-donate"
                            value="donate"
                            {...register("invoiceType")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="invoice-donate"
                          >
                            捐贈
                          </label>
                        </div>
                      </div>
                      {/* 三聯 */}
                      <div className="col-12 col-md-6 py-2 px-4 p-md-6 mb-0">
                        <div className="form-check text-white mb-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="invoice-paper"
                            value="paper"
                            {...register("invoiceType")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="invoice-paper"
                          >
                            三聯式紙本發票
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 付款 */}
                <div className="mb-4 mb-sm-8 container px-0 max-w-1296 border border-secondary-600 border-radius-12">
                  {/* 付款方式標題 */}
                  <div className="py-6 py-sm-4  bg-blue-700 text-center border-radius-12 border-bottom-leftt-radius-0 border-bottom-right-radius-0">
                    <h2 className="fs-7 text-gray-950 fw-bold mb-1">
                      付款方式
                    </h2>
                    <p className="text-secondary-400 fs-9">( 宅配到府 )</p>
                  </div>
                  {/* 付款方式 */}
                  <div className="container">
                    <div className="row p-6 p-xl-8 pb-xl-2">
                      <div className="col-6 col-md-4 py-2 px-3 p-md-6 mb-0">
                        {/* 信用卡  */}
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="payment-credit"
                            value="credit"
                            {...register("paymentMethod")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="payment-credit"
                          >
                            信用卡
                          </label>
                        </div>
                      </div>
                      {/* Line Pay  */}
                      <div className="col-6 col-md-4 py-2 px-3 p-md-6 mb-0">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="payment-linepay"
                            value="linePay"
                            {...register("paymentMethod")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="payment-linepay"
                          >
                            Line Pay
                          </label>
                        </div>
                      </div>
                      {/* 街口支付   */}
                      <div className="col-6 col-md-4 py-2 px-3 p-md-6 mb-0">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="payment-jkopay"
                            value="jkoPay"
                            {...register("paymentMethod")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="payment-jkopay"
                          >
                            街口支付
                          </label>
                        </div>
                      </div>
                      {/* ATM轉帳   */}
                      <div className="col-6 col-md-4 py-2 px-3 p-md-6 mb-0">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="payment-atm"
                            value="atm"
                            {...register("paymentMethod")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="payment-atm"
                          >
                            ATM轉帳
                          </label>
                        </div>
                      </div>
                      {/* 全支付 */}
                      <div className="col-6 col-md-4 py-2 px-3 p-md-6 mb-0">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="payment-pxpay"
                            value="pxPay"
                            {...register("paymentMethod")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="payment-pxpay"
                          >
                            全支付
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* 點擊信用卡才顯示 */}
                    {paymentMethod === "credit" && (
                      <div className="row p-6 pb-8 pt-0 pt-xl-0 p-xl-8 pb-xl-9 d-flex justify-content-between">
                        {/* 信用卡號碼 */}
                        <div className="col-12 mb-4">
                          <label
                            htmlFor="userCreditCardNum"
                            className="form-label fs-8"
                          >
                            信用卡號碼<span className="must">*</span>
                          </label>
                          <input
                            {...register("userCreditCardNum", {
                              required: "信用卡號為必填",
                              pattern: {
                                value: /^\d{16}$/,
                                message: "信用卡號碼需為16碼數字",
                              },
                            })}
                            type="number"
                            className={`form-control remove-spin ${errors.userCreditCardNum && "is-invalid"}`}
                            id="userCreditCardNum"
                            placeholder="請輸入16碼信用卡號"
                          />
                          {errors.userCreditCardNum && (
                            <div className="invalid-feedback text-primary-400">
                              {errors?.userCreditCardNum?.message}
                            </div>
                          )}
                        </div>
                        {/* 信用卡有效期限 */}
                        <div className="col-12 col-md-6 col-lg-7">
                          <label
                            htmlFor="userCreditCardDate"
                            className="form-label fs-8"
                          >
                            信用卡有效期限 ( MM / YY )
                            <span className="must">*</span>
                          </label>
                          <div className="d-flex">
                            <input
                              {...register("userCreditCardMonth", {
                                required: "請輸入月份",
                              })}
                              type="number"
                              className={`form-control remove-spin ${errors.userCreditCardMonth && "is-invalid"}`}
                              id="userCreditCardMonth"
                              placeholder="請輸入月份"
                            />

                            <input
                              {...register("userCreditCardYear", {
                                required: "請輸入年份",
                              })}
                              type="number"
                              className={`form-control remove-spin ${errors.userCreditCardYear && "is-invalid"}`}
                              placeholder="請輸入年份"
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-5">
                          <label
                            htmlFor="userCreditCardSafe"
                            className="form-label fs-8"
                          >
                            信用卡安全碼 ( CVV )<span className="must">*</span>
                          </label>
                          <input
                            {...register("userCreditCardSafe", {
                              required: "安全碼為必填",
                            })}
                            type="number"
                            className={`form-control remove-spin ${errors.userCreditCardSafe && "is-invalid"}`}
                            id="userCreditCardSafe"
                            placeholder="請輸入安全碼"
                          />
                        </div>
                      </div>
                    )}
                    {/* 點擊轉帳才出現 */}
                    {paymentMethod === "atm" && (
                      <div className="p-6 text-primary-400 fs-5">
                        <p>銀行與代碼：專注銀行（666）</p>
                        <p>銀行帳號：6666-6666-6666-6666</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 訂單內容、訂單金額總計 */}
              <div className="col col-md-7">
                {/* 訂單內容 */}
                <div className="mb-4 border border-secondary-600 border-radius-12">
                  {/* 訂單內容標題 */}
                  <div className="py-6 py-sm-4 bg-blue-700 text-center border-radius-12 border-bottom-leftt-radius-0 border-bottom-right-radius-0">
                    <h2 className="fs-7 text-gray-950 fw-bold">訂單內容</h2>
                  </div>
                  {/* 須配送商品 */}
                  {shippingProducts.length > 0 && (
                    <>
                      {/* 須配送商品標題 */}
                      <div className=" py-3 px-106 px-lg-4 border-bottom border-blue-600">
                        <h3 className="fs-6 text-info-normal fw-regular text-center">
                          須配送商品
                        </h3>
                      </div>
                      {shippingProducts.length > 0 ? (
                        <>
                          {/* 須配送商品商品清單 */}
                          {shippingProducts.map((cartProduct) => {
                            // 原價
                            const originalPrice =
                              cartProduct?.product?.origin_price;
                            // 總數量售價
                            const totalPrice = cartProduct?.total;
                            // 總數量
                            const cartProductQty = cartProduct?.qty;
                            // 總數量原價
                            const totalOriginalPrice =
                              originalPrice * cartProductQty;
                            // 折扣
                            const discount = Math.round(
                              (1 - totalPrice / totalOriginalPrice) * 100,
                            );
                            return (
                              <div
                                className="py-6 py-xl-8 px-106 px-xl-4 d-flex justify-content-between border-bottom border-blue-600"
                                key={cartProduct?.id}
                              >
                                {/* 商品圖片、商品資訊 */}
                                <div className="d-flex  mb-lg-0 mb-3">
                                  {/* 商品圖片 */}
                                  <div className="me-6 me-xl-4 max-w-80 max-w-xl-160">
                                    <img
                                      className="rounded-3 max-h-73 max-h-xl-145"
                                      src={cartProduct?.product?.imageUrl}
                                      alt="Focus耐磨皮格拉力帶"
                                    />
                                  </div>
                                  {/* 商品資訊 */}
                                  <div>
                                    {/* 商品名稱 */}
                                    <div className="mb-2 mb-lg-6">
                                      <h2 className="fs-8 fs-xl-5 fw-bold lh-sm">
                                        {cartProduct?.product?.title}
                                      </h2>
                                    </div>
                                    {/* 商品規格 */}
                                    <div className="mb-2 mb-lg-6">
                                      <p className="fs-9 fs-xl-6 text-gray-500">
                                        顏色：{cartProduct?.color}
                                      </p>
                                    </div>
                                    {/* 商品規格 */}
                                    <div className="mb-2 mb-xl-6">
                                      <p className="fs-9 fs-xl-6 text-gray-500">
                                        尺寸：{cartProduct?.size}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {/* 售價、原價、優惠資訊、刪除按鈕 */}
                                <div className="d-flex align-items-top justify-content-end">
                                  {/* 售價、原價、優惠資訊 */}
                                  <div>
                                    {/* 售價、原價 */}
                                    <div className="mb-6 d-flex align-items-sm-center align-items-end flex-column flex-sm-row">
                                      {/* 售價 */}
                                      <div className="mb-1 mb-sm-0 me-sm-6">
                                        <h2 className="fs-8 fs-xl-7 text-gray-950 fw-bold lh-sm">
                                          NT${cartProduct?.total}
                                        </h2>
                                      </div>
                                      {/* 原價 */}
                                      <div>
                                        <h3 className="fs-9 fs-xl-6 fw-bold text-gray-500 text-decoration-line-through">
                                          NT${totalOriginalPrice}
                                        </h3>
                                      </div>
                                    </div>
                                    {/* 優惠資訊 */}
                                    <div className="mb-6 text-end ">
                                      <h3 className="fs-9 fs-xl-7 text-warning-dark fw-regular">
                                        為您省下{discount}%
                                      </h3>
                                    </div>
                                    {/* 商品數量 */}
                                    <div>
                                      <h4 className="fs-9 fs-xl-6 fw-regular text-end text-gray-500">
                                        數量：{cartProduct?.qty}
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {/* 須配送商品金額總計 */}
                          <div className="py-6 py-lg-8 px-106 px-lg-4">
                            <div className="mb-106 mb-sm-3 d-flex justify-content-between">
                              <h3 className="fs-8 text-gray-500 fw-regular">
                                商品金額 (
                                <span className="text-primary-500">
                                  {shippingProducts?.length}
                                </span>
                                件商品 )
                              </h3>
                              <h2 className="fs-6 fs-lg-5 text-gray-950 fw-bold">
                                NT${shippingProductsTotal}
                              </h2>
                            </div>
                            <div className="d-flex justify-content-between">
                              <h3 className="fs-8 text-gray-500 fw-regular">
                                宅配運費
                              </h3>
                              <h2 className="fs-8 fs-lg-6 fs-sm-6 text-warning-normal fw-bold">
                                {shippingProductsTotal >= 499
                                  ? "免運"
                                  : "NT$60"}
                              </h2>
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
                    </>
                  )}
                  {/* 免配送商品 */}
                  {shippingFreeProducts.length > 0 && (
                    <>
                      {/* 免配送商品標題 */}
                      <div className=" py-3 px-106 px-lg-4 border-top border-bottom border-blue-600">
                        <h3 className="fs-6 text-info-normal fw-regular text-center">
                          免配送商品
                        </h3>
                      </div>
                      {shippingFreeProducts.length > 0 ? (
                        <>
                          {/* 免配送商品商品清單 */}
                          {shippingFreeProducts.map((cartProduct) => {
                            // 原價
                            const originalPrice =
                              cartProduct?.product?.origin_price;
                            // 總數量售價
                            const totalPrice = cartProduct?.total;
                            // 總數量
                            const cartProductQty = cartProduct?.qty;
                            // 總數量原價
                            const totalOriginalPrice =
                              originalPrice * cartProductQty;
                            // 折扣
                            const discount = Math.round(
                              (1 - totalPrice / totalOriginalPrice) * 100,
                            );
                            return (
                              <div
                                className="py-6 py-xl-8 px-106 px-xl-4  border-bottom border-blue-600"
                                key={cartProduct?.id}
                              >
                                <div className="d-flex justify-content-between mb-1">
                                  {/* 商品圖片、商品資訊 */}
                                  <div className="d-flex  mb-lg-0 mb-3">
                                    {/* 商品圖片 */}
                                    <div className="me-6 me-xl-4 max-w-80 max-w-xl-160">
                                      <img
                                        className="rounded-3 max-h-73 max-h-xl-145"
                                        src={cartProduct?.product?.imageUrl}
                                        alt="Focus耐磨皮格拉力帶"
                                      />
                                    </div>
                                    {/* 商品資訊 */}
                                    <div>
                                      {/* 商品名稱 */}
                                      <div className="max-w-210">
                                        <div className="mb-6">
                                          <h2 className="fs-9 fs-sm-8 fs-xl-5 fw-bold lh-sm">
                                            {cartProduct?.product?.title}
                                          </h2>
                                        </div>
                                        <div className="d-none d-sm-block">
                                          <h3 className="fs-9 text-secondary-400 fw-regular">
                                            (
                                            請至實體門市櫃台出示訂單編號，並辦理相關手續
                                            )
                                          </h3>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* 售價、原價、優惠資訊 */}
                                  <div className="d-flex align-items-top justify-content-end">
                                    {/* 售價、原價、優惠資訊 */}
                                    <div>
                                      {/* 售價、原價 */}
                                      <div className="mb-6 d-flex align-items-sm-center align-items-end flex-column flex-sm-row">
                                        {/* 售價 */}
                                        <div className="mb-1 mb-sm-0 me-sm-6">
                                          <h2 className="fs-8 fs-xl-7 text-gray-950 fw-bold lh-sm">
                                            NT${cartProduct?.total}
                                          </h2>
                                        </div>
                                        {/* 原價 */}
                                        <div>
                                          <h3 className="fs-9 fs-xl-6 fw-bold text-gray-500 text-decoration-line-through">
                                            NT${totalOriginalPrice}
                                          </h3>
                                        </div>
                                      </div>
                                      {/* 優惠資訊 */}
                                      <div className="mb-6 text-end ">
                                        <h3 className="fs-9 fs-xl-7 text-warning-dark fw-regular">
                                          為您省下{discount}%
                                        </h3>
                                      </div>
                                      {/* 商品數量 */}
                                      <div>
                                        <h4 className="fs-9 fs-xl-6 fw-regular text-end text-gray-500">
                                          數量：{cartProduct?.qty}
                                        </h4>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="d-sm-none text-center">
                                  <h3 className="fs-9 text-secondary-400 fw-regular">
                                    (
                                    請至實體門市櫃台出示訂單編號，並辦理相關手續
                                    )
                                  </h3>
                                </div>
                              </div>
                            );
                          })}
                          {/* 免配送商品金額總計
                           */}
                          <div className="py-6 py-lg-8 px-106 px-lg-4">
                            <div className="mb-106 mb-sm-3 d-flex justify-content-between">
                              <h3 className="fs-8 text-gray-500 fw-regular">
                                商品金額 (
                                <span className="text-primary-500">
                                  {shippingFreeProducts?.length}
                                </span>
                                件商品 )
                              </h3>
                              <h2 className="fs-6 fs-lg-5 text-gray-950 fw-bold">
                                NT${shippingFreeProductsTotal}
                              </h2>
                            </div>
                            <div className="d-flex justify-content-between">
                              <h3 className="fs-8 text-gray-500 fw-regular">
                                宅配運費
                              </h3>
                              <h2 className="fs-8 fs-lg-6 text-warning-normal fw-bold">
                                免運
                              </h2>
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
                    </>
                  )}
                </div>

                {/* 訂單金額總計 */}
                <div className="mb-4 border border-secondary-600 border-radius-12">
                  {/* 訂單金額總計標題 */}
                  <div className="py-6 py-sm-4 bg-blue-700 text-center border-radius-12 border-bottom-leftt-radius-0 border-bottom-right-radius-0">
                    <h2 className="fs-7 text-gray-950 fw-bold">訂單金額總計</h2>
                  </div>
                  {cartProducts.final_total ? (
                    <>
                      {/* 訂單金額總計 */}
                      <div className="py-6 py-lg-8 px-106 px-lg-4">
                        <div>
                          {/* 商品金額 */}
                          <div className="mb-6 d-flex">
                            <div className="ms-auto">
                              <h3 className="fs-6 text-gray-200 fw-regular">
                                商品總金額：
                              </h3>
                            </div>
                            <div className="max-w-120">
                              <h3 className="fs-6 text-white fw-bold text-end">
                                NT${cartProducts.final_total}
                              </h3>
                            </div>
                          </div>
                          {/* 優惠券折抵 */}
                          {/* <div className="mb-6 d-flex">
                            <div className="ms-auto">
                                <h3 className="fs-6 text-gray-200 fw-regular">優惠券折抵：</h3>
                            </div>
                            <div className="max-w-120" >
                                <h3 className="fs-6 text-warning-dark fw-bold text-end">-NT$100</h3>
                            </div>
                        </div> */}
                          {/* 運費 */}
                          <div className="mb-6 d-flex">
                            <div className="ms-auto">
                              <h3 className="fs-6 text-gray-200 fw-regular">
                                運費：
                              </h3>
                            </div>
                            <div className="max-w-120">
                              <h3 className="fs-6 text-white fw-bold text-end">
                                NT${shippingFee}
                              </h3>
                            </div>
                          </div>
                          {/* 結帳總金額 */}
                          <div className="d-flex">
                            <div className="ms-auto">
                              <h3 className="fs-6 text-gray-200 fw-regular">
                                結帳總金額：
                              </h3>
                            </div>
                            <div className="max-w-120">
                              <h3 className="fs-6 text-primary-400 fw-bold text-end">
                                NT$
                                {cartProducts?.final_total + shippingFee}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex justify-content-center align-items-center">
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
                {/* 完成結帳按鈕 */}
                <div></div>
                <div className="text-end mb-2">
                  <button
                    type="submit"
                    className="mx-auto py-2 px-9 py-md-3 btn py-md-3 fill-btn fs-7 fw-bold flex-fill border-radius-12"
                    disabled={!isValid}
                    onClick={() =>
                      navigate("/checkout", {
                        state: { fromCheckout: true },
                      })
                    }
                  >
                    完成結帳
                  </button>
                </div>
                {!isValid && (
                  <p className="text-danger-normal text-end ">
                    表單尚未填寫完整，無法點擊「 完成結帳 」
                  </p>
                )}
              </div>
            </div>
          </form>
        </section>
      </main>
      <BackTop />
    </>
  );
}

export default OrderForm;
