// 匯入元件
import Ellipse_2 from "../assets/images/index_page/光暈/Ellipse_2.svg";
// header
import Header from "../components/Header";
// footer
import Footer from "../components/Footer";
// 回到最上方
import BackTop from "../components/BackTop";

function FavoriteEmpty() {
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
              <h2 className="fs-sm-1 fs-4 text-gray-950 fw-bold">
                您的收藏清單還是空的喔!
              </h2>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="300"
                  height="300"
                  fill="none"
                  stroke="#e1ff00"
                  viewBox="0 -2 16 20"
                  className="mx-auto"
                >
                  <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                </svg>
              </div>

              <h2 className="fs-sm-1 fs-4 text-gray-950 fw-bold mb-4">
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

export default FavoriteEmpty;
