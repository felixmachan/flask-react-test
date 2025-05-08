import React from "react";
import "../Footer.css";

function Footer() {
  return (
    <div className="footer-wrapper">
      <img class="footwave" src="/footer.svg"></img> {/* 1000x70 */}
      <div class="container-fluid footer">
        <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-0">
          <p class="col-md-4 mb-0 text-body-secondary footp">© 2025 TalpPont</p>

          <a
            href="/"
            class="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
            aria-label="Bootstrap"
          >
            <svg class="bi me-2" width="40" height="32" aria-hidden="true">
              <use xlink:href="#bootstrap"></use>
            </svg>
          </a>

          <ul class="nav col-md-4 justify-content-end">
            <li class="nav-item">
              <a href="#" class="nav-link px-2 text-body-light footp">
                Kezdőlap
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link px-2 text-body-light footp">
                Árak
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link px-2 text-body-light footp">
                GY.I.K
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link px-2 text-body-light footp">
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
