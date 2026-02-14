// React Hooks
import { useEffect, useState, useMemo, useRef } from "react";

// 元件
import BackTop from "../components/BackTop.jsx";
import ProductListGlow from "../components/ProductListGlow";

// 第三方套件
import axios from "axios";
import * as bootstrap from 'bootstrap';

const baseUrl = import.meta.env.VITE_BASE_URL;
const path = import.meta.env.VITE_API_PATH;
const ITEMS_PER_PAGE = 12;


function ProductList(){
    // 定義遠端取得的商品狀態
    const [allProducts, setAllProducts] = useState([]);
    // 定義商品列表狀態
    const [productList, setProductList] = useState([]);
    // 定義排序狀態
    const [sortType, setSortType] = useState("");
    // 定義手機版offcanvas臨時排序狀態
    const [tempSortType, setTempSortType] = useState("");
    // 定義當前頁
    const [currentPage, setCurrentPage] = useState(1);
    // 定義總頁數
    const [totalPages, setTotalPages] = useState(0);
    // 加載狀態
    const [isLoading, setIsLoading] = useState(false);

     // 定義手機offcanvas
    const offcanvasRef = useRef(null); 
    const offcanvasInstance = useRef(null);  

    // 定義按鈕顯示
    const sortLabels = {
            hot: "熱銷排行",
            new: "最新上市",
            price_low: "價格低至高",
            price_high: "價格高至低"
        };


    // 第一步：取得所有遠端商品

    useEffect(()=>{
        const getProductList=async()=>{
            try{
                const res=await axios.get(`${baseUrl}/v2/api/${path}/products/all`);
                // 取得所有商品
                const products=res.data.products;
                setAllProducts(products);
                // 商品排序初始
                applySort(products, "price_high");
            }catch(error){
                console.log("error:",error.response);
            }finally{
                setIsLoading(false);
            }
        };
        getProductList();
    },[]);

    // offcanvas實體創建

    useEffect(() => {
        const element = offcanvasRef.current;
        
        if (element && !offcanvasInstance.current) {
            try {
                offcanvasInstance.current = new bootstrap.Offcanvas(offcanvasRef.current);
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

    // 第二步：排序函式

    const applySort = (products, sort) => {
                let processedProducts = [...products];
        
                switch (sort) {
                    case "hot":
                        // 熱銷排行：保留 is_hot
                        processedProducts = processedProducts.filter((p) => p.is_hot === true);
                        break;
        
                    case "new":
                        // 最新上市：保留 is_new
                        processedProducts = processedProducts.filter((p) => p.is_new === true);
                        break;
        
                    case "price_low":
                        // 價格低至高
                        processedProducts.sort((a, b) => a.price - b.price);
                        break;
        
                    case "price_high":
                        // 價格高至低
                        processedProducts.sort((a, b) => b.price - a.price);
                        break;
        
                        // 預設排序
                    default:
                        break;
                }
        
                // 計算總頁數
                const pages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
                setTotalPages(pages);
                // 重置到第1頁
                setCurrentPage(1);
                // 更新排序類型
                setSortType(sort);
                // 顯示第1頁的商品
                displayPage(processedProducts, 1);
            };

    // 第三步：分頁函式

    const displayPage = (products, pageNum) => {
    const pageIndex = pageNum - 1;
    const start = pageIndex * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageProducts = products.slice(start, end);
    setProductList(pageProducts); 
    };

    // 第四步：當頁碼改變時，顯示對應頁的商品

    useEffect(() => {
        if (allProducts.length === 0) return;

        // 根據目前的排序類型重新排序
        let processedProducts = [...allProducts];

        switch (sortType) {
            case "hot":
                processedProducts = processedProducts.filter((p) => p.is_hot === true);
                break;

            case "new":
                processedProducts = processedProducts.filter((p) => p.is_new === true);
                break;

            case "price_low":
                processedProducts.sort((a, b) => a.price - b.price);
                break;

            case "price_high":
                processedProducts.sort((a, b) => b.price - a.price);
                break;

            default:
                break;
        }
        displayPage(processedProducts, currentPage);
    }, [currentPage, sortType, allProducts]);

    // 計算篩選後的商品陣列

    const filteredProducts = useMemo(() => {
        if (allProducts.length === 0) return [];

            let processed = [...allProducts];

            switch (sortType) {
                case "hot":
                    return processed.filter((p) => p.is_hot === true);
                case "new":
                    return processed.filter((p) => p.is_new === true);
                default:
                    return processed;
                }
    }, [allProducts, sortType]);

    // 動態計算顯示的商品數量

    const displayedProductCount = useMemo(() => {
        if (sortType === "hot" || sortType === "new") {
            // hot 或 new，使用篩選結果的長度
            return filteredProducts.length;
        }else{
            // price_low 或 price_high，使用全部商品長度
            return allProducts.length;
        }
    }, [sortType, filteredProducts, allProducts]);


     // 排序按鈕點擊事件

    const handleSortClick = (sort) => {
        applySort(allProducts, sort);
    };

    // 手機版radio暫時狀態

    const handleRadioChange = (sort) => {
        setTempSortType(sort);
    };

    // 手機版套用按鈕

    const handleApply = () => {
        applySort(allProducts, tempSortType);
        
        if (offcanvasInstance.current) {
            offcanvasInstance.current.hide();
        }
    };

    // Pagination 點擊事件

    const handlePageClick = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
        setCurrentPage(pageNum);
        }
    };

     if (isLoading) {
        return <div className="text-center py-5">載入中...</div>;
    }

    return(
    <>
    <main className="px-6 position-relative" style={{overflow: "hidden"}}> 

        {/* header前的留白區 */}
        <section className="max-h-130 max-h-md-144"></section>  

        {/* 光暈 */}
        <ProductListGlow></ProductListGlow>

        {/* 分頁 */}
        <section className="p-0 mb-0 mb-md-7 container max-w-1296">
            {/* 手機版上方選單 */}
            <ul className="nav nav-pills d-md-none phone_nav">
                <li className="nav-item me-6 nav-item_new">
                    <a className="nav-link ruby-text active" aria-current="page" href="#">所有商品</a>
                </li>
                <li className="nav-item dropdown me-6  nav-item_new">
                    <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">健身裝備</a>
                    <ul className="dropdown-menu bg-primary-950 shodow_none">
                        <li><a className="dropdown-item" href="#">重量訓練專區</a></li>
                        <li><a className="dropdown-item" href="#">瑜伽伸展專區</a></li>
                        <li><a className="dropdown-item" href="#">核心訓練專區</a></li>
                        <li><a className="dropdown-item" href="#">有氧訓練專區</a></li>
                        <li><a className="dropdown-item" href="#">按摩放鬆專區</a></li>
                        <li><a className="dropdown-item" href="#">輔助訓練專區</a></li>
                    </ul>
                </li>
                <li className="nav-item dropdown me-6 nav-item_new">
                    <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">健身課程</a>
                    <ul className="dropdown-menu bg-primary-950 shodow_none">
                        <li><a className="dropdown-item" href="#">重量訓練</a></li>
                        <li><a className="dropdown-item" href="#">瑜珈</a></li>
                        <li><a className="dropdown-item" href="#">有氧</a></li>
                        <li><a className="dropdown-item" href="#">筋膜放鬆</a></li>
                        <li><a className="dropdown-item" href="#">知識講座</a></li>
                    </ul>
                </li>
            </ul>
            {/* 網站導行列 */}
            <nav style={{ "--bs-breadcrumb-divider": "/" }}  aria-label="breadcrumb">
                <ol className="breadcrumb mb-2 fs-9 fs-md-6">
                    <li className="breadcrumb-item pe-2 pe-md-6">
                        <a className="text-gray-200 fw-bold" href="#">首頁</a>
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
                        <a className="text-gray-200 fw-bold" href="#">商城</a>
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
                    所有商品
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
                    <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item border-radius-12 mb-7">
                                <button className="nav-link px-6 py-3 fs-7 active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">
                                    所有商品
                                </button>
                            </div>
                            <div className="accordion-item px-6 border-radius-12 mb-7">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button px-0 py-3 collapsed fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        健身裝備
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div className="accordion-body px-0 pb-1">
                                        <button className="nav-link mb-3" id="v-pills-two-tab" data-bs-toggle="pill" data-bs-target="#v-pills-two" type="button" role="tab" aria-controls="v-pills-two" aria-selected="false">
                                            重量訓練專區
                                        </button>
                                        <button className="nav-link mb-3" id="v-pills-three-tab" data-bs-toggle="pill" data-bs-target="#v-pills-three" type="button" role="tab" aria-controls="v-pills-three" aria-selected="false">
                                            瑜伽伸展專區
                                        </button>
                                        <button className="nav-link mb-3" id="v-pills-four-tab" data-bs-toggle="pill" data-bs-target="#v-pills-four" type="button" role="tab" aria-controls="v-pills-four" aria-selected="false">
                                            核心訓練專區
                                        </button>
                                        <button className="nav-link mb-3" id="v-pills-five-tab" data-bs-toggle="pill" data-bs-target="#v-pills-five" type="button" role="tab" aria-controls="v-pills-five" aria-selected="false">
                                            有氧訓練專區
                                        </button>
                                        <button className="nav-link mb-3" id="v-pills-six-tab" data-bs-toggle="pill" data-bs-target="#v-pills-six" type="button" role="tab" aria-controls="v-pills-six" aria-selected="false">
                                            按摩放鬆專區
                                        </button>
                                        <button className="nav-link mb-3" id="v-pills-seven-tab" data-bs-toggle="pill" data-bs-target="#v-pills-seven" type="button" role="tab" aria-controls="v-pills-seven" aria-selected="false">
                                            輔助訓練專區
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item px-6 border-radius-12 mb-7">
                                <h2 className="accordion-header" id="headingThree">
                                    <button className="accordion-button px-0 py-3 collapsed fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        健身課程
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div className="accordion-body px-0 pb-1">
                                        <button className="nav-link mb-3" id="v-pills-eight-tab" data-bs-toggle="pill" data-bs-target="#v-pills-eight" type="button" role="tab" aria-controls="v-pills-eight" aria-selected="false">
                                            重量訓練
                                        </button>
                                        <button className="nav-link mb-3" id="v-pills-nine-tab" data-bs-toggle="pill" data-bs-target="#v-pills-nine" type="button" role="tab" aria-controls="v-pills-nine" aria-selected="false">
                                            瑜伽
                                        </button>
                                        <button className="nav-link mb-3" id="v-pills-ten-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ten" type="button" role="tab" aria-controls="v-pills-ten" aria-selected="false">
                                            有氧
                                        </button>
                                        <button className="nav-link mb-3" id="v-pills-elevent-tab" data-bs-toggle="pill" data-bs-target="#v-pills-elevent" type="button" role="tab" aria-controls="v-pills-elevent" aria-selected="false">
                                            筋膜放鬆
                                        </button>
                                        <button className="nav-link mb-3" id="v-pills-twelve-tab" data-bs-toggle="pill" data-bs-target="#v-pills-twelve" type="button" role="tab" aria-controls="v-pills-twelve" aria-selected="false">
                                            知識講座
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item px-6 border-radius-12 mb-7">
                                <h2 className="accordion-header" id="headingFour">
                                    <button className="accordion-button px-0 py-3 collapsed fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                        入場方案
                                    </button>
                                </h2>
                                <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                    <div className="accordion-body px-0 pb-1">
                                        <button className="nav-link mb-3" id="v-pills-thirteen-tab" data-bs-toggle="pill" data-bs-target="#v-pills-thirteen" type="button" role="tab" aria-controls="v-pills-thirteen" aria-selected="false">
                                            單次入場
                                        </button>
                                        <button className="nav-link mb-3" id="v-pills-fourteen-tab" data-bs-toggle="pill" data-bs-target="#v-pills-fourteen" type="button" role="tab" aria-controls="v-pills-fourteen" aria-selected="false">
                                            包月入場
                                        </button>
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
                        <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">

                            {/* 電腦版＆手機版 產品數量+排列選單 */}
                            <div className="row d-flex justify-content-between align-items-center mb-2 mb-md-7">
                                <div className="col-6">
                                    <p className="fw-bold text-gray-950 fs-mg-8 fs-9">
                                        共有<span className="fs-8 fs-md-7 mx-2">
                                            {displayedProductCount}
                                            </span>
                                            樣商品
                                    </p>
                                </div>                

                                <div className="col-5 d-flex justify-content-end">
                                    <div className="dropdown d-none d-md-block">
                                        <button className="btn dropdown-toggle w-200 fs-8 d-flex justify-content-between align-items-center text-white" style={{border: "0px"}} type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            {sortLabels[sortType] || ""}
                                        </button>
                                        <ul className="dropdown-menu w-100 p-2 mt-1" aria-labelledby="dropdownMenuButton1">
                                            <li><button className="dropdown-item fs-8"
                                                        onClick={() => handleSortClick("hot")}
                                                >
                                                熱銷排行
                                                </button>
                                            </li>
                                            <li><button className="dropdown-item fs-8"
                                                        onClick={() => handleSortClick("new")}
                                                >
                                                最新上市
                                                </button>
                                            </li>
                                            {/* <li><a className="dropdown-item fs-8">商城推薦</a></li> */}
                                            <li><button className="dropdown-item fs-8"
                                                        onClick={() => handleSortClick('price_high')}
                                                >
                                                價格高至低
                                                </button>
                                            </li>
                                            <li><button className="dropdown-item fs-8"
                                                        onClick={() => handleSortClick('price_low')}
                                                >
                                                價格低至高
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* 手機版排序按鈕 */}
                                    <button className="btn text-white d-flex justify-content-between align-items-center fs-9 bg-white-opacity-20 px-4 py-2 d-md-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter_svg">
                                        <path d="M8.25 13.25C8.7 13.25 9 13.55 9 14C9 14.45 8.7 14.75 8.25 14.75H6.75V19.25C6.75 19.7 6.45 20 6 20C5.55 20 5.25 19.7 5.25 19.25V14.75H3.75C3.3 14.75 3 14.45 3 14C3 13.55 3.3 13.25 3.75 13.25H8.25ZM12 11.75C12.45 11.75 12.75 12.05 12.75 12.5V19.25C12.75 19.7 12.45 20 12 20C11.55 20 11.25 19.7 11.25 19.25V12.5C11.25 12.05 11.55 11.75 12 11.75ZM20.25 14.75C20.7 14.75 21 15.05 21 15.5C21 15.95 20.7 16.25 20.25 16.25H18.75V19.25C18.75 19.7 18.45 20 18 20C17.55 20 17.25 19.7 17.25 19.25V16.25H15.75C15.3 16.25 15 15.95 15 15.5C15 15.05 15.3 14.75 15.75 14.75H20.25ZM18 5C18.45 5 18.75 5.3 18.75 5.75V12.5C18.75 12.95 18.45 13.25 18 13.25C17.55 13.25 17.25 12.95 17.25 12.5V5.75C17.25 5.3 17.55 5 18 5ZM6 5C6.45 5 6.75 5.3 6.75 5.75V11C6.75 11.45 6.45 11.75 6 11.75C5.55 11.75 5.25 11.45 5.25 11V5.75C5.25 5.3 5.55 5 6 5ZM12 5C12.45 5 12.75 5.3 12.75 5.75V8.75H14.25C14.7 8.75 15 9.05 15 9.5C15 9.95 14.7 10.25 14.25 10.25H9.75C9.3 10.25 9 9.95 9 9.5C9 9.05 9.3 8.75 9.75 8.75H11.25V5.75C11.25 5.3 11.55 5 12 5Z" fill="white" stroke="white" strokeWidth="0.5"/>
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
                                            <h5 className="offcanvas-title text-white fs-7" id="offcanvasBottomLabel">排序依據</h5>
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
                                                <label className="form-check-label" htmlFor="flexRadioDefault1">
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
                                                <label className="form-check-label" htmlFor="flexRadioDefault2">
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
                                                <label className="form-check-label" htmlFor="flexRadioDefault4">
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
                                                <label className="form-check-label" htmlFor="flexRadioDefault5">
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
                        
                            {/* 28個產品 */}
                            <div className="row mlr--10 mb-4">
                                {/* 商品 */}
                                {productList.length>0 ?(
                                    productList.map((product)=>{
                                        return (
                                            <div className="col-6 col-sm-4 plr-10 mb-6 mb-md-7" key={product.id}>
                                                <div className="card rounded-3 bg-blue-600 flex-grow-0 flex-shrink-0 hover-effect-3 overflow-hidden">
                                                    <a className="rounded-3 position-relative" href="#">
                                                        <div>
                                                            {/* 商品圖 */}
                                                            <div>
                                                                <img    className="card-img-top cardlist-img-h"
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
                                                                        {product.is_hot ? "最新上市" : ""}
                                                                    </span>
                                                                </div>
                                                                {/* 收藏符號 */}
                                                                <div className="p-2 color-primary-400 bg-gray-900-20 blur-30 rounded-2 border-top-left-radius-0 border-bottom-right-radius-0 ms-auto">
                                                                    <svg
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 36 37"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                        d="M9.28592 33.2821C8.54171 33.8176 7.50391 33.2856 7.50391 32.3688V9.875C7.50391 7.18261 9.68651 5 12.3789 5H23.6265C26.3188 5 28.5015 7.18261 28.5015 9.875V32.3688C28.5015 33.2856 27.4636 33.8176 26.7195 33.2821L18.0027 27.0107L9.28592 33.2821ZM26.2515 9.875C26.2515 8.42525 25.0762 7.25 23.6265 7.25H12.3789C10.9292 7.25 9.75391 8.42525 9.75391 9.875V30.1736L17.3457 24.7115C17.7382 24.4292 18.2673 24.4292 18.6597 24.7115L26.2515 30.1736V9.875Z"
                                                                        fill="#e1ff00"
                                                                        stroke="#e1ff00"
                                                                        strokeWidth="0.5"
                                                                        />
                                                                    </svg>
                                                                </div>
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
                                                                    {!Number.isNaN(Math.round((product.price / product.origin_price * 100))) && `${Math.round((product.price / product.origin_price * 100))}折`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>);
                                    })
                                ):(
                                    <div className="col-12 text-center py-5">
                                        <p className="text-white">沒有符合條件的商品</p>
                                    </div>
                                )}
                            </div>

                            {/* 換頁Pagination */}
                            <div className="row">
                                <div className="col-12 d-flex justify-content-center">
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination d-flex align-items-center">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ""}`}>
                                                <a  className="page-link"
                                                    href="#" 
                                                    aria-label="Previous"
                                                    onClick={() => handlePageClick(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    <span aria-hidden="true">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform:"rotate(180deg)"}}>
                                                        <path d="M6.91009 3.57757C7.23553 3.25214 7.76304 3.25214 8.08848 3.57757L13.9218 9.41091C14.2473 9.73634 14.2473 10.2639 13.9218 10.5893L8.08848 16.4226C7.76304 16.7481 7.23553 16.7481 6.91009 16.4226C6.58466 16.0972 6.58466 15.5697 6.91009 15.2442L12.1542 10.0001L6.91009 4.75596C6.58466 4.43052 6.58466 3.90301 6.91009 3.57757Z" fill="white"/>
                                                        </svg>
                                                    </span>
                                                </a>
                                            </li>
                                            {/* 頁碼 */}
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <li
                                                key={i + 1}
                                                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                                                >
                                                <a  className="page-link"
                                                    onClick={() => handlePageClick(i + 1)}
                                                    href="#"
                                                >
                                                    {i + 1}
                                                </a>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ""}`}>
                                                <a  className="page-link"
                                                    href="#" 
                                                    aria-label="Next"
                                                    onClick={() => handlePageClick(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    <span aria-hidden="true">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M6.91009 3.57757C7.23553 3.25214 7.76304 3.25214 8.08848 3.57757L13.9218 9.41091C14.2473 9.73634 14.2473 10.2639 13.9218 10.5893L8.08848 16.4226C7.76304 16.7481 7.23553 16.7481 6.91009 16.4226C6.58466 16.0972 6.58466 15.5697 6.91009 15.2442L12.1542 10.0001L6.91009 4.75596C6.58466 4.43052 6.58466 3.90301 6.91009 3.57757Z" fill="white"/>
                                                        </svg>
                                                    </span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        {/* 商品顯示區塊 */}
                        <div className="tab-pane fade" id="v-pills-two" role="tabpanel" aria-labelledby="v-pills-two-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-three" role="tabpanel" aria-labelledby="v-pills-three-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-four" role="tabpanel" aria-labelledby="v-pills-four-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-five" role="tabpanel" aria-labelledby="v-pills-five-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-six" role="tabpanel" aria-labelledby="v-pills-six-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-seven" role="tabpanel" aria-labelledby="v-pills-seven-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-eight" role="tabpanel" aria-labelledby="v-pills-eight-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-nine" role="tabpanel" aria-labelledby="v-pills-nine-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-ten" role="tabpanel" aria-labelledby="v-pills-ten-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-elevent" role="tabpanel" aria-labelledby="v-pills-elevent-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-twelve" role="tabpanel" aria-labelledby="v-pills-twelve-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-thirteen" role="tabpanel" aria-labelledby="v-pills-thirteen-tab">...</div>
                        <div className="tab-pane fade" id="v-pills-fourteen" role="tabpanel" aria-labelledby="v-pills-fourteen-tab">...</div>
                    </div>
                </div>
            </div>
        </section>  
    </main>

    {/* 回到頂部按鈕 */}
    <BackTop></BackTop>
    </>);
}

export default ProductList;