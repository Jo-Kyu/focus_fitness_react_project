// 匯入Hook
import { useEffect, useRef } from "react";

// 匯入套件
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

// 匯入元件
import ProductsCarouselCards from "../components/ProductsCarouselCards.jsx";
import EvaluateCarouselCards from "../components/EvaluateCarouselCards.jsx";

function ProductsCardsCarousel({ cardsCarouselProducts }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [prevRef, nextRef]);

  return (
    <>
      <Swiper
        className="d-flex flex-nowrap scroll"
        modules={[Navigation, Pagination]}
        slidesPerView="auto"
        slidesPerGroup={1}
        navigation
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
      >
        {cardsCarouselProducts.map((cardsCarouselProduct) => (
          <SwiperSlide
            className="card me-2 me-md-6 rounded-3 bg-blue-600 max-w-210 max-w-md-318 flex-grow-0 flex-shrink-0 hover-effect-3 overflow-hidden"
            key={cardsCarouselProduct.id}
          >
            {cardsCarouselProduct?.title ? (
              <ProductsCarouselCards product={cardsCarouselProduct} />
            ) : (
              <EvaluateCarouselCards evaluateCustomer={cardsCarouselProduct} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 輪播按鈕 */}
      <div className="position-absolute top-lg-50 left--70 bottom--8 d-flex justify-content-between w-100">
        <button
          ref={prevRef}
          type="button"
          className="btn bg-white-opacity-20 p-6 rounded-circle d-flex align-items-center justify-content-center translate-middle-y position-absolute left-lg--70 hover-effect-3  d-none d-lg-flex z-100"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.52794 2.86225C9.78829 2.6019 10.2103 2.6019 10.4707 2.86225C10.731 3.1226 10.731 3.54461 10.4707 3.80496L6.27534 8.00028L10.4707 12.1956C10.731 12.4559 10.731 12.8779 10.4707 13.1383C10.2103 13.3986 9.78829 13.3986 9.52794 13.1383L4.86128 8.47163C4.60093 8.21128 4.60093 7.78927 4.86128 7.52892L9.52794 2.86225Z"
              fill="white"
            />
          </svg>
        </button>
        <button
          ref={nextRef}
          type="button"
          className="btn bg-white-opacity-20 p-6 rounded-circle d-flex align-items-center justify-content-center translate-middle-y position-absolute right-lg--70 end-0 hover-effect-3  d-none d-lg-flex z-100"
        >
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
        </button>
      </div>
    </>
  );
}

export default ProductsCardsCarousel;
