import { useEffect, useState } from "react";
import axios from "axios";


const baseUrl = import.meta.env.VITE_BASE_URL;
const path = import.meta.env.VITE_API_PATH;

function Home() {
  // 光暈資料
  const lightsData = [
    {
      style:{
        position: "absolute",
        top: "-650px", 
        left: "-900px", 
        zIndex: "-100"
      },
      lightImg:"https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/bc9a888e21e0148db11348e3dece3ad6595f8262/assets/images/index_page/%E5%85%89%E6%9A%88/Ellipse%202.svg",
      altText:"光暈"
    },
    {
      style:{
        position: "absolute",
        top: "-1000px", 
        right: "-1000px", 
        zIndex: "-100"
      },
      lightImg:"https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/bc9a888e21e0148db11348e3dece3ad6595f8262/assets/images/index_page/%E5%85%89%E6%9A%88/Ellipse%204.svg",
      altText:"光暈"
    },
    {
      style:{
        position: "absolute",
        top: "2000px", 
        right: "-1000px", 
        zIndex: "-100"
      },
      lightImg:"https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/bc9a888e21e0148db11348e3dece3ad6595f8262/assets/images/index_page/%E5%85%89%E6%9A%88/Ellipse%203.svg",
      altText:"光暈"
    },
    {
      style:{
        position: "absolute",
        top: "5000px", 
        left: "-900px", 
        zIndex: "-100"
      },
      lightImg:"https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/bc9a888e21e0148db11348e3dece3ad6595f8262/assets/images/index_page/%E5%85%89%E6%9A%88/Ellipse%202.svg",
      altText:"光暈"
    }
  ];

  // 服務項目卡片資料
  const serviceCardsData = [
    {
      cardNumber: "01",
      title: "專項功能訓練",
      description: "專項功能訓練著重提升身體協調性、穩定性與運動表現。透過針對日常動作模式與運動需求設計的課程，強化核心控制、關節靈活度及肌群協作。每一動作皆引導學員專注目標肌群，減少代償，打造深層肌肉記憶，讓身體在各種情境下展現精準與高效的表現。",
      imgUrl:"https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%9C%8D%E5%8B%99%E9%A0%85%E7%9B%AE/%E5%B0%88%E9%A0%85%E5%8A%9F%E8%83%BD%E8%A8%93%E7%B7%B4.jpg?raw=true"
    },
    {
      cardNumber: "02",
      title: "自由重量訓練",
      description: "自由重量訓練使用槓鈴、啞鈴、壺鈴等器材，提升平衡、協調與神經肌肉控制。透過全身多平面動作，幫助學員專注於肌群發力的細節，建立敏銳的神經連結，強化核心穩定性，並減少不必要的代償與受傷風險，實現功能性與美觀兼備的體態。",
      imgUrl:"https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%9C%8D%E5%8B%99%E9%A0%85%E7%9B%AE/%E8%87%AA%E7%94%B1%E9%87%8D%E9%87%8F%E8%A8%93%E7%B7%B4.jpg?raw=true"
    },
    {
      cardNumber: "03",
      title: "機械式器材訓練",
      description: "機械式器材以固定軌道提供穩定支撐，適合初學者掌握正確動作路徑，也利於進階者進行高強度肌肉刺激。每次訓練皆讓身體逐步建立高效、安全的動作模式。",
      imgUrl:"https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%9C%8D%E5%8B%99%E9%A0%85%E7%9B%AE/%E6%A9%9F%E6%A2%B0%E5%BC%8F%E5%99%A8%E6%9D%90%E8%A8%93%E7%B7%B4.jpg?raw=true"
    },
    {
      cardNumber: "04",
      title: "私人/團體教練課程",
      description: "私人與團體教練課程提供個人化訓練規劃與即時動作調整，讓學員在專業指導下熟悉肌肉拉伸與收縮的完整過程。教練結合科學化訓練與覺察力引導，幫助每位健身者逐步進化，從基礎建立到高階挑戰，穩健達成理想體態。",
      imgUrl:"https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%9C%8D%E5%8B%99%E9%A0%85%E7%9B%AE/%E5%9C%98%E9%AB%94%E6%95%99%E7%B7%B4%E8%AA%B2%E7%A8%8B.jpg?raw=true"
    },
    {
      cardNumber: "05",
      title: "運動深層按摩服務",
      description: "筋膜放鬆專注於釋放緊繃肌群與恢復肌肉彈性，提升關節活動度與動作效率。透過專業手法與輔助設備，引導學員覺察身體張力變化，減少運動後代償與受傷風險，讓訓練與放鬆達到完美平衡，加速身體與大腦的修復進程。",
      imgUrl:"https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%9C%8D%E5%8B%99%E9%A0%85%E7%9B%AE/%E9%81%8B%E5%8B%95%E6%B7%B1%E5%B1%A4%E6%8C%89%E6%91%A9%E6%9C%8D%E5%8B%99.jpg?raw=true"
    },
    {
      cardNumber: "06",
      title: "多元入場方案",
      description: "多元入場方案提供彈性化選擇，從單次體驗到包月會員，滿足不同訓練需求。搭配線上線下資源整合，學員可依訓練階段選擇最適合自己的方案，無縫銜接自主訓練與團體鍛鍊，實現沉浸式健身體驗，讓專注成為日常習慣。",
      imgUrl:"https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%9C%8D%E5%8B%99%E9%A0%85%E7%9B%AE/%E5%A4%9A%E5%85%83%E5%85%A5%E5%A0%B4%E6%96%B9%E6%A1%88.jpg?raw=true"
    }
  ];

  const [hotCourse, setHotCourse]=useState([]);
  const [hotEquip, setHotEquip]=useState([]);

  useEffect(()=>{
    const getProducts=async()=>{
      try{
        const res=await axios.get(`${baseUrl}/v2/api/${path}/products/all`);
        console.log(res?.data?.products);
        const hotCourseData = res?.data?.products?.filter(product=>product.category==="課程")?.slice(2,5);
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
   {/* 背景輪播區塊   */}
    <header id="carouselExampleCaptions" className="carousel slide">
        <div className="carousel-indicators">
          <div className="container d-flex justify-content-center justify-content-lg-start">
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
        </div>
        {/* 背景圖片 */}
        <div className="carousel-inner">
            <div className="carousel-item active">
                <div className="carousel-caption img-slide1">
                  <div className="container">
                    <div className="d-flex flex-column align-items-start row-gap-6 row-gap-lg-4 mb-6 mb-lg-4">
                      <h1 className="header-title text-start text-nowrap">你的健身全配站<br/>
                          訓練與裝備一次到位
                      </h1>
                      <h2 className="header-sub-title text-nowrap">一站開練，零煩惱</h2>
                      <p className="header-notes text-nowrap">開啟一場改變大腦思惟與理想體態的奇幻旅程</p>
                    </div>
                    <div className="d-flex flex-column flex-lg-row row-gap-3 column-gap-lg-3">
                      <a className="btn serve-btn text-nowrap" type="button" href="product_list.html#">立即購物</a>
                      <a className="btn serve-btn text-nowrap" type="button">預約服務</a>
                    </div>
                  </div>
                </div>
            </div>
            <div className="carousel-item">
                <div className="carousel-caption img-slide2">
                  <div className="container">
                    <div className="d-flex flex-column align-items-start row-gap-6 row-gap-lg-4 mb-6 mb-lg-4">
                      <h1 className="header-title text-start">專屬計畫<br/>
                          專業教練全程陪練
                      </h1>
                      <h2 className="header-sub-title">量身打造，科學訓練</h2>
                      <p className="header-notes">無論新手還是進階，專業團隊助你達標</p>
                    </div>
                    <div className="d-flex flex-column flex-lg-row row-gap-3 column-gap-lg-3">
                      <a className="btn serve-btn text-nowrap" type="button" href="product_list.html">立即購物</a>
                      <a className="btn serve-btn" type="button">預約服務</a>
                    </div>
                  </div>
                </div>
            </div>
            <div className="carousel-item">
                <div className="carousel-caption img-slide3">
                  <div className="container">
                    <div className="d-flex flex-column align-items-start row-gap-6 row-gap-lg-4 mb-6 mb-lg-4">
                      <h1 className="header-title text-start">嚴選健身裝備<br/>
                          讓訓練事半功倍
                      </h1>
                      <h2 className="header-sub-title">專業品質，全面提升</h2>
                      <p className="header-notes">從重訓到瑜珈，配齊你的每一次健身</p>
                    </div>
                    <div className="d-flex flex-column flex-lg-row row-gap-3 column-gap-lg-3">
                      <a className="btn serve-btn text-nowrap" type="button" href="product_list.html">立即購物</a>
                      <a className="btn serve-btn" type="button">預約服務</a>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <button className="d-none d-lg-block carousel-control-prev top-50 translate-middle-y" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="d-none d-lg-block carousel-control-next top-50 translate-middle-y" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
    </header>

    <main className="padding-style position-relative overflow-hidden">
      {/* 光暈 */}
      {
        lightsData.map((light,index)=>(
          <img
            style={light.style}
            src={light.lightImg}
            alt={light.altText}
            key={index}
          />
        ))
      }      

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

      {/* 卡片區 */}
      <section className="service-cards">
        <div className="container card-gap">
          {
            serviceCardsData.map((serviceCard,index)=>{
              const isReverse = index % 2 === 0;

              return (<div className="card d-flex flex-column flex-lg-row justify-content-between bg-transparent border-0" key={serviceCard.cardNumber}>
                        <div className={`card-body order-1 order-lg-${isReverse ? "0" : "1"} p-0`}>
                          <h5 className="card-title fs-5 fs-lg-10 fw-bold text-primary-400 mb-6 mb-lg-8">{serviceCard.title}</h5>
                          <p className="card-text fs-8 fs-lg-5 fw-normal text-gray-950 mb-6 mb-lg-8">{serviceCard.description}</p>
                          <a href="#" className="btn card-btn text-nowrap">立即購物</a>
                        </div>
                        <div className={`card-img-wrapper order-0 order-lg-${isReverse ? "1" : "0"} position-relative mb-2 mb-lg-0`}>
                          <img className="card-img-top card-img-service" src={serviceCard.imgUrl} alt={serviceCard.title}/>
                          <div className="number-cube position-absolute top-0 start-0">{serviceCard.cardNumber}</div>
                        </div>
                      </div>);
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
                  return (<div className="col-10 col-lg-4" key={course.id}>
                            <a href="#" className="d-block h-100 text-decoration-none">
                              <div className="card bg-blue-600 h-100 border-0">
                                <img src={course.imageUrl} className="card-img-top" alt={course.title}/>
                                <div className="card-body p-7 d-flex flex-column">
                                  <h5 className="card-title fs-5 fs-lg-4 fw-bold text-gray-950 mb-6">{course.title}</h5>
                                  <p className="card-text fs-5 fs-lg-4 fw-bold text-gray-950 mt-auto">{`$${course.price}${course.unit}`}
                                    <span className="fs-7 fw-bold ms-6 text-gray-500 text-decoration-line-through">{`$${course.origin_price}`}</span>
                                  </p>
                                </div>
                              </div>
                            </a>
                          </div>);
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
                  return (<div className="col-10 col-lg-4" key={equip.id}>
                            <a href="#" className="d-block h-100 text-decoration-none">
                              <div className="card bg-blue-600 h-100 border-0">
                                <img src={equip.imageUrl} className="card-img-top" alt={equip.title}/>
                                <div className="card-body p-7 d-flex flex-column">
                                  <h5 className="card-title fs-5 fs-lg-4 fw-bold text-gray-950 mb-6">{equip.title}</h5>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <p className="card-text fs-5 fs-lg-4 fw-bold text-gray-950 mt-auto">{`$${equip.price}`}
                                      <span className="fs-7 fw-bold ms-6 text-gray-500 text-decoration-line-through">{`$${equip.origin_price}`}</span>
                                    </p>
                                    <span className="badge fs-9 fs-md-8 text-warning-normal fw-bold border rounded-3 border-warning-normal">{`${Math.round((equip.price / equip.origin_price * 100))}折`}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>);
                })
              }
            </div>
          </div>
        </div>
      </section>

      {/* 教練團隊 */}
      {/* <section className="coachs">
        <div className="container">
          <div className="d-flex flex-column justify-content-center align-items-center text-center mb-4 mb-lg-11">
            <p className="sub-topics mb-6 mb-lg-3">/  Team  /</p>
            <h3 className="fs-3 fs-lg-1 text-gray-950 fw-bold">教練團隊</h3>
          </div>
        </div> */}
          {/* Slider main container */}
          {/* <div className="swiper"> */}
            {/* Additional required wrapper */}
            {/* <div className="swiper-wrapper"> */}
              {/* Slides */}
              {/* <div className="swiper-slide">
                <img src="https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%95%99%E7%B7%B4%E5%9C%98%E9%9A%8A/Team%20member%20card%20(1).png?raw=true" alt="教練1"/>
                <div className="coach-name p-2 p-lg-6">
                  <p className="fs-lg-8 fw-bold text-gray-950 mb-1">復興店｜運動按摩師</p>
                  <h5 className="fs-3 fw-bold text-primary-400">Hank</h5>
                </div>
              </div>
              <div className="swiper-slide">
                <img src="https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%95%99%E7%B7%B4%E5%9C%98%E9%9A%8A/Team%20member%20card%20(2).png?raw=true" alt="教練2"/>
                <div className="coach-name p-2 p-lg-6">
                  <p className="fs-lg-8 fw-bold text-gray-950 mb-1">忠孝店｜飛輪教練</p>
                  <h5 className="fs-3 fw-bold text-primary-400">Max</h5>
                </div>
              </div>
              <div className="swiper-slide">
                <img src="https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%95%99%E7%B7%B4%E5%9C%98%E9%9A%8A/Team%20member%20card%20(3).png?raw=true" alt="教練3"/>
                <div className="coach-name p-2 p-lg-6">
                  <p className="fs-lg-8 fw-bold text-gray-950 mb-1">忠孝店｜有氧教練</p>
                  <h5 className="fs-3 fw-bold text-primary-400">Sam</h5>
                </div>
              </div>
              <div className="swiper-slide">
                <img src="https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%95%99%E7%B7%B4%E5%9C%98%E9%9A%8A/Team%20member%20card%20(4).png?raw=true" alt="教練4"/>
                <div className="coach-name p-2 p-lg-6">
                  <p className="fs-lg-8 fw-bold text-gray-950 mb-1">中山店｜啞鈴教練</p>
                  <h5 className="fs-3 fw-bold text-primary-400">Sandy</h5>
                </div>
              </div>
              <div className="swiper-slide">
                <img src="https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%95%99%E7%B7%B4%E5%9C%98%E9%9A%8A/Team%20member%20card%20(5).png?raw=true" alt="教練5"/>
                <div className="coach-name p-2 p-lg-6">
                  <p className="fs-lg-8 fw-bold text-gray-950 mb-1">光復店｜核心訓練師</p>
                  <h5 className="fs-3 fw-bold text-primary-400">Cindy</h5>
                </div>
              </div>
              <div className="swiper-slide">
                <img src="https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%95%99%E7%B7%B4%E5%9C%98%E9%9A%8A/Team%20member%20card%20(6).png?raw=true" alt="教練6"/>
                <div className="coach-name p-2 p-lg-6">
                  <p className="fs-lg-8 fw-bold text-gray-950 mb-1">忠孝店｜拳擊教練</p>
                  <h5 className="fs-3 fw-bold text-primary-400">Tiffany</h5>
                </div>
              </div>
              <div className="swiper-slide">
                <img src="https://github.com/Jo-Kyu/focus_fitness_project/blob/dev/assets/images/index_page/%E6%95%99%E7%B7%B4%E5%9C%98%E9%9A%8A/Team%20member%20card%EF%BC%887%EF%BC%89.png?raw=true" alt="教練7"/>
                <div className="coach-name p-2 p-lg-6">
                  <p className="fs-lg-8 fw-bold text-gray-950 mb-1">忠孝店｜瑜伽平衡教練</p>
                  <h5 className="fs-3 fw-bold text-primary-400">Mandy</h5>
                </div>
              </div>
            </div>
          </div>
      </section> */}

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
    <div className="back-top">
        <a href="#top" className="d-block">
            <svg className="arrow-up" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="back-top-bg" d="M0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32Z" fill="white" fillOpacity="0.2"/>
            <path className="back-top-arrow" d="M32 32C32.442 32 32.8658 32.1757 33.1783 32.4883L39.845 39.1549C40.4959 39.8058 40.4959 40.8608 39.845 41.5117C39.1941 42.1626 38.1391 42.1626 37.4882 41.5117L32 36.0234L26.5117 41.5117C25.8608 42.1626 24.8058 42.1626 24.1549 41.5117C23.504 40.8608 23.504 39.8058 24.1549 39.1549L30.8216 32.4883L30.9436 32.3776C31.2402 32.1345 31.6131 32 32 32ZM30.9485 22.3743C31.6031 21.8404 32.5681 21.8781 33.1783 22.4883L39.845 29.1549C40.4959 29.8058 40.4959 30.8608 39.845 31.5117C39.1941 32.1626 38.1391 32.1626 37.4882 31.5117L32 26.0234L26.5117 31.5117C25.8608 32.1626 24.8058 32.1626 24.1549 31.5117C23.504 30.8608 23.504 29.8058 24.1549 29.1549L30.8216 22.4883L30.9485 22.3743Z" fill="white"/>
            </svg>
        </a>
    </div>
  </>);
}

export default Home;