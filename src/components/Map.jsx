function Map() {
  return (
    <>
      <div className="map">
        {/* Ｇoogle Map */}
        <iframe
          className="map-iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.7824726800914!2d121.53686367617739!3d25.041455177811592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abd798cd4c4d%3A0x148f7ca02784ee76!2zMTA26Ie65YyX5biC5aSn5a6J5Y2A5b-g5a2d5p2x6LevMTk46Jmf!5e0!3m2!1szh-TW!2stw!4v1774158979586!5m2!1szh-TW!2stw"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        >
        </iframe>
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
