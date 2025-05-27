import { useState } from "react";
import "./App.css";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { CaregiverList } from "./components/CaregiverList.jsx";
import MultiSelectDropdown from "./components/MultiSelectDropdown.jsx"; // 👈 새로 만든 컴포넌트 임포트

function App() {
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const handleSelect = (selectedKey) => {
    // 네비게이션 로직
  };

  // 필터 객체를 통합하여 CaregiverList에 전달할 수 있도록
  const currentFilters = {
    genders: selectedGenders,
    languages: selectedLanguages,
  };

  return (
    <>
      <p className="login">ログイン/サインイン</p>
      <div className="main_header">
        <h2 className="title">TOMONI</h2>
      </div>
      <Nav activeKey="1" onSelect={handleSelect} className="custom-nav">
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
        <div>
          <input
            className="main_search"
            type="text"
            placeholder=" 検索機能(地域) "
          />
          <select className="main_select">
            <option value="">地域を選択</option>
            <option value="tokyo">東京都</option>
            <option value="nagoya">名古屋市</option>
            <option value="osaka">大阪市</option>
            <option value="kyoto">京都市</option>
          </select>
        </div>
        <div className="main_button">
          <button>距離順</button>
          <button> 経歴順</button>
          <button>時給順</button>
          <button>オンライン</button>
          <button>気に入り</button>
          <div className="dropdown">
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
        </div>
        <h2>介護士を探す</h2>
        <CaregiverList currentFilters={currentFilters} />
      </div>
    </>
  );
}

export default App;
