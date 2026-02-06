import Ellipse_2 from "../assets/images/index_page/光暈/Ellipse_2.svg";

function Glow({ position }) {
  return (
    <img className={`bg-glow ${position} z-n100`} src={Ellipse_2} alt="光暈" />
  );
}

export default Glow;
