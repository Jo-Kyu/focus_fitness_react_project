// 匯入Hook
import { useEffect, useState, useContext } from "react";

// 匯入套件
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// 匯入元件
import Glow from "../components/Glow.jsx";
import CartEmpty from "../pages/CartEmpty.jsx";
import FavoriteEmpty from "./FavoriteEmpty.jsx";
import Loading from "../components/Loading.jsx";
import { ThreeCircles } from "react-loader-spinner";

// header
import Header from "../components/Header";
// footer
import Footer from "../components/Footer";
// 回到最上方
import BackTop from "../components/BackTop";
import { WishlistContext } from "../context/WishlistContext.js";
import FavoriteProductCards from "../components/FavoriteProductCards.jsx";

// 環境變數
const baseUrl = import.meta.env.VITE_BASE_URL;
const path = import.meta.env.VITE_API_PATH;

function FavoriteProducts() {
  // 儲存全部商品資料
  const [allProducts, setallProducts] = useState([]);
  // 全頁載入動畫
  const [isAllPageLoading, setAllPageLoading] = useState(true);

  // 收藏共用狀態解構
  const { wishlist } = useContext(WishlistContext);
  //   const isFavorite = wishlist[favoriteProducts.id];

  // 取得被收藏的商品id
  const favoriteIds = Object.keys(wishlist).filter((id) => wishlist[id]);
  //   console.log(favoriteIds);

  // 被收藏商品id比對全部商品資料id，篩選出被收藏的商品資料
  const favoriteProducts = allProducts.filter((product) =>
    favoriteIds.includes(product.id),
  );

  console.log(favoriteProducts);

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
      })
      .finally(() => {
        setAllPageLoading(false);
      });
  }

  // 呼叫取得購物車列表、呼叫取的所有商品
  useEffect(() => {
    getAllProducts();
  }, []);

  // JSX
  if (isAllPageLoading) {
    return <Loading />;
  }

  // JSX
  if (favoriteProducts?.length === 0) return <FavoriteEmpty />;

  // JSX
  return (
    <>
      <main className="px-6 position-relative overflow-hidden">
        <section className="max-h-130 max-h-md-144"></section>
        {/* 光暈 */}
        <Glow position="top-right" />
        <Glow position="bottom-left" />

        {/* 收藏清單 */}
        <section className="mb-5 px-6">
          <div className="mb-4 mb-sm-8 container px-0 max-w-1296 border border-secondary-600 border-radius-12">
            {/* 收藏清單商品標題 */}
            <div className="mb-3 py-6 py-sm-4  bg-blue-700 text-center border-radius-12 border-bottom-leftt-radius-0 border-bottom-right-radius-0">
              <h2 className="fs-7 text-gray-950 fw-bold">商品收藏清單</h2>
            </div>
            {/* 卡片列表 */}
            <div className="px-6">
              <div className="row">
                {favoriteProducts.map((favoriteProduct) => {
                  return (
                    <div className="col-lg-3 col-md-4 col-6  mb-6 rounded-3 ">
                      <FavoriteProductCards product={favoriteProduct} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 回到頂部按鈕 */}
        <div className="back-top">
          <a href="#top" className="d-block">
            <svg
              className="arrow-up"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="back-top-bg"
                d="M0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32Z"
                fill="white"
                fillOpacity="0.2"
              />
              <path
                className="back-top-arrow"
                d="M32 32C32.442 32 32.8658 32.1757 33.1783 32.4883L39.845 39.1549C40.4959 39.8058 40.4959 40.8608 39.845 41.5117C39.1941 42.1626 38.1391 42.1626 37.4882 41.5117L32 36.0234L26.5117 41.5117C25.8608 42.1626 24.8058 42.1626 24.1549 41.5117C23.504 40.8608 23.504 39.8058 24.1549 39.1549L30.8216 32.4883L30.9436 32.3776C31.2402 32.1345 31.6131 32 32 32ZM30.9485 22.3743C31.6031 21.8404 32.5681 21.8781 33.1783 22.4883L39.845 29.1549C40.4959 29.8058 40.4959 30.8608 39.845 31.5117C39.1941 32.1626 38.1391 32.1626 37.4882 31.5117L32 26.0234L26.5117 31.5117C25.8608 32.1626 24.8058 32.1626 24.1549 31.5117C23.504 30.8608 23.504 29.8058 24.1549 29.1549L30.8216 22.4883L30.9485 22.3743Z"
                fill="white"
              />
            </svg>
          </a>
        </div>
      </main>
      <BackTop />
    </>
  );
}

export default FavoriteProducts;
