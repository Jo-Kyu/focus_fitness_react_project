// 外部資源
import { useEffect, useState } from "react";
import axios from "axios";

// 內部資源
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
<<<<<<< HEAD
=======
// import "./App.css";
>>>>>>> ee912057f3092d754edfe2a3360593ff57f09ea9

// 測試axios(已測試，可用)
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await axios.get("https://randomuser.me/api/");
      console.log(res);
    })();
  }, []);

  return (
    <>
      {/* 測試bs5(已測試，可用) */}
      <button
        type="button"
        className="btn btn-primary-500"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {/* 測試SCSS(已測試，可用) */}
        <button
          className="btn btn-primary-500"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
