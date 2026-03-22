// 第三方套件
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";

// 樣式
import "swiper/css";

// 內部資源
import coachImgFirst from "../assets/images/index_page/教練團隊/Team member card (1).png";
import coachImgSecond from "../assets/images/index_page/教練團隊/Team member card (2).png";
import coachImgThird from "../assets/images/index_page/教練團隊/Team member card (3).png";
import coachImgFourth from "../assets/images/index_page/教練團隊/Team member card (4).png";
import coachImgFifth from "../assets/images/index_page/教練團隊/Team member card (5).png";
import coachImgSixth from "../assets/images/index_page/教練團隊/Team member card (6).png";
import coachImgSeventh from "../assets/images/index_page/教練團隊/Team member card (7).png";  

// 教練團隊資料
const coachData=[
  {
    coachId:1,
    coachName:"Hank",
    location:"復興店｜運動按摩師",
    imgUrl: coachImgFirst
  },
  {
    coachId:2,
    coachName:"Max",
    location:"忠孝店｜飛輪教練",
    imgUrl: coachImgSecond
  },
  {
    coachId:3,
    coachName:"Sam",
    location:"忠孝店｜有氧教練",
    imgUrl: coachImgThird
  },
  {
    coachId:4,
    coachName:"Sandy",
    location:"中山店｜啞鈴教練",
    imgUrl: coachImgFourth
  },
  {
    coachId:5,
    coachName:"Cindy",
    location:"光復店｜核心訓練師",
    imgUrl: coachImgFifth
  },
  {
    coachId:6,
    coachName:"Tiffany",
    location:"忠孝店｜拳擊教練",
    imgUrl: coachImgSixth
  },
  {
    coachId:7,
    coachName:"Mandy",
    location:"忠孝店｜瑜伽平衡教練",
    imgUrl: coachImgSeventh
  }
];

function CoachSwiper() {


    
  return (
  <>
    <Swiper
            className="coach-swiper" // 專屬樣式覆蓋原生樣式
            modules={[Autoplay]}
            loop={true}
            slidesPerView={2}
            spaceBetween={10}
            breakpoints={{
                375: {
                slidesPerView: "auto", // 自動根據 slide 寬度
                spaceBetween: -120
                },
                576: {
                slidesPerView: "auto",
                spaceBetween: -150
                },
                992: {
                slidesPerView: "auto",
                spaceBetween: -200
                }
            }}
            autoplay={{
                delay: 3000, // 每 3 秒切換
                disableOnInteraction: false, // 使用者滑動後仍繼續自動播放
                pauseOnMouseEnter: true
            }}
            >
            {
                coachData.map((coach)=>{
                return (
                        <SwiperSlide key={coach.coachId}>
                            <img src={coach.imgUrl} alt={coach.coachName}/>
                            <div className="coach-name p-2 p-lg-6">
                                <p className="fs-lg-8 fw-bold text-gray-950 mb-1">{coach.location}</p>
                                <h5 className="fs-3 fw-bold text-primary-400">{coach.coachName}</h5>
                            </div>
                        </SwiperSlide>
                        );
                })
            } 
    </Swiper>
  </>);
}

export default CoachSwiper;