function Star({ size }) {
  return (
    <span className="p-12 text-warning-normal d-flex align-items-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 15.9119L3.81935 19.1577L5 12.2829L0 7.41462L6.90967 6.41236L10 0.157715L13.0903 6.41236L20 7.41462L15 12.2829L16.1807 19.1577L10 15.9119Z"
          fill="#FFD416"
        />
      </svg>
    </span>
  );
}

export default Star;
