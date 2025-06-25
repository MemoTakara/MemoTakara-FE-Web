import "./index.css";
import google_icon from "@/assets/img/google_icon.png";
import { GithubFilled, LinkedinFilled } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <div className="footer_container">
      <div className="footer_bottom_row">
        <div className="footer_copyright">
          © Copyright{" "}
          <span style={{ fontStyle: "italic" }}>Dinh Thi Hong Phuc</span> 2025
        </div>

        <div className="footer_contact">
          {/* google */}
          <a href="mailto:phuchong292003@gmail.com">
            <img
              src={google_icon}
              alt="Google Icon"
              style={{
                width: "20px",
                height: "24px",
                paddingTop: "4px",
              }}
            />
          </a>

          {/* facebook */}
          <a
            href="https://www.facebook.com/cuhp293"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              style={{
                fontSize: "21px",
                color: "#1877F2",
                paddingLeft: "15px",
                paddingRight: "12px",
              }}
              icon={faFacebook}
            />
          </a>

          {/* github */}
          <a
            href="https://github.com/MemoTakara"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubFilled
              style={{
                fontSize: "22px",
                color: "#000",
              }}
            />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/%C4%91inh-th%E1%BB%8B-h%E1%BB%93ng-ph%C3%BAc-1a922a216/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinFilled
              style={{
                fontSize: "22px",
                color: "#2867B2",
                paddingLeft: "12px",
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
