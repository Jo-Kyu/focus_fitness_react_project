import { useRef } from "react";
import { Collapse } from "bootstrap";

function ProductDetailCollapse({ title, children, mb = "mb-3" }) {
  const productDetailCollapseRef = useRef(null);
  const productDetailCollapseRefIns = useRef(null);

  const toggle = () => {
    if (!productDetailCollapseRef.current) {
      productDetailCollapseRef.current = new Collapse(
        productDetailCollapseRefIns.current,
        {
          toggle: false,
        },
      );
    }
    productDetailCollapseRef.current.toggle();
  };

  return (
    <div
      className={`${mb} border border-secondary-600 border-radius-12 p-7 hover-effect`}
    >
      {/* 標題 */}
      <div>
        <h3 className="mb-0 d-flex">
          <button
            className="btn fs-7 p-0 text-gray-950 fw-bold flex-fill rounded-0 d-flex justify-content-between align-items-center default-focus-btn border-0"
            type="button"
            onClick={toggle}
          >
            {title}
            <span className="p-2 d-flex align-items-center">
              <svg
                className=""
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.29289 9.20711C3.90237 8.81658 3.90237 8.18357 4.29289 7.79304C4.68342 7.40252 5.31643 7.40252 5.70696 7.79304L11.9999 14.086L18.2929 7.79304C18.6834 7.40252 19.3164 7.40252 19.707 7.79304C20.0975 8.18357 20.0975 8.81658 19.707 9.20711L12.707 16.2071C12.3164 16.5976 11.6834 16.5976 11.2929 16.2071L4.29289 9.20711Z"
                  fill="white"
                />
              </svg>
            </span>
          </button>
        </h3>
      </div>
      {/* 內容 */}
      <div
        className="collapse mt-2 text-black"
        ref={productDetailCollapseRefIns}
      >
        {children}
      </div>
    </div>
  );
}

export default ProductDetailCollapse;
