import { useEffect, useState } from "react";
import "./App.css";
import Nav from "react-bootstrap/Nav";
import { CaregiverList } from "./components/CaregiverList.jsx";
import MultiSelectDropdown from "./components/MultiSelectDropdown.jsx";
import { useCurrentLocation } from "./hooks/useCurrentLocation.jsx";
import { LocationSelect } from "./components/LocationSelect.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Signup from "./page/Signup.jsx";
import LoginModal from "./components/LoginModal";

const CITIES = ["東京都", "名古屋市", "大阪市", "京都市"];

function App() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/Signup");
  };
  const {
    city: currentUserCity,
    coords: currentUserCoords,
    isLoaded: userLocationLoaded,
  } = useCurrentLocation();

  const [sortValue, setSortValue] = useState("");
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [autoSetDone, setAutoSetDone] = useState(false);
  // ログインモーダル表示用の状態
  const [showLoginModal, setShowLoginModal] = useState(false);
  useEffect(() => {
    if (
      !autoSetDone &&
      userLocationLoaded &&
      currentUserCity &&
      selectedCityName === ""
    ) {
      setSelectedCityName(currentUserCity);
      setAutoSetDone(true);
    }
  }, [userLocationLoaded, currentUserCity, selectedCityName, autoSetDone]);

  const currentFilters = {
    genders: selectedGenders,
    languages: selectedLanguages,
  };

  return (
    <>
      <p className="login">
        <span className="login_btn" onClick={() => setShowLoginModal(true)}>
          <FontAwesomeIcon icon={faRightToBracket} />
        </span>
        <span
          className="member_btn"
          onClick={() => navigate("/Signup")}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faUserPlus} />
        </span>
      </p>
      {/*// ログインボタンを押すとモーダルを表示
       */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)}>
          <form className="login_form">
            <h2>ログイン</h2>
            <input
              className="login_input"
              type="text"
              placeholder="メールアドレス"
            />
            <input
              className="login_input"
              type="password"
              placeholder="パスワード"
            />
            <button className="login_btn2" type="submit">
              ログイン
            </button>
          </form>
        </LoginModal>
      )}

      <div className="main_header">
        <h2 className="title">
          <Link to="/">TOMONI</Link>
        </h2>
      </div>
      <Nav activeKey="1" className="custom-nav">
        <Nav.Item>
          <Nav.Link eventKey="1" href="#/search">
            介護士を探す
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="2" href="#/history">
            依頼履歴
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="3" href="#/mypage">
            アカウント
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="main_wrapper">
        <LocationSelect
          selectedCity={selectedCityName}
          setSelectedCity={setSelectedCityName}
          cities={CITIES}
        />

        <div className="main_button">
          <button onClick={() => setSortValue("距離順")}>距離順</button>
          <button onClick={() => setSortValue("経歴順")}>経歴順</button>
          <button onClick={() => setSortValue("時給順")}>時給順</button>
          <button onClick={() => setSortValue("オンライン")}>オンライン</button>
          <button onClick={() => setSortValue("気に入り")}>気に入り</button>

          <MultiSelectDropdown
            title="性別"
            options={[
              { label: "男性", value: "male" },
              { label: "女性", value: "female" },
            ]}
            selectedValues={selectedGenders}
            onValueChange={setSelectedGenders}
          />

          <MultiSelectDropdown
            title="言語"
            options={[
              { label: "日本語", value: "japanese" },
              { label: "英語", value: "english" },
              { label: "韓国語", value: "korean" },
            ]}
            selectedValues={selectedLanguages}
            onValueChange={setSelectedLanguages}
          />
        </div>

        <h2 className="h2_class">介護士を探す</h2>

        <CaregiverList
          sortValue={sortValue}
          currentFilters={currentFilters}
          userLocationLoaded={userLocationLoaded}
          currentUserCoords={currentUserCoords}
          selectedCityName={selectedCityName}
        />
      </div>
    </>
  );
}

export default App;
