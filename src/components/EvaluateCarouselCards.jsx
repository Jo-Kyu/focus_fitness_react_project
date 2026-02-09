// 匯入套件

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// 匯入元件
import Star from "./Star.jsx";

function EvaluateCarouselCards({ evaluateCustomer }) {
  return (
    <div className="p-3">
      {/* 卡片標題 */}
      <div className="mb-1 mb-md-6 d-flex align-items-center">
        <div className="me-6">
          <img
            className="max-w-36 max-w-md-40"
            src={evaluateCustomer.img}
            alt="客戶照片"
          />
        </div>
        <div>
          <h3 className="mb-0 fs-8 fs-md-7 text-white fw-bold">
            {evaluateCustomer.name}
          </h3>
        </div>
      </div>
      {/* 卡片評價 */}
      {/* 星星符號 */}
      <span className="mb-1 mb-md-6 d-flex align-items-center">
        {/* 星星符號，電腦板顯示 */}
        <span className="d-flex align-items-center d-none d-md-flex">
          <span className="d-flex align-items-center d-none d-md-flex">
            {[...Array(5)].map((_, index) => (
              <Star key={index} size={20} />
            ))}
          </span>
        </span>
        {/* 星星符號，手機板顯示 */}
        <span className="d-flex align-items-center d-md-none">
          <span className="d-flex align-items-center d-md-none">
            {[...Array(5)].map((_, index) => (
              <Star key={index} size={16} />
            ))}
          </span>
        </span>
      </span>
      {/* 卡片文字 */}
      <div className="card-body p-0">
        <p className="card-text mb-0 fs-9 fs-md-8 text-gray-200">
          {evaluateCustomer.content}
        </p>
      </div>
    </div>
  );
}

export default EvaluateCarouselCards;
