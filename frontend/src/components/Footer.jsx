import React from "react";
import "../Footer.css";

function Footer() {
  return (
    <div className="footer-wrapper">
      <img className="footwave" src="/footer2.svg"></img> {/* 1000x70 */}
      <div className="container-fluid footer">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-0">
          <p className="col-md-4 mb-0 text-body-secondary footp">
            © 2025 TalpPont
            <br />
            <span className="developer">
              Full Stack fejlesztés: Machán Félix
            </span>
          </p>

          <a
            href="/"
            className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
            aria-label="Bootstrap"
          >
            <svg className="bi me-2" width="40" height="32" aria-hidden="true">
              <use xlinkHref="#bootstrap"></use>
            </svg>
          </a>

          <ul className="nav col-md-4 justify-content-end">
            <li className="nav-item">
              <a href="#" className="nav-link px-2 text-body-light footp">
                Kezdőlap
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link px-2 text-body-light footp">
                Árak
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link px-2 text-body-light footp">
                GY.I.K
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link px-2 text-body-light footp">
                Rólam
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
