import { ThreeCircles } from "react-loader-spinner";

function Loading({ height = 100, width = 100, color = "#e1ff00" }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div>
        <ThreeCircles
          visible={true}
          height={height}
          width={width}
          color={color}
          ariaLabel="three-circles-loading"
        />
        <p className="mt-4">載入中，請稍後...</p>
      </div>
    </div>
  );
}

export default Loading;
