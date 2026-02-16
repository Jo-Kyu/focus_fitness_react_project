import { useContext } from "react";

// 匯入元件
// 收藏共用狀態
import { WishlistContext } from "../context/WishlistContext.js";
// 登入共用狀態
import { LoginAuthContext } from "../context/LoginAuthContext.js";

// 吐司
import toast from "react-hot-toast";
// 提示框
import Swal from "sweetalert2";

function FavoriteProductCards({ product }) {
  // 收藏商品按鈕
  // 收藏共用狀態解構
  const { wishlist, toggleWishlistItem } = useContext(WishlistContext);
  const isFavorite = wishlist[product.id];
  // 登入共用狀態解構
  const { isAuth } = useContext(LoginAuthContext);

  return (
    <div className="position-relative bg-blue-600 rounded-2">
      {/* 卡片圖片 */}
      <div>
        <div className="overflow-hidden rounded-2 border-bottom-right-radius-0 border-bottom-leftt-radius-0">
          <img
            src={product.imageUrl}
            className="card-img-top h-210"
            alt={product.title}
          />
        </div>
        {/* 優惠標籤、收藏按鈕 */}
        <div className="d-flex justify-content-between position-absolute top-0 w-100">
          {/* 優惠標籤 */}
          <div className="pt-6 ps-6">
            {product.is_hot && (
              <span className="badge py-1 px-6 bg-danger-normal fs-8 text-white fw-bold me-2">
                熱銷
              </span>
            )}
            {product.is_new && (
              <span className="badge py-1 px-6 bg-primary-400 fs-8 text-blue-900 fw-bold">
                最新上市
              </span>
            )}
          </div>

          {/* 收藏按鈕*/}
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
                  iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#e1ff00" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
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
                });
                console.log(isAuth);
                console.log("未登入");
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

      {/* 商品資訊 */}
      <div className="card-body py-md-6 p-2 h-100">
        {/* 標題 */}
        <div className="mb-2">
          <h5 className="card-title mb-0 fs-8 fs-md-6 text-gray-950 fw-bold text-truncate">
            {product.title}
          </h5>
        </div>
        {/* 價格、原價 */}
        <div className="d-flex mb-6">
          <div>
            <p className="card-text fs-8 fs-md-6 text-gray-950 fw-bold">
              <span className="me-1">{product.price}</span>
              <span className="fs-8 text-gray-500 fw-bold text-decoration-line-through">
                {product.origin_price}
              </span>
            </p>
          </div>
          {/* 折扣 */}
          <span className="badge fs-9 fs-md-8 text-warning-normal fw-bold border rounded-3 border-warning-normal ms-auto">
            {product.price > 0
              ? `${Math.round((product.price / product.origin_price) * 100)}折`
              : "免費"}
          </span>
        </div>
        {/* 按鈕 */}
        <div>
          <button
            type="button"
            className="mb-6 mb-md-0 me-md-6 px-8 py-1 py-md-2 fill-btn btn fs-9 fw-bold  flex-fill border-radius-12 w-100"
          >
            立即購物
          </button>
        </div>
      </div>
    </div>
  );
}

export default FavoriteProductCards;
