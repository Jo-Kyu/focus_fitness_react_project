// React Hooks
import { useEffect,useState,useMemo,useRef,useCallback,useContext,} from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";

// 收藏共用狀態
import { WishlistContext } from "../context/WishlistContext.js";
// 登入共用狀態
import { LoginAuthContext } from "../context/LoginAuthContext.js";
// 吐司
import toast from "react-hot-toast";
// 提示框
import Swal from "sweetalert2";
// 載入
import Loading from "../components/Loading.jsx";

// 元件
import BackTop from "../components/BackTop.jsx";
import ProductListGlow from "../components/ProductListGlow";

// 第三方套件
import axios from "axios";
import * as bootstrap from "bootstrap";

// 定義按鈕顯示資料
import sortLabels from "../data/sortLabels.js";

const baseUrl = import.meta.env.VITE_BASE_URL;
const path = import.meta.env.VITE_API_PATH;
const ITEMS_PER_PAGE = 12;

// 分類配置
// 使用英文 key，通過映射至中文 category 值

const CATEGORIES_CONFIG = {
  equipment: {
    // 內部標示
    displayName: "健身裝備", // 顯示名稱
    categoryValue: "裝備", // 對應大類別 category
    subCategories: [
      { id: "重量訓練", name: "重量訓練專區" },
      { id: "瑜伽伸展", name: "瑜伽伸展專區" },
      { id: "核心訓練", name: "核心訓練專區" },
      { id: "有氧訓練", name: "有氧訓練專區" },
      { id: "按摩放鬆", name: "按摩放鬆專區" },
      { id: "輔助訓練", name: "輔助訓練專區" },
    ],
  },
  course: {
    displayName: "健身課程",
    categoryValue: "課程",
    subCategories: [
      { id: "重量訓練", name: "重量訓練" },
      { id: "瑜珈", name: "瑜珈" },
      { id: "有氧", name: "有氧" },
      { id: "筋膜放鬆", name: "筋膜放鬆" },
      { id: "知識講座", name: "知識講座" },
    ],
  },
  membership: {
    displayName: "入場方案",
    categoryValue: "課程",
    subCategories: [
      { id: "單次入場", name: "單次入場" },
      { id: "單月入場", name: "單月入場" },
    ],
  },
};

function ProductList() {
  // 定義遠端取得的商品狀態
  const [allProducts, setAllProducts] = useState([]);
  // 定義商品列表狀態
  const [productList, setProductList] = useState([]);
  // 定義當前選擇的大分類（使用英文 key）
  const [selectedMainCategory, setSelectedMainCategory] = useState("equipment");
  // 定義當前選擇的小分類
  const [selectedSubCategory, setSelectedSubCategory] = useState("重量訓練");
  // 定義排序狀態
  const [sortType, setSortType] = useState("price_high");
  // 定義手機版offcanvas臨時排序狀態
  const [tempSortType, setTempSortType] = useState("");
  // 定義當前頁
  const [currentPage, setCurrentPage] = useState(1);
  // 定義總頁數
  const [totalPages, setTotalPages] = useState(0);
  // 加載狀態
  const [isLoading, setIsLoading] = useState(false);
  // 導向取值
  const location = useLocation();
  // 判斷頁面載入
  const [isAllPageLoading, setAllPageLoading] = useState(true);

  // 定義手機offcanvas
  const offcanvasRef = useRef(null);
  const offcanvasInstance = useRef(null);

  // 收藏共用狀態解構
  const { wishlist, toggleWishlistItem } = useContext(WishlistContext);
  // const isFavorite = wishlist[product.id];
  // 登入共用狀態解構
  const { isAuth } = useContext(LoginAuthContext);

  // 導向至登入頁
  const navigate = useNavigate();

  // ============ 取得所有遠端商品 ============

  useEffect(() => {
    const getProductList = async () => {
      try {
        const res = await axios.get(`${baseUrl}/v2/api/${path}/products/all`);
        // 取得所有商品
        const products = res.data.products;
        setAllProducts(products);
        // 初始化排序方式
        setSortType("price_high");
        setCurrentPage(1);
      } catch (error) {
        console.error("error:", error.response);
      } finally {
        setIsLoading(false);
        setAllPageLoading(false);
      }
    };
    getProductList();
  }, []);

  // ============ offcanvas實體創建 ============

  useEffect(() => {
    const element = offcanvasRef.current;

    if (element && !offcanvasInstance.current) {
      try {
        offcanvasInstance.current = new bootstrap.Offcanvas(
          offcanvasRef.current,
        );
      } catch (error) {
        console.error("創建失敗", error);
      }
    }

    return () => {
      if (offcanvasInstance.current) {
        try {
          offcanvasInstance.current.dispose();
          offcanvasInstance.current = null;
        } catch (error) {
          console.error("清除失敗", error);
        }
      }
    };
  }, []);

  // ============ 根據大分類 + 小分類篩選商品 ============

  const getProductsByCategory = useCallback(
    (products, mainCategory, subCategory) => {
      // 如果是「所有商品」，返回全部
      if (mainCategory === "all") {
        return products;
      }

      // 從配置中取得對應的中文 categoryValue
      const config = CATEGORIES_CONFIG[mainCategory];
      if (!config) return products;

      return products.filter((product) => {
        // product.category 遠端商品的中文「裝備」
        // config.categoryValue 分類配置的中文「裝備」
        return (
          product.category === config.categoryValue &&
          product.category_one === subCategory
        );
      });
    },
    [],
  );

  // ============ 分頁函式 ============

  const displayPage = useCallback((products, pageNum) => {
    const pageIndex = pageNum - 1;
    const start = pageIndex * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageProducts = products.slice(start, end);
    setProductList(pageProducts);
  }, []);

  // ============ 排序邏輯 ============

  const applySorting = useCallback((products, sort) => {
    let sorted = [...products];

    switch (sort) {
      case "hot":
        sorted = sorted.filter((p) => p.is_hot === true);
        break;

      case "new":
        sorted = sorted.filter((p) => p.is_new === true);
        break;

      case "price_low":
        sorted.sort((a, b) => a.price - b.price);
        break;

      case "price_high":
        sorted.sort((a, b) => b.price - a.price);
        break;

      default:
        break;
    }

    return sorted;
  }, []);

  // ============ 當大分類、小分類、排序、分頁改變時，更新顯示 ============

  useEffect(() => {
    if (allProducts.length === 0) return;

    // 1. 根據大分類和小分類篩選
    const categoryFiltered = getProductsByCategory(
      allProducts,
      selectedMainCategory,
      selectedSubCategory,
    );

    // 2. 應用排序
    const sorted = applySorting(categoryFiltered, sortType);

    // 3. 計算總頁數
    const pages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
    setTotalPages(pages);

    // 4. 顯示當前頁
    displayPage(sorted, currentPage);
  }, [
    selectedMainCategory,
    selectedSubCategory,
    sortType,
    currentPage,
    allProducts,
    getProductsByCategory,
    applySorting,
    displayPage,
  ]);

  // ============ 計算篩選後的商品陣列 ============

  const filteredProducts = useMemo(() => {
    if (allProducts.length === 0) return [];

    const categoryFiltered = getProductsByCategory(
      allProducts,
      selectedMainCategory,
      selectedSubCategory,
    );
    return applySorting(categoryFiltered, sortType);
  }, [
    allProducts,
    selectedMainCategory,
    selectedSubCategory,
    sortType,
    getProductsByCategory,
    applySorting,
  ]);

  // ============ 動態計算顯示的商品數量 ============

  const displayedProductCount = useMemo(() => {
    if (sortType === "hot" || sortType === "new") {
      // hot 或 new，使用篩選結果的長度
      return filteredProducts.length;
      // price_low 或 price_high，使用全部商品長度
    } else {
      return getProductsByCategory(
        allProducts,
        selectedMainCategory,
        selectedSubCategory,
      ).length;
    }
  }, [
    sortType,
    filteredProducts,
    allProducts,
    selectedMainCategory,
    selectedSubCategory,
    getProductsByCategory,
  ]);

  // ============ 排序按鈕點擊事件 ============

  const handleSortClick = useCallback((sort) => {
    setSortType(sort);
    setCurrentPage(1);
  }, []);

  // ============ 手機版radio暫時狀態 ============

  const handleRadioChange = useCallback((sort) => {
    setTempSortType(sort);
  }, []);

  // ============ 手機版套用按鈕 ============

  const handleApply = useCallback(() => {
    setSortType(tempSortType);
    setCurrentPage(1);

    if (offcanvasInstance.current) {
      offcanvasInstance.current.hide();
    }
  }, [tempSortType]);

  // ============ Pagination 點擊事件 ============

  const handlePageClick = useCallback(
    (pageNum) => {
      if (pageNum >= 1 && pageNum <= totalPages) {
        setCurrentPage(pageNum);
      }
    },
    [totalPages],
  );

  // ============ 取得當前大分類的配置 ============

  const currentMainCategoryConfig =
    selectedMainCategory === "all"
      ? null
      : CATEGORIES_CONFIG[selectedMainCategory];

  // ============ 取得當前小分類的顯示名稱 ============

  const getCurrentSubCategoryName = () => {
    if (selectedMainCategory === "all") {
      return "所有商品";
    }

    if (!currentMainCategoryConfig) return selectedMainCategory;

    const subCat = currentMainCategoryConfig.subCategories.find(
      (cat) => cat.id === selectedSubCategory,
    );
    return subCat ? subCat.name : selectedSubCategory;
  };

  // ============ 導至本頁的預設展開 ============

  useEffect(() => {
    const { openCategory } = location.state || {};
    if (!openCategory) return;

    if (openCategory === "all") {
      // 設定為「所有商品」的預設狀態
      setSelectedMainCategory("all"); // ← 依你的 state 初始值調整
      setSelectedSubCategory("all"); // ← 依你的 state 初始值調整
    } else {
      setSelectedMainCategory(openCategory);
      const firstSub = CATEGORIES_CONFIG[openCategory]?.subCategories[0];
      if (firstSub) setSelectedSubCategory(firstSub.id);
    }

    setCurrentPage(1);
    setSortType("price_high");
  }, [location.state]);

  // ============ 顯示載入中 ============

  if (isLoading) {
    return <div className="text-center py-5">載入中...</div>;
  }

  // JSX
  if (isAllPageLoading) {
    return <Loading />;
  }

  return (
    <>
      <main className="px-6 position-relative" style={{ overflow: "hidden" }}>
        {/* header前的留白區 */}
        <section className="max-h-130 max-h-md-144"></section>

        {/* 光暈 */}
        <ProductListGlow></ProductListGlow>

        {/* 分頁 */}
        <section className="p-0 mb-0 mb-md-7 container max-w-1296">
          {/* 手機版上方選單 */}
          <ul className="nav nav-pills d-md-none phone_nav">
            <li className="nav-item me-6 nav-item_new">
              <a
                className="nav-link ruby-text active"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedMainCategory("all");
                  setSelectedSubCategory("all");
                  setCurrentPage(1);
                  setSortType("price_high");
                }}
              >
                所有商品
              </a>
            </li>
            <li className="nav-item dropdown me-6  nav-item_new">
              <a
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-expanded="false"
              >
                健身裝備
              </a>
              <ul className="dropdown-menu bg-primary-950 shodow_none">
                {CATEGORIES_CONFIG.equipment.subCategories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedMainCategory("equipment");
                        setSelectedSubCategory(cat.id);
                        setCurrentPage(1);
                      }}
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item dropdown me-6 nav-item_new">
              <a
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-expanded="false"
              >
                健身課程
              </a>
              <ul className="dropdown-menu bg-primary-950 shodow_none">
                {CATEGORIES_CONFIG.course.subCategories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedMainCategory("course");
                        setSelectedSubCategory(cat.id);
                        setCurrentPage(1);
                      }}
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          {/* 網站導行列 */}
          <nav
            style={{ "--bs-breadcrumb-divider": "/" }}
            aria-label="breadcrumb"
          >
            <ol className="breadcrumb mb-2 fs-9 fs-md-6">
              <li className="breadcrumb-item pe-2 pe-md-6">
                <Link className="text-gray-200 fw-bold" to="/">
                  首頁
                </Link>
              </li>
              {/* 電腦版顯示箭頭符號 */}
              <li className="d-none d-md-block">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.91009 3.57757C7.23553 3.25214 7.76304 3.25214 8.08848 3.57757L13.9218 9.41091C14.2473 9.73634 14.2473 10.2639 13.9218 10.5893L8.08848 16.4226C7.76304 16.7481 7.23553 16.7481 6.91009 16.4226C6.58466 16.0972 6.58466 15.5697 6.91009 15.2442L12.1542 10.0001L6.91009 4.75596C6.58466 4.43052 6.58466 3.90301 6.91009 3.57757Z"
                    fill="white"
                  />
                </svg>
              </li>
              {/* 手機版顯示箭頭符號 */}
              <li className="d-md-none">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.91009 3.57757C7.23553 3.25214 7.76304 3.25214 8.08848 3.57757L13.9218 9.41091C14.2473 9.73634 14.2473 10.2639 13.9218 10.5893L8.08848 16.4226C7.76304 16.7481 7.23553 16.7481 6.91009 16.4226C6.58466 16.0972 6.58466 15.5697 6.91009 15.2442L12.1542 10.0001L6.91009 4.75596C6.58466 4.43052 6.58466 3.90301 6.91009 3.57757Z"
                    fill="white"
                  />
                </svg>
              </li>
              <li className="breadcrumb-item px-2 px-md-6">
                <Link className="text-gray-200 fw-bold" to="/product-list">
                  商城
                </Link>
              </li>
              {/* 電腦版顯示箭頭符號 */}
              <li className="d-none d-md-block">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.91009 3.57757C7.23553 3.25214 7.76304 3.25214 8.08848 3.57757L13.9218 9.41091C14.2473 9.73634 14.2473 10.2639 13.9218 10.5893L8.08848 16.4226C7.76304 16.7481 7.23553 16.7481 6.91009 16.4226C6.58466 16.0972 6.58466 15.5697 6.91009 15.2442L12.1542 10.0001L6.91009 4.75596C6.58466 4.43052 6.58466 3.90301 6.91009 3.57757Z"
                    fill="white"
                  />
                </svg>
              </li>
              {/* 手機版顯示箭頭符號 */}
              <li className="d-md-none">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.91009 3.57757C7.23553 3.25214 7.76304 3.25214 8.08848 3.57757L13.9218 9.41091C14.2473 9.73634 14.2473 10.2639 13.9218 10.5893L8.08848 16.4226C7.76304 16.7481 7.23553 16.7481 6.91009 16.4226C6.58466 16.0972 6.58466 15.5697 6.91009 15.2442L12.1542 10.0001L6.91009 4.75596C6.58466 4.43052 6.58466 3.90301 6.91009 3.57757Z"
                    fill="white"
                  />
                </svg>
              </li>
              <li
                className="breadcrumb-item active ps-2 ps-md-6 text-primary-400 fw-bold"
                aria-current="page"
              >
                {getCurrentSubCategoryName()}
              </li>
            </ol>
          </nav>
        </section>

        {/* 商品詳情 */}
        <section className="p-0 mb-8 mb-md-11 container max-w-1296">
          {/* 格線系統 */}
          <div className="row flex-column flex-lg-row px-6">
            {/* 左邊 電腦版選單 */}
            <div className="col-12 col-lg-3 p-0 d-none d-md-block">
              <div
                className="nav flex-column nav-pills me-3"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
              >
                <div className="accordion" id="accordionExample">
                  {/* 所有商品 */}
                  <div className="accordion-item border-radius-12 mb-7">
                    <button
                      className={`nav-link px-6 py-3 fs-7 ${selectedMainCategory === "all" ? "active" : ""}`}
                      onClick={() => {
                        setSelectedMainCategory("all");
                        setSelectedSubCategory("all");
                        setCurrentPage(1);
                        setSortType("price_high");
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        color:
                          selectedMainCategory === "all" ? "#e1ff00" : "white",
                      }}
                      type="button"
                    >
                      所有商品
                    </button>
                  </div>

                  {/* 大分類：健身裝備 */}
                  <div className="accordion-item px-6 border-radius-12 mb-7">
                    <h2 className="accordion-header" id="headingEquipment">
                      <button
                        className="accordion-button px-0 py-3 fs-7"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseEquipment"
                        aria-expanded={
                          selectedMainCategory === "equipment"
                            ? "true"
                            : "false"
                        }
                        aria-controls="collapseEquipment"
                        onClick={() => {
                          setSelectedMainCategory("equipment");
                          const firstSub =
                            CATEGORIES_CONFIG.equipment.subCategories[0];
                          setSelectedSubCategory(firstSub.id);
                          setCurrentPage(1);
                          setSortType("price_high");
                        }}
                      >
                        健身裝備
                      </button>
                    </h2>
                    {/* 小分類：健身裝備 */}
                    <div
                      id="collapseEquipment"
                      className={`accordion-collapse collapse ${selectedMainCategory === "equipment" ? "show" : ""}`}
                      aria-labelledby="headingEquipment"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body px-0 pb-1">
                        {CATEGORIES_CONFIG.equipment.subCategories.map(
                          (cat) => (
                            <button
                              key={cat.id}
                              className={`nav-link mb-3 ${selectedSubCategory === cat.id && selectedMainCategory === "equipment" ? "active" : ""}`}
                              onClick={() => {
                                setSelectedMainCategory("equipment");
                                setSelectedSubCategory(cat.id);
                                setCurrentPage(1);
                                setSortType("price_high");
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                color:
                                  selectedSubCategory === cat.id &&
                                  selectedMainCategory === "equipment"
                                    ? "#e1ff00"
                                    : "white",
                              }}
                              type="button"
                            >
                              {cat.name}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 大分類：健身課程 */}
                  <div className="accordion-item px-6 border-radius-12 mb-7">
                    <h2 className="accordion-header" id="headingCourse">
                      <button
                        className="accordion-button px-0 py-3 fs-7"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseCourse"
                        aria-expanded={
                          selectedMainCategory === "course" ? "true" : "false"
                        }
                        aria-controls="collapseCourse"
                        onClick={() => {
                          setSelectedMainCategory("course");
                          const firstSub =
                            CATEGORIES_CONFIG.course.subCategories[0];
                          setSelectedSubCategory(firstSub.id);
                          setCurrentPage(1);
                          setSortType("price_high");
                        }}
                      >
                        健身課程
                      </button>
                    </h2>
                    {/* 小分類：健身課程 */}
                    <div
                      id="collapseCourse"
                      className={`accordion-collapse collapse ${selectedMainCategory === "course" ? "show" : ""}`}
                      aria-labelledby="headingCourse"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body px-0 pb-1">
                        {CATEGORIES_CONFIG.course.subCategories.map((cat) => (
                          <button
                            key={cat.id}
                            className={`nav-link mb-3 ${selectedSubCategory === cat.id && selectedMainCategory === "course" ? "active" : ""}`}
                            onClick={() => {
                              setSelectedMainCategory("course");
                              setSelectedSubCategory(cat.id);
                              setCurrentPage(1);
                              setSortType("price_high");
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              color:
                                selectedSubCategory === cat.id &&
                                selectedMainCategory === "course"
                                  ? "#e1ff00"
                                  : "white",
                            }}
                            type="button"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 大分類：入場方案 */}
                  <div className="accordion-item px-6 border-radius-12 mb-7">
                    <h2 className="accordion-header" id="headingMembership">
                      <button
                        className="accordion-button px-0 py-3 fs-7"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseMembership"
                        aria-expanded={
                          selectedMainCategory === "membership"
                            ? "true"
                            : "false"
                        }
                        aria-controls="collapseMembership"
                        onClick={() => {
                          setSelectedMainCategory("membership");
                          const firstSub =
                            CATEGORIES_CONFIG.membership.subCategories[0];
                          setSelectedSubCategory(firstSub.id);
                          setCurrentPage(1);
                          setSortType("price_high");
                        }}
                      >
                        入場方案
                      </button>
                    </h2>
                    {/* 小分類：入場方案 */}
                    <div
                      id="collapseMembership"
                      className={`accordion-collapse collapse ${selectedMainCategory === "membership" ? "show" : ""}`}
                      aria-labelledby="headingMembership"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body px-0 pb-1">
                        {CATEGORIES_CONFIG.membership.subCategories.map(
                          (cat) => (
                            <button
                              key={cat.id}
                              className={`nav-link mb-3 ${selectedSubCategory === cat.id && selectedMainCategory === "membership" ? "active" : ""}`}
                              onClick={() => {
                                setSelectedMainCategory("membership");
                                setSelectedSubCategory(cat.id);
                                setCurrentPage(1);
                                setSortType("price_high");
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                color:
                                  selectedSubCategory === cat.id &&
                                  selectedMainCategory === "membership"
                                    ? "#e1ff00"
                                    : "white",
                              }}
                              type="button"
                            >
                              {cat.name}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 右邊商品列表 */}
            <div className="col-12 col-lg-9 plr-10">
              <div className="tab-content" id="v-pills-tabContent">
                {/* 商品顯示區塊 */}
                <div
                  className="tab-pane fade show active"
                  id="v-pills-home"
                  role="tabpanel"
                  aria-labelledby="v-pills-home-tab"
                >
                  {/* 電腦版＆手機版 產品數量+排列選單 */}
                  <div className="row justify-content-between align-items-center mb-2 mb-md-7">
                    <div className="col-6">
                      <p className="fw-bold text-gray-950 fs-mg-8 fs-9">
                        共有
                        <span className="fs-8 fs-md-7 mx-2">
                          {displayedProductCount}
                        </span>
                        樣商品
                      </p>
                    </div>

                    <div className="col-5 d-flex justify-content-end">
                      <div className="dropdown d-none d-md-block">
                        <button
                          className="btn dropdown-toggle w-200 fs-8 d-flex justify-content-between align-items-center text-white"
                          style={{ border: "0px" }}
                          type="button"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {sortLabels[sortType] || ""}
                        </button>
                        <ul
                          className="dropdown-menu w-100 p-2 mt-1"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <li>
                            <button
                              className="dropdown-item fs-8"
                              onClick={() => handleSortClick("hot")}
                              type="button"
                            >
                              熱銷排行
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item fs-8"
                              onClick={() => handleSortClick("new")}
                              type="button"
                            >
                              最新上市
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item fs-8"
                              onClick={() => handleSortClick("price_high")}
                              type="button"
                            >
                              價格高至低
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item fs-8"
                              onClick={() => handleSortClick("price_low")}
                              type="button"
                            >
                              價格低至高
                            </button>
                          </li>
                        </ul>
                      </div>
                      {/* 手機版排序按鈕 */}
                      <button
                        className="btn text-white d-flex justify-content-between align-items-center fs-9 bg-white-opacity-20 px-4 py-2 d-md-none"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasBottom"
                        aria-controls="offcanvasBottom"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="filter_svg"
                        >
                          <path
                            d="M8.25 13.25C8.7 13.25 9 13.55 9 14C9 14.45 8.7 14.75 8.25 14.75H6.75V19.25C6.75 19.7 6.45 20 6 20C5.55 20 5.25 19.7 5.25 19.25V14.75H3.75C3.3 14.75 3 14.45 3 14C3 13.55 3.3 13.25 3.75 13.25H8.25ZM12 11.75C12.45 11.75 12.75 12.05 12.75 12.5V19.25C12.75 19.7 12.45 20 12 20C11.55 20 11.25 19.7 11.25 19.25V12.5C11.25 12.05 11.55 11.75 12 11.75ZM20.25 14.75C20.7 14.75 21 15.05 21 15.5C21 15.95 20.7 16.25 20.25 16.25H18.75V19.25C18.75 19.7 18.45 20 18 20C17.55 20 17.25 19.7 17.25 19.25V16.25H15.75C15.3 16.25 15 15.95 15 15.5C15 15.05 15.3 14.75 15.75 14.75H20.25ZM18 5C18.45 5 18.75 5.3 18.75 5.75V12.5C18.75 12.95 18.45 13.25 18 13.25C17.55 13.25 17.25 12.95 17.25 12.5V5.75C17.25 5.3 17.55 5 18 5ZM6 5C6.45 5 6.75 5.3 6.75 5.75V11C6.75 11.45 6.45 11.75 6 11.75C5.55 11.75 5.25 11.45 5.25 11V5.75C5.25 5.3 5.55 5 6 5ZM12 5C12.45 5 12.75 5.3 12.75 5.75V8.75H14.25C14.7 8.75 15 9.05 15 9.5C15 9.95 14.7 10.25 14.25 10.25H9.75C9.3 10.25 9 9.95 9 9.5C9 9.05 9.3 8.75 9.75 8.75H11.25V5.75C11.25 5.3 11.55 5 12 5Z"
                            fill="white"
                            stroke="white"
                            strokeWidth="0.5"
                          />
                        </svg>
                        <p className="ms-2">排序</p>
                      </button>
                      {/* 手機版下方側邊欄 */}
                      <div
                        ref={offcanvasRef}
                        className="offcanvas offcanvas-bottom offcanvas_new bg-blue-900"
                        tabIndex="-1"
                        id="offcanvasBottom"
                        aria-labelledby="offcanvasBottomLabel"
                      >
                        <div className="offcanvas-header">
                          <h5
                            className="offcanvas-title text-white fs-7"
                            id="offcanvasBottomLabel"
                          >
                            排序依據
                          </h5>
                        </div>
                        <div className="offcanvas-body small">
                          <div className="form-check text-white mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="sortRadio"
                              id="flexRadioDefault1"
                              checked={tempSortType === "hot"}
                              onChange={() => handleRadioChange("hot")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault1"
                            >
                              熱銷排行
                            </label>
                          </div>
                          <div className="form-check text-white mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="sortRadio"
                              id="flexRadioDefault2"
                              checked={tempSortType === "new"}
                              onChange={() => handleRadioChange("new")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault2"
                            >
                              最新上市
                            </label>
                          </div>
                          <div className="form-check text-white mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="sortRadio"
                              id="flexRadioDefault4"
                              checked={tempSortType === "price_high"}
                              onChange={() => handleRadioChange("price_high")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault4"
                            >
                              價格高至低
                            </label>
                          </div>
                          <div className="form-check text-white mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="sortRadio"
                              id="flexRadioDefault5"
                              checked={tempSortType === "price_low"}
                              onChange={() => handleRadioChange("price_low")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault5"
                            >
                              價格低至高
                            </label>
                          </div>
                          {/* 重設、套用按鈕 */}
                          <div className="d-flex justify-content-center align-items-center mt-6">
                            <button
                              className="py-2 btn fs-6 fw-bold fill-btn border-radius-12 col-12"
                              onClick={handleApply}
                            >
                              套用
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 商品列表 */}
                  <div className="row mlr--10 mb-4">
                    {/* 商品 */}
                    {productList.length > 0
                      ? productList.map((product) => {
                          const isFavorite = wishlist[product.id];
                          return (
                            <div
                              className="col-6 col-sm-4 plr-10 mb-6 mb-md-7"
                              key={product.id}
                            >
                              <div className="card rounded-3 bg-blue-600 flex-grow-0 flex-shrink-0 hover-effect-3 overflow-hidden">
                                <NavLink
                                  className="rounded-3 position-relative"
                                  to={`/product-detail/${product.id}`}
                                >
                                  <div>
                                    {/* 商品圖 */}
                                    <div>
                                      <img
                                        className="card-img-top cardlist-img-h"
                                        src={product.imageUrl}
                                        alt={product.title}
                                      />
                                    </div>
                                    <div className="d-flex justify-content-between position-absolute top-0 w-100">
                                      {/* 優惠標籤 */}
                                      <div className="pt-6 ps-6">
                                        <span className="badge py-1 px-6 bg-danger-normal fs-8 text-white fw-bold">
                                          {product.is_hot ? "熱銷" : ""}
                                        </span>
                                        <span className="badge py-1 px-6 bg-primary-400 fs-8 text-blue-900 fw-bold">
                                          {product.is_new ? "最新上市" : ""}
                                        </span>
                                      </div>
                                      {/* 收藏符號 */}
                                      <button
                                        type="button"
                                        className="p-2 color-primary-400 bg-gray-900-20 blur-30 rounded-2 border-top-left-radius-0 border-bottom-right-radius-0 ms-auto z-100 border-0"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          // 判斷登入狀態
                                          if (!isAuth) {
                                            Swal.fire({
                                              title: "您尚未登入帳號",
                                              text: "登入帳號後，才可使用收藏功能！",
                                              iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#e1ff00" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
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
                                            return;
                                          }
                                          toggleWishlistItem(product.id);
                                          if (!isFavorite) {
                                            toast.success("已加入收藏", {
                                              className: "handleAddToCartToast",
                                              icon: (
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="36"
                                                  height="37"
                                                  fill="#e1ff00"
                                                  stroke="#e1ff00"
                                                  viewBox="0 0 16 20"
                                                >
                                                  <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                                                </svg>
                                              ),
                                            });
                                          } else {
                                            toast.error("已取消收藏", {
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
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="30"
                                          height="31"
                                          fill={isFavorite ? "#e1ff00" : "none"}
                                          stroke="#e1ff00"
                                          className="bi bi-bookmark-fill"
                                          viewBox="0 0 16 20"
                                        >
                                          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  {/* 商品標題、價格、折扣標籤 */}
                                  <div className="card-body py-md-6 px-2 py-6">
                                    {/* 商品標題 */}
                                    <div className="mb-2">
                                      <h5 className="card-title mb-0 fs-8 fs-md-6 text-gray-950 fw-bold">
                                        {product.title}
                                      </h5>
                                    </div>
                                    {/* 價格 */}
                                    <div className="d-flex">
                                      {/* 售價、原價 */}
                                      <div>
                                        <p className="card-text fs-8 fs-md-6 text-gray-950 fw-bold">
                                          <span className="me-1">
                                            {`$${product.price}`}
                                          </span>
                                          <span className="fs-8 text-gray-500 fw-bold text-decoration-line-through">
                                            {`$${product.origin_price}`}
                                          </span>
                                        </p>
                                      </div>
                                      {/* 折扣標籤 */}
                                      <span className="badge fs-9 fs-md-8 text-warning-normal fw-bold border rounded-3 border-warning-normal ms-auto">
                                        {!Number.isNaN(
                                          Math.round(
                                            (product.price /
                                              product.origin_price) *
                                              100,
                                          ),
                                        ) &&
                                          `${Math.round((product.price / product.origin_price) * 100)}折`}
                                      </span>
                                    </div>
                                  </div>
                                </NavLink>
                              </div>
                            </div>
                          );
                        })
                      : ""
                        // <div className="col-12 text-center py-5">
                        //   <p className="fs-5 fs-md-1 text-white">
                        //     沒有符合條件的商品
                        //   </p>
                        // </div>
                    }
                  </div>

                  {/* 換頁Pagination - 有商品時顯示 */}
                  {productList.length > 0 && (
                    <div className="row">
                      <div className="col-12 d-flex justify-content-center">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination d-flex align-items-center">
                            <li
                              className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                            >
                              <button
                                className="page-link"
                                type="button"
                                aria-label="Previous"
                                onClick={() => handlePageClick(currentPage - 1)}
                                disabled={currentPage === 1}
                              >
                                <span aria-hidden="true">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ transform: "rotate(180deg)" }}
                                  >
                                    <path
                                      d="M6.91009 3.57757C7.23553 3.25214 7.76304 3.25214 8.08848 3.57757L13.9218 9.41091C14.2473 9.73634 14.2473 10.2639 13.9218 10.5893L8.08848 16.4226C7.76304 16.7481 7.23553 16.7481 6.91009 16.4226C6.58466 16.0972 6.58466 15.5697 6.91009 15.2442L12.1542 10.0001L6.91009 4.75596C6.58466 4.43052 6.58466 3.90301 6.91009 3.57757Z"
                                      fill="white"
                                    />
                                  </svg>
                                </span>
                              </button>
                            </li>
                            {/* 頁碼 */}
                            {Array.from({ length: totalPages }, (_, i) => (
                              <li
                                key={i + 1}
                                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => handlePageClick(i + 1)}
                                  type="button"
                                >
                                  {i + 1}
                                </button>
                              </li>
                            ))}
                            <li
                              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                            >
                              <button
                                className="page-link"
                                type="button"
                                aria-label="Next"
                                onClick={() => handlePageClick(currentPage + 1)}
                                disabled={currentPage === totalPages}
                              >
                                <span aria-hidden="true">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M6.91009 3.57757C7.23553 3.25214 7.76304 3.25214 8.08848 3.57757L13.9218 9.41091C14.2473 9.73634 14.2473 10.2639 13.9218 10.5893L8.08848 16.4226C7.76304 16.7481 7.23553 16.7481 6.91009 16.4226C6.58466 16.0972 6.58466 15.5697 6.91009 15.2442L12.1542 10.0001L6.91009 4.75596C6.58466 4.43052 6.58466 3.90301 6.91009 3.57757Z"
                                      fill="white"
                                    />
                                  </svg>
                                </span>
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 回到頂部按鈕 */}
      <BackTop></BackTop>
    </>
  );
}

export default ProductList;
