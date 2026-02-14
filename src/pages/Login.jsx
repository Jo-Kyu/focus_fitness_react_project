// 匯入Hook
import { useState, useRef, useEffect, useContext } from "react";

// 匯入元件
import { LoginAuthContext } from "../components/LoginAuthProvider";
// header
import Header from "../components/Header";
// footer
import Footer from "../components/Footer";
// 回到最上方
import BackTop from "../components/BackTop";
import Glow from "../components/Glow.jsx";

// 匯入套件
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ThreeCircles } from "react-loader-spinner";

// 內部資源
import logo from "../assets/images/logos/FOCUS-FITNESS-logo-3-long-big.png";

function Login() {
  const { Login, isAuth, Logout, loading } = useContext(LoginAuthContext);
  // 表單提交事件處理函式

  const handleLoginSubmit = (data) => {
    Login(data)
      .then((res) => {
        console.log("登入成功");
      })
      .catch((err) => {
        console.log(err);
        alert("登入失敗");
      });
  };

  // 表單
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    mode: "onTouched",
  });

  return (
    <>
      <Header />
      <main className="px-6 position-relative overflow-hidden login-bg-1">
        <section className="max-h-130 max-h-md-144 container"></section>
        {/* 光暈 */}
        <Glow position="top-right" />
        <Glow position="bottom-left" />
        {/* 登入 */}
        <div className="p-lg-5 px-sm-6 ">
          <div className="container text-center glass-navbar p-3 rounded-3 max-w-1296">
            <div className="row flex-lg-row flex-column ">
              {/*圖片*/}
              <div className="col-lg-6 ">
                <div className="h-100 d-flex justify-content-center align-items-end login-bg rounded-3 min-h-240 max-w-618">
                  {/*logo*/}
                  <div className="max-w-lg-182 max-w-114 mb-8">
                    <img src={logo} alt="logo" />
                  </div>
                </div>
              </div>
              {/*會員登入表單*/}
              <div className="col-lg-6 pt-lg-107 pb-lg-107 p-7">
                <div className="min-h-368">
                  {/*會員登入標題*/}
                  <div className="text-start mb-7">
                    <h2 className="fs-7 fw-bold mb-3 text-primary-400">
                      {!isAuth ? "/ Log in /" : "/ Log  out /"}
                    </h2>
                    <h2 className="fs-2 fw-bold lh-sm">
                      {!isAuth ? "會員登入" : "會員登出"}
                    </h2>
                  </div>

                  {/*表單*/}
                  <form onSubmit={handleSubmit(handleLoginSubmit)}>
                    {!isAuth ? (
                      <>
                        {/* 帳號 */}
                        <div className="mb-1 text-start min-h-95">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            帳號<span className="text-danger-normal">*</span>
                          </label>
                          <input
                            {...register("userLoginEmail", {
                              required: "電子郵件為必填",
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "請輸入正確的電子郵件格式",
                              },
                            })}
                            type="email"
                            className={`form-control ${errors.userLoginEmail && "is-invalid"}  input-placeholder`}
                            id="userLoginEmail"
                            aria-describedby="emailHelp"
                            placeholder="請輸入聯絡信箱，例如example@gmail.com"
                          />

                          {errors.userLoginEmail && (
                            <div className="invalid-feedback text-primary-400">
                              {errors?.userLoginEmail?.message}
                            </div>
                          )}
                        </div>
                        {/* 密碼 */}
                        <div className="mb-3 text-start min-h-95">
                          <label
                            htmlFor="exampleInputPassword1"
                            className="form-label"
                          >
                            密碼<span className="text-danger-normal">*</span>
                          </label>
                          <input
                            {...register("userLoginPassword", {
                              required: "密碼為必填",
                            })}
                            type="password"
                            className={`form-control ${errors.userLoginPassword && "is-invalid"} bg-transparent text-white input-placeholder input-password`}
                            id="userLoginPassword"
                            placeholder="請輸入密碼"
                          />

                          {errors.userLoginPassword && (
                            <div className="invalid-feedback text-primary-400">
                              {errors?.userLoginPassword?.message}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* 歡迎詞 */}
                        <div className="mb-4 glass-navbar border-radius-12 border  p-4">
                          <p className="fs-2 text-primary-400">
                            親愛的會員，您好。
                          </p>
                          <p className="fs-2 text-primary-400">
                            恭喜您，登入成功!
                          </p>
                        </div>
                      </>
                    )}

                    {/* 登入、登出按鈕 */}
                    {!isAuth ? (
                      <button
                        type="submit"
                        className="btn btn-primary-400 w-100 pt-3 pb-3 fs-7 fw-bold"
                        disabled={loading}
                      >
                        {/* 登入 */}
                        {loading ? (
                          <>
                            <div className="d-flex justify-content-center align-items-center">
                              <div>
                                <ThreeCircles
                                  visible={true}
                                  height={27}
                                  width={27}
                                  color="#171a29"
                                  ariaLabel="three-circles-loading"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          "登入"
                        )}
                      </button>
                    ) : (
                      <div className="d-flex gap-2">
                        {/* 登出 */}
                        <button
                          type="button"
                          className="btn btn-danger-dark text-white w-100 pt-3 pb-3 fs-7 fw-bold"
                          onClick={() => {
                            Logout();
                            reset();
                          }}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="d-flex justify-content-center align-items-center">
                                <div>
                                  <ThreeCircles
                                    visible={true}
                                    height={27}
                                    width={27}
                                    color="#171a29"
                                    ariaLabel="three-circles-loading"
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            "登出"
                          )}
                        </button>
                        {/* 立即購物 */}
                        <button
                          type="button"
                          className="btn btn-danger-dark text-white w-100 pt-3 pb-3 fs-7 fw-bold cancelButton text-black"
                          onClick={() => {}}
                          disabled={loading}
                        >
                          立即購物
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BackTop />
    </>
  );
}

export default Login;
