// 匯入元件
import Ellipse_2 from "../assets/images/index_page/光暈/Ellipse_2.svg";
// header
import Header from "../components/Header";
// footer
import Footer from "../components/Footer";
// 回到最上方
import BackTop from "../components/BackTop";

function PageNotFound() {
  // JSX
  return (
    <>
      <Header />
      <main className="px-6 position-relative overflow-hidden min-vh-100 ">
        <section className="max-h-130 max-h-md-144"></section>
        {/* 光暈 */}
        <img
          style={{
            position: "absolute",
            top: "-600px",
            right: "-800px",
            zIndex: "-100",
          }}
          src={Ellipse_2}
          alt="光暈"
        />
        <img
          style={{
            position: "absolute",
            bottom: "-600px",
            left: "-800px",
            zIndex: "-100",
          }}
          src={Ellipse_2}
          alt="光暈"
        />

        <section className="mb-5 px-6">
          <div className="mb-4 mb-sm-8 container px-0 max-w-1296 border border-secondary-600 border-radius-12">
            {/* 空購物車 */}
            <div className="p-6 py-sm-4  bg-blue-700 text-center border-radius-12">
              <h2 className="fs-sm-1 fs-5 text-gray-950 fw-bold">
                網址錯誤 ! 我們沒有這個頁面 !
              </h2>
              <div>
                <h1 className="display-1 fw-bold text-primary-400">404</h1>
              </div>

              <h2 className="fs-sm-1 fs-5 text-gray-950 fw-bold mb-4">
                點擊下方按鈕，立即前往購物!
              </h2>
              <button className="mb-6 mb-md-0 me-md-6 py-2 py-md-3 fill-btn btn fs-7 fw-bold fill-btn flex-fill border-radius-12 w-50">
                立即購物
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackTop />
    </>
  );
}

export default PageNotFound;
