// React Hooks
import { useEffect, useRef, useState } from "react";

// 元件
import BackTop from "../components/BackTop.jsx";
import BGLight from "../components/BGLight.jsx"
import CoachSwiper from "../components/CoachSwiper.jsx";

// 第三方套件
import axios from "axios";
import * as bootstrap from 'bootstrap';

// 靜態資料
import carouselData from "../data/carouselData.js";
import serviceCardsData from "../data/serviceCardsData.js";

const baseUrl = import.meta.env.VITE_BASE_URL;
const path = import.meta.env.VITE_API_PATH;


function Home() {

  // header輪播區塊生成實體

  const carouselRef = useRef(null);
  const carouselInstance = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    // 保存 DOM 引用
    const element = carouselRef.current;
    
    if (element && !carouselInstance.current) {
      // 初始化 Bootstrap Carousel 實體
      carouselInstance.current = new bootstrap.Carousel(element, {
        interval: false, // 關閉自動播放，避免與手動控制衝突
        wrap: true,
        ride: false
      });

      // 定義事件處理函數
      const handleSlide = (e) => {
        setActiveIndex(e.to);
      };

      // 監聽滑動完成事件
      element.addEventListener('slid.bs.carousel', handleSlide);

      // 清理函數：組件卸載時執行
      return () => {
        // 移除事件監聽器
        element.removeEventListener('slid.bs.carousel', handleSlide);
        
        // 銷毀 Bootstrap 實體
        if (carouselInstance.current) {
          carouselInstance.current.dispose();
          carouselInstance.current = null;
        }
      };
    }
  }, []); 
  
  const handlePrev = (e) => {
    e.preventDefault();
    carouselInstance.current?.prev();
  };
  
  const handleNext = (e) => {
    e.preventDefault();
    carouselInstance.current?.next();
  };
  
  const handleTo = (index) => {
    carouselInstance.current?.to(index);
  };

  // 取得熱門商品資料

  const [hotCourse, setHotCourse]=useState([]);
  const [hotEquip, setHotEquip]=useState([]);

  useEffect(()=>{
    const getProducts=async()=>{
      try{
        const res=await axios.get(`${baseUrl}/v2/api/${path}/products/all`);
        console.log(res?.data?.products);
        const hotCourseData = res?.data?.products?.filter(product=>product.category==="課程")?.slice(0,3);
        const hotEquipData = res?.data?.products?.filter(product=>product.category!=="課程" && product.is_hot===true);
        setHotCourse(hotCourseData);
        setHotEquip(hotEquipData);
      }catch(error){
        console.log("error:",error.response);
      }
    };
    getProducts();
  },[])
    
  return (
  <>
    {/* header輪播區塊   */}
    <header className="carousel slide" ref={carouselRef}>
        <div className="carousel-indicators">
          <div className="container d-flex justify-content-center justify-content-lg-start">
            <button 
              type="button" 
              onClick={() => handleTo(0)} 
              className={activeIndex === 0 ? "active" : ""} 
              aria-current={activeIndex === 0 ? "true" : "false"}
            ></button>
            <button 
              type="button" 
              onClick={() => handleTo(1)} 
              className={activeIndex === 1 ? "active" : ""}
            ></button>
            <button 
              type="button" 
              onClick={() => handleTo(2)} 
              className={activeIndex === 2 ? "active" : ""}
            ></button>
          </div>
        </div>
        {/* header背景圖片 */}
        <div className="carousel-inner">
          {
            carouselData.map((carousel,index)=>{
              return (
                        <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                            <div  className="carousel-caption img-all" 
                                  style={{backgroundImage:`url(${carousel.backgroundImage})`}}
                            >
                              <div className="container">
                                <div className="d-flex flex-column align-items-start row-gap-6 row-gap-lg-4 mb-6 mb-lg-4">
                                  <h1 className="header-title text-start text-nowrap">{carousel.topic}<br/>
                                      {carousel.demand}
                                  </h1>
                                  <h2 className="header-sub-title text-nowrap">{carousel.slogan}</h2>
                                  <p className="header-notes text-nowrap">{carousel.feature}</p>
                                </div>
                                <div className="d-flex flex-column flex-lg-row row-gap-3 column-gap-lg-3">
                                  <a  className="btn serve-btn text-nowrap" 
                                      type="button" 
                                      href="#">立即購物
                                  </a>
                                  <a  className="btn serve-btn text-nowrap" 
                                      type="button"
                                      href="#">預約服務
                                  </a>
                                </div>
                              </div>
                            </div>
                        </div>
              );
            })
          }
        </div>
        <button className="d-none d-lg-block carousel-control-prev top-50 translate-middle-y" type="button" onClick={handlePrev}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="d-none d-lg-block carousel-control-next top-50 translate-middle-y" type="button" onClick={handleNext}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
    </header>

    {/* main主要內容 */}
    <main className="padding-style position-relative overflow-hidden">
      {/* 光暈 */}
      <BGLight></BGLight>    

      {/* 全方位專注健身服務 */}
      <section className="topics">
        <div className="container">
          <div className="d-flex flex-column justify-content-center align-items-center text-center border-bottom border-gray-500">
            <p className="sub-topics mb-6 mb-lg-3">/  Various Focus Service  /</p>
            <h3 className="fs-3 fs-lg-1 text-gray-950 fw-bold mb-6 mb-lg-3">全方位專注健身服務</h3>
            <p className="fs-7 fs-lg-4 text-gray-950 mb-3 mb-lg-8 text-center">專注目標肌群，感受動作完整過程<span className="d-none d-lg-inline">，</span><br className="d-block d-lg-none"/>強化專屬肌肉記憶。</p>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <p className="text-center mt-3 mt-lg-8">
              當你開始投入運動，每一次流汗都是挑戰極限、超越自我的契機。你會從懷疑到堅定，從拖延到自律，身心同步成長。<br className="d-none d-lg-block"/>
              這段旅程，將引領你走向理想的體態與更強大的內在力量，讓自信與健康成為生活的一部分。
            </p>
          </div>
        </div>
      </section>

      {/* 全方位專注健身服務卡片 */}
      <section className="service-cards">
        <div className="container card-gap">
          {
            serviceCardsData.map((serviceCard,index)=>{
              
              const isReverse = index % 2 === 0;

              return (
                      <div className="card d-flex flex-column flex-lg-row justify-content-between bg-transparent border-0" key={serviceCard.cardNumber}>
                        <div className={`card-body order-1 order-lg-${isReverse ? "0" : "1"} p-0`}>
                          <h5 className="card-title fs-5 fs-lg-10 fw-bold text-primary-400 mb-6 mb-lg-8">{serviceCard.title}</h5>
                          <p className="card-text fs-8 fs-lg-5 fw-normal text-gray-950 mb-6 mb-lg-8">{serviceCard.description}</p>
                          <a href="#" className="btn card-btn text-nowrap">立即購物</a>
                        </div>
                        <div className={`card-img-wrapper order-0 order-lg-${isReverse ? "1" : "0"} position-relative mb-2 mb-lg-0`}>
                          <img className="card-img-top card-img-service" src={serviceCard.imgUrl} alt={serviceCard.title}/>
                          <div className="number-cube position-absolute top-0 start-0">{serviceCard.cardNumber}</div>
                        </div>
                      </div>
                      );
            })
          }          
        </div>
      </section>

      {/* 熱門商品 */}
      <section className="best-sell">
        <div className="container">
          <div className="d-flex flex-column justify-content-center align-items-center text-center mb-4 mb-lg-11">
            <p className="sub-topics mb-6 mb-lg-3">/  Hot Product  /</p>
            <h3 className="fs-3 fs-lg-1 text-gray-950 fw-bold">熱門商品</h3>
          </div>
          {/* 熱門課程 */}
          <div className="mb-4 mb-lg-11">
            <div className="best-class d-flex justify-content-between align-items-center mb-2 mb-lg-6">
              <p className="fs-5 fs-lg-4 fw-bold text-gray-950">熱門課程</p>
              <a href="#" className="fs-8 fs-lg-7 fw-bold text-gray-200 text-decoration-underline">
                查看全部
              </a>
            </div>
            <div className="row flex-nowrap scroll">
              {/* 熱門課程卡片 */}
              {
                hotCourse.map((course)=>{
                  return (
                          <div className="col-10 col-lg-4" key={course.id}>
                            <a href="#" className="d-block h-100 text-decoration-none">
                              <div className="card bg-blue-600 h-100 border-0">
                                <img src={course.imageUrl} className="card-img-top" alt={course.title}/>
                                <div className="card-body p-7 d-flex flex-column">
                                  <h5 className="card-title fs-5 fs-lg-4 fw-bold text-gray-950 mb-6">{course.title}</h5>
                                  <p className="card-text fs-5 fs-lg-4 fw-bold text-gray-950 mt-auto">{`$${course.price}${course.unit}`}
                                    <span className="fs-7 fw-bold ms-6 text-gray-500 text-decoration-line-through">
                                      {`$${course.origin_price}`}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </a>
                          </div>
                          );
                })
              }
            </div>
          </div>
          {/* 熱門裝備 */}
          <div className="mb-4 mb-lg-11">
            <div className="best-class d-flex justify-content-between align-items-center mb-2 mb-lg-6">
              <p className="fs-5 fs-lg-4 fw-bold text-gray-950">熱門裝備</p>
                <a href="#" className="fs-8 fs-lg-7 fw-bold text-gray-200 text-decoration-underline">
                  查看全部
                </a>
            </div>
            <div className="row flex-nowrap scroll">
              {/* 熱門裝備卡片 */}
              {
                hotEquip.map((equip)=>{
                  return (
                          <div className="col-10 col-lg-4" key={equip.id}>
                            <a href="#" className="d-block h-100 text-decoration-none">
                              <div className="card bg-blue-600 h-100 border-0">
                                <img src={equip.imageUrl} className="card-img-top" alt={equip.title}/>
                                <div className="card-body p-7 d-flex flex-column">
                                  <h5 className="card-title fs-5 fs-lg-4 fw-bold text-gray-950 mb-6">{equip.title}</h5>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <p className="card-text fs-5 fs-lg-4 fw-bold text-gray-950 mt-auto">{`$${equip.price}`}
                                      <span className="fs-7 fw-bold ms-6 text-gray-500 text-decoration-line-through">{`$${equip.origin_price}`}</span>
                                    </p>
                                    <span className="badge fs-9 fs-md-8 text-warning-normal fw-bold border rounded-3 border-warning-normal">
                                      {`${Math.round((equip.price / equip.origin_price * 100))}折`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                          );
                })
              }
            </div>
          </div>
        </div>
      </section>

      {/* 教練團隊 */}
      <section className="coach">
        <div className="container">
          <div className="d-flex flex-column justify-content-center align-items-center text-center mb-4 mb-lg-11">
            <p className="sub-topics mb-6 mb-lg-3">/  Team  /</p>
            <h3 className="fs-3 fs-lg-1 text-gray-950 fw-bold">教練團隊</h3>
          </div>
        </div>
        {/* 教練團隊SwiperSlider */}
        <CoachSwiper></CoachSwiper>
      </section>

      {/* 聯絡資訊 */}
      <section className="info-about">
        <div className="container">
          {/* About-Us */}
          <div className="about-us p-7 p-lg-9">
            <div className="about-us-head">
              <span className="fs-8 fs-lg-7 text-primary-400 mb-6 mb-lg-3">/  About Us  /</span>
              <h5 className="fs-3 fs-lg-1 text-gray-950 mb-7 mb-lg-8">關於我們</h5>
            </div>
            <div className="about-us-body mt-7 mt-lg-8">
              <p className="fs-7 fs-lg-4 fw-bold  text-gray-950 mb-6">我們是專注健身</p>
              <p className="fs-7 fs-lg-4 fw-bold  text-gray-950 mb-4">專注目標肌群，感受動作完整過程，強化專屬肌肉記憶。</p>
              <div>
                  <p className="mb-2 mb-lg-3">我們期許每一位來到這裡的健身夥伴，在每一次訓練之前，先確認目標肌群，知道自己這個動作，是要用哪一塊肌肉來完成，避免不必要的代償與受傷。</p>
                  <p className="mb-2 mb-lg-3">我們相信「專注」，是成為資深健身者的關鍵技能。當你能夠把大腦的專注力完全投注在肌肉感受上，就能產生更強的肌肉記憶，讓神經連結變得敏銳而強化，進一步提升動作效率、減少代償、減少受傷風險、達到肌肉深層刺激。</p>
                  <p>這就是我們品牌所倡導的健身哲學，透過「專注力」，完成身體與大腦的雙向進化。訓練的不只是身體，更是專注力與內在覺察力。」</p>
              </div>
            </div>
          </div>
          {/* Contact-Us */}
          <div className="contact-us p-7 p-lg-9">
            <div className="contact-us-head">
              <span className="fs-8 fs-lg-7 text-primary-400 mb-6 mb-lg-3">/  Contact Us  /</span>
              <h5 className="fs-3 fs-lg-1 text-gray-950 mb-7 mb-lg-8">聯絡我們</h5>
            </div>
            <form className="contact-us-body mt-7 mt-lg-8">
              {/* 輸入姓名&電話 */}
              <div className="input-info d-flex flex-column flex-lg-row">
                <div>
                  <label htmlFor="exampleInputName" className="form-label fs-8 fw-bold text-gray-950">姓名<span className="start-red">*</span></label>
                  <input type="text" className="form-control" id="exampleInputName" placeholder="請輸入姓名"/>
                </div>
                <div>
                  <label htmlFor="exampleInputPhone" className="form-label fs-8 fw-bold text-gray-950">聯絡電話<span className="start-red">*</span></label>
                  <input type="tel" className="form-control" id="exampleInputPhone" placeholder="請輸入電話號碼"/>
                </div>
              </div>
              {/* 選擇時間 */}
              <div className="input-time mb-6 mb-lg-7">
                <p className="form-label fs-8 fw-bold text-gray-950">方便聯絡時間<span className="start-red">*</span></p>
                <div className="d-flex flex-column flex-lg-row column-gap-2 mb-lg-2">
                  <div className="form-check m-0 pt-6 pb-6 w-100">
                    <input className="form-check-input" type="radio" name="time" id="flexRadioDefault1"/>
                    <label className="form-check-label fs-6 fw-medium text-gray-950 text-nowrap" htmlFor="flexRadioDefault1">
                      上午 10 點 ～ 中午 12 點
                    </label>
                  </div>
                  <div className="form-check m-0 pt-6 pb-6 w-100">
                    <input className="form-check-input" type="radio" name="time" id="flexRadioDefault2"/>
                    <label className="form-check-label fs-6 fw-medium text-gray-950" htmlFor="flexRadioDefault2">
                      中午 12 點 ～ 下午 1 點
                    </label>
                  </div>
                </div>
                <div className="d-flex flex-column flex-lg-row column-gap-2">
                  <div className="form-check m-0 pt-6 pb-6 w-100">
                    <input className="form-check-input" type="radio" name="time" id="flexRadioDefault3"/>
                    <label className="form-check-label fs-6 fw-medium text-gray-950" htmlFor="flexRadioDefault3">
                      下午 1 點 ～ 下午 2 點
                    </label>
                  </div>
                  <div className="form-check m-0 pt-6 pb-6 w-100">
                    <input className="form-check-input" type="radio" name="time" id="flexRadioDefault4"/>
                    <label className="form-check-label fs-6 fw-medium text-gray-950" htmlFor="flexRadioDefault4">
                      傍晚 6 點 ～ 傍晚 9 點
                    </label>
                  </div>
                </div>
              </div>
              {/* 選擇方案 */}
              <div className="input-plan mb-6 mb-lg-9">
                <p className="form-label fs-8 fw-bold text-gray-950">諮詢服務<span className="smaller-gray">（可複選）</span></p>
                <div className="d-flex flex-column flex-lg-row justify-content-between">
                  <div className="form-check m-0 pt-6 pb-6 pe-104">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label fs-6 fw-medium text-gray-950" htmlFor="exampleCheck1">私人教練</label>
                  </div>
                  <div className="form-check m-0 pt-6 pb-6 pe-104">
                    <input type="checkbox" className="form-check-input" id="exampleCheck2"/>
                    <label className="form-check-label fs-6 fw-medium text-gray-950" htmlFor="exampleCheck2">團體課程</label>
                  </div>
                  <div className="form-check m-0 pt-6 pb-6 pe-104">
                    <input type="checkbox" className="form-check-input" id="exampleCheck4"/>
                    <label className="form-check-label fs-6 fw-medium text-gray-950" htmlFor="exampleCheck4">飲食規劃</label>
                  </div>
                  <div className="form-check m-0 pt-6 pb-6 pe-104">
                    <input type="checkbox" className="form-check-input" id="exampleCheck5"/>
                    <label className="form-check-label fs-6 fw-medium text-gray-950" htmlFor="exampleCheck5">運動按摩</label>
                  </div>
                </div>
              </div>
              {/* 送出表單 */}
              <button type="submit" className="btn plan-btn">送出表單</button>
            </form>
          </div>
        </div>
      </section>

      {/* 地圖 */}
      <section className="info-map">
        <div className="container">
          <div className="map">
            {/* 地點說明 */}
            <div className="location p-3 p-lg-9">
              <div className="mb-7 mb-lg-9">
                <p className="fs-8 fs-lg-7 fw-bold text-primary-400 mb-6 mb-lg-3">/  Location  /</p>
                <h5 className="fs-5 fs-lg-1 fw-bold text-gray-950">專注健身｜忠孝店</h5>
              </div>
              <div>
                <p className="fs-8 fs-lg-7 mb-2 mb-lg-6">
                  <img className="map-icon" src="https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/cfe32d41cf4865ed773ce38aa3184880859dff69/assets/images/icons/ic_Phone.svg" alt="ic_Phone"/>
                  02-1888-2878 #9
                </p>
                <p className="fs-8 fs-lg-7 mb-2 mb-lg-6">
                  <img className="map-icon" src="https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/cfe32d41cf4865ed773ce38aa3184880859dff69/assets/images/icons/ic_Mail.svg" alt="ic_Mail"/>
                  FocusFitness@gym.io
                </p>
                <p className="fs-8 fs-lg-7">
                  <img className="map-icon" src="https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/cfe32d41cf4865ed773ce38aa3184880859dff69/assets/images/icons/ic_Map_Pin.svg" alt="ic_Map_Pin"/>
                  台北市中正區忠孝東路198巷10-2號 B1
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
   
    {/* 回到頂部按鈕 */}
    <BackTop></BackTop>
  </>);
}

export default Home;