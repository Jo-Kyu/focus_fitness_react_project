function Map() {
  return (
    <>
      <div className="map">
        {/* 地點說明 */}
        <div className="location p-3 p-lg-9">
          <div className="mb-7 mb-lg-9">
            <p className="fs-8 fs-lg-7 fw-bold text-primary-400 mb-6 mb-lg-3">
              / Location /
            </p>
            <h5 className="fs-5 fs-lg-1 fw-bold text-gray-950">
              專注健身｜忠孝店
            </h5>
          </div>
          <div>
            <p className="fs-8 fs-lg-7 mb-2 mb-lg-6">
              <img
                className="map-icon"
                src="https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/cfe32d41cf4865ed773ce38aa3184880859dff69/assets/images/icons/ic_Phone.svg"
                alt="ic_Phone"
              />
              02-1888-2878 #9
            </p>
            <p className="fs-8 fs-lg-7 mb-2 mb-lg-6">
              <img
                className="map-icon"
                src="https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/cfe32d41cf4865ed773ce38aa3184880859dff69/assets/images/icons/ic_Mail.svg"
                alt="ic_Mail"
              />
              FocusFitness@gym.io
            </p>
            <p className="fs-8 fs-lg-7">
              <img
                className="map-icon"
                src="https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/cfe32d41cf4865ed773ce38aa3184880859dff69/assets/images/icons/ic_Map_Pin.svg"
                alt="ic_Map_Pin"
              />
              台北市中正區忠孝東路198巷10-2號 B1
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Map;
