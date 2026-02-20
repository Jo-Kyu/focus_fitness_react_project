// 匯入Hook
import { useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Collapse } from "bootstrap";

// 匯入套件
import Swal from "sweetalert2";

// 匯入元件
import { LoginAuthContext } from "../context/LoginAuthContext";
import customer_5 from "../assets/images/icons/customer_5.png";

function Header() {
  // 登入共用狀態解構
  const { isAuth } = useContext(LoginAuthContext);
  // ref 指向 collapse 的 div
  const navbarRef = useRef(null);
  // 儲存實例
  const collapseRef = useRef(null);
  // 導向至登入頁
  const navigate = useNavigate();

  const customerIcon = (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.5 28.5C25.5 27.5007 24.8918 26.4129 23.5312 25.5059C22.1812 24.6059 20.2303 24 18 24C15.7697 24 13.8188 24.6059 12.4688 25.5059C11.1082 26.4129 10.5 27.5007 10.5 28.5C10.5 29.3284 9.82843 30 9 30C8.17157 30 7.5 29.3284 7.5 28.5C7.5 26.1856 8.90783 24.2743 10.8047 23.0098C12.712 21.7383 15.26 21 18 21C20.74 21 23.288 21.7383 25.1953 23.0098C27.0922 24.2743 28.5 26.1856 28.5 28.5C28.5 29.3284 27.8284 30 27 30C26.1716 30 25.5 29.3284 25.5 28.5ZM22.5 12C22.5 9.51472 20.4853 7.5 18 7.5C15.5147 7.5 13.5 9.51472 13.5 12C13.5 14.4853 15.5147 16.5 18 16.5C20.4853 16.5 22.5 14.4853 22.5 12ZM25.5 12C25.5 16.1421 22.1421 19.5 18 19.5C13.8579 19.5 10.5 16.1421 10.5 12C10.5 7.85786 13.8579 4.5 18 4.5C22.1421 4.5 25.5 7.85786 25.5 12Z"
        fill="white"
      />
    </svg>
  );
  const customerIconPhone = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.5 28.5C25.5 27.5007 24.8918 26.4129 23.5312 25.5059C22.1812 24.6059 20.2303 24 18 24C15.7697 24 13.8188 24.6059 12.4688 25.5059C11.1082 26.4129 10.5 27.5007 10.5 28.5C10.5 29.3284 9.82843 30 9 30C8.17157 30 7.5 29.3284 7.5 28.5C7.5 26.1856 8.90783 24.2743 10.8047 23.0098C12.712 21.7383 15.26 21 18 21C20.74 21 23.288 21.7383 25.1953 23.0098C27.0922 24.2743 28.5 26.1856 28.5 28.5C28.5 29.3284 27.8284 30 27 30C26.1716 30 25.5 29.3284 25.5 28.5ZM22.5 12C22.5 9.51472 20.4853 7.5 18 7.5C15.5147 7.5 13.5 9.51472 13.5 12C13.5 14.4853 15.5147 16.5 18 16.5C20.4853 16.5 22.5 14.4853 22.5 12ZM25.5 12C25.5 16.1421 22.1421 19.5 18 19.5C13.8579 19.5 10.5 16.1421 10.5 12C10.5 7.85786 13.8579 4.5 18 4.5C22.1421 4.5 25.5 7.85786 25.5 12Z"
        fill="white"
      />
    </svg>
  );
  const favoriteIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      fill="none"
      stroke="white"
      viewBox="0 -2 16 20"
      strokeWidth="2"
    >
      <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
    </svg>
  );

  // 初始化 Bootstrap Collapse 實例
  useEffect(() => {
    if (navbarRef.current) {
      collapseRef.current = new Collapse(navbarRef.current, {
        toggle: false, // 不要一建立就自動切換狀態
      });
    }
    // 元件卸載時清除實例
    return () => {
      collapseRef.current?.dispose();
    };
  }, []);

  // 路由切換時自動關閉選單
  useEffect(() => {
    collapseRef.current?.hide();
  }, []);

  // 手動關閉選單
  const closeNavbar = () => {
    collapseRef.current?.hide();
  };

  return (
    <>
      {/* 毛玻璃導覽列 */}
      <div className="navbar-wrapper mt-7 mt-lg-9 ">
        <div className="container">
          <nav className="navbar navbar-expand-lg glass-navbar">
            {/* Logo */}
            <Link className="navbar-brand fw-bold" to="/">
              <img
                src="https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/logos/FOCUS-FITNESS-logo-3-long-big.png?raw=true"
                alt="Logo-Focus"
                style={{ width: "137px", height: "60px" }}
                className="d-none d-lg-block"
              />
              <img
                src="https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/logos/FOCUS-FITNESS-logo-3-long-small.png?raw=true"
                alt="Logo"
                style={{ width: "36px", height: "40px" }}
                className="d-block d-lg-none"
              />
            </Link>
            {/* Toggler (手機選單按鈕) */}
            <div className="mobile-toggler d-flex justify-content-center align-items-center column-gap-1">
              {/* 購物車 */}
              <Link
                className="d-block d-lg-none p-2 text-dark"
                to="/cart-step-one"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 30C9 28.3431 10.3431 27 12 27C13.6569 27 15 28.3431 15 30C15 31.6569 13.6569 33 12 33C10.3431 33 9 31.6569 9 30ZM24 30C24 28.3431 25.3431 27 27 27C28.6569 27 30 28.3431 30 30C30 31.6569 28.6569 33 27 33C25.3431 33 24 31.6569 24 30ZM4.90283 3C5.23578 3 5.5677 2.99933 5.85059 3.02051C6.07676 3.03745 6.33035 3.07158 6.59619 3.15528L6.86572 3.25635L7.05469 3.34717C7.42358 3.5422 7.74694 3.81262 8.00537 4.13965L8.12988 4.30811L8.27783 4.5542C8.40826 4.80001 8.48822 5.04272 8.5459 5.26172C8.618 5.53562 8.67754 5.86261 8.73779 6.18897L8.97949 7.5H28.4824C28.9703 7.5 29.4353 7.49845 29.8184 7.53223C30.2137 7.56711 30.6936 7.65056 31.1543 7.92627C31.7739 8.29729 32.245 8.88168 32.4697 9.57715C32.6349 10.0884 32.6066 10.5749 32.5518 10.9673C32.4985 11.3482 32.3932 11.8007 32.2837 12.2754V12.2769L29.9297 22.4766L29.9253 22.4971L29.9238 22.5015C29.854 22.8043 29.7845 23.1075 29.7056 23.3628C29.6193 23.6416 29.494 23.958 29.269 24.2666C28.9526 24.7006 28.5247 25.0461 28.0239 25.2598C27.672 25.4099 27.3338 25.4597 27.0425 25.481C26.9061 25.4909 26.7581 25.4963 26.6045 25.4985L26.1328 25.5H10.5C9.77665 25.5 9.15625 24.9838 9.0249 24.2725L5.7876 6.73389C5.71928 6.36381 5.6809 6.16642 5.64404 6.02637C5.64282 6.02173 5.64079 6.01739 5.63965 6.01319C5.63548 6.01284 5.63103 6.01206 5.62647 6.01172C5.48138 6.00087 5.28015 6 4.90283 6H4.5C3.67157 6 3 5.32843 3 4.5C3 3.67158 3.67157 3 4.5 3H4.90283ZM11.748 22.5H26.1328C26.4943 22.5 26.6861 22.4984 26.8242 22.4883C26.8278 22.488 26.8312 22.4871 26.8345 22.4868C26.8355 22.4834 26.8377 22.4802 26.8389 22.4766C26.8796 22.3449 26.9233 22.1587 27.0044 21.8071L27.0059 21.7998L29.3599 11.603V11.6001C29.4816 11.0728 29.5503 10.7722 29.5811 10.5527C29.5825 10.5427 29.5814 10.5324 29.5825 10.5234C29.5738 10.5226 29.5645 10.5214 29.5547 10.5205C29.3342 10.5011 29.0251 10.5 28.4824 10.5H9.5332L11.748 22.5Z"
                    fill="white"
                  />
                </svg>
              </Link>
              {/* 會員中心 */}
              <Link className="d-block d-lg-none p-2 text-dark" to="/login">
                {isAuth ? (
                  <>
                    <img
                      className="max-w-36 d-flex align-items-center"
                      src={customer_5}
                      alt="顧客"
                    />
                  </>
                ) : (
                  customerIconPhone
                )}
              </Link>
              {/* 漢堡選單 */}
              <button
                className="navbar-toggler p-2 border-0"
                type="button"
                aria-label="Toggle navigation"
                onClick={() => collapseRef.current?.toggle()}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 16C19.5523 16 20 16.4477 20 17C20 17.5523 19.5523 18 19 18H5C4.44772 18 4 17.5523 4 17C4 16.4477 4.44772 16 5 16H19ZM19 11C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H19ZM19 6C19.5523 6 20 6.44772 20 7C20 7.55228 19.5523 8 19 8H5C4.44772 8 4 7.55228 4 7C4 6.44772 4.44772 6 5 6H19Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
            {/* 導覽列內容 */}
            <div
              ref={navbarRef}
              className="collapse navbar-collapse justify-content-center"
            >
              <ul className="navbar-nav column-gap-6">
                {/* FOCUS商城 */}
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link nav-pill"
                    to="/product-list"
                    state={{ openCategory: "all" }}
                  >
                    FOCUS商城
                  </Link>
                </li>
                {/* 收藏清單 */}
                <li className="nav-item">
                  <Link
                    className="nav-link nav-pill d-lg-none d-block"
                    to="/favorite-products"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // 判斷登入狀態
                      if (!isAuth) {
                        Swal.fire({
                          title: "您尚未登入帳號",
                          text: "登入帳號後，才可進入收藏商品清單！",
                          iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#e1ff00" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
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
                      // isAuth 為 true 時，正常導向收藏頁
                      navigate("/favorite-products");
                    }}
                  >
                    收藏清單
                  </Link>
                </li>
              </ul>
            </div>
            {/* 右側功能區 */}
            <div className="d-flex align-items-center  column-gap-6 d-none d-lg-block">
              {/* 收藏按鈕 */}
              <Link
                className="p-2 text-dark "
                to="/favorite-products"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // 判斷登入狀態
                  if (!isAuth) {
                    Swal.fire({
                      title: "您尚未登入帳號",
                      text: "登入帳號後，才可進入收藏商品清單！",
                      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#e1ff00" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
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
                  // isAuth 為 true 時，正常導向收藏頁
                  navigate("/favorite-products");
                }}
              >
                {favoriteIcon}
              </Link>
              {/* 購物車 */}
              <Link className="p-2 text-dark" to="/cart-step-one">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 30C9 28.3431 10.3431 27 12 27C13.6569 27 15 28.3431 15 30C15 31.6569 13.6569 33 12 33C10.3431 33 9 31.6569 9 30ZM24 30C24 28.3431 25.3431 27 27 27C28.6569 27 30 28.3431 30 30C30 31.6569 28.6569 33 27 33C25.3431 33 24 31.6569 24 30ZM4.90283 3C5.23578 3 5.5677 2.99933 5.85059 3.02051C6.07676 3.03745 6.33035 3.07158 6.59619 3.15528L6.86572 3.25635L7.05469 3.34717C7.42358 3.5422 7.74694 3.81262 8.00537 4.13965L8.12988 4.30811L8.27783 4.5542C8.40826 4.80001 8.48822 5.04272 8.5459 5.26172C8.618 5.53562 8.67754 5.86261 8.73779 6.18897L8.97949 7.5H28.4824C28.9703 7.5 29.4353 7.49845 29.8184 7.53223C30.2137 7.56711 30.6936 7.65056 31.1543 7.92627C31.7739 8.29729 32.245 8.88168 32.4697 9.57715C32.6349 10.0884 32.6066 10.5749 32.5518 10.9673C32.4985 11.3482 32.3932 11.8007 32.2837 12.2754V12.2769L29.9297 22.4766L29.9253 22.4971L29.9238 22.5015C29.854 22.8043 29.7845 23.1075 29.7056 23.3628C29.6193 23.6416 29.494 23.958 29.269 24.2666C28.9526 24.7006 28.5247 25.0461 28.0239 25.2598C27.672 25.4099 27.3338 25.4597 27.0425 25.481C26.9061 25.4909 26.7581 25.4963 26.6045 25.4985L26.1328 25.5H10.5C9.77665 25.5 9.15625 24.9838 9.0249 24.2725L5.7876 6.73389C5.71928 6.36381 5.6809 6.16642 5.64404 6.02637C5.64282 6.02173 5.64079 6.01739 5.63965 6.01319C5.63548 6.01284 5.63103 6.01206 5.62647 6.01172C5.48138 6.00087 5.28015 6 4.90283 6H4.5C3.67157 6 3 5.32843 3 4.5C3 3.67158 3.67157 3 4.5 3H4.90283ZM11.748 22.5H26.1328C26.4943 22.5 26.6861 22.4984 26.8242 22.4883C26.8278 22.488 26.8312 22.4871 26.8345 22.4868C26.8355 22.4834 26.8377 22.4802 26.8389 22.4766C26.8796 22.3449 26.9233 22.1587 27.0044 21.8071L27.0059 21.7998L29.3599 11.603V11.6001C29.4816 11.0728 29.5503 10.7722 29.5811 10.5527C29.5825 10.5427 29.5814 10.5324 29.5825 10.5234C29.5738 10.5226 29.5645 10.5214 29.5547 10.5205C29.3342 10.5011 29.0251 10.5 28.4824 10.5H9.5332L11.748 22.5Z"
                    fill="white"
                  />
                </svg>
              </Link>
              {/* 會員中心 */}
              <Link className="p-2 text-dark" to="/login">
                {isAuth ? (
                  <>
                    <img
                      className="max-w-36 d-flex align-items-center"
                      src={customer_5}
                      alt="顧客"
                    />
                  </>
                ) : (
                  customerIcon
                )}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Header;
