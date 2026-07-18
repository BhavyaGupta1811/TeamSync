import { FaSpinner } from "react-icons/fa";

import "../styles/Loader.css";

function Loader() {
  return (
    <div className="loader-container">
      <FaSpinner className="loader-icon" />
    </div>
  );
}

export default Loader;
