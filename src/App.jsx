import { useState } from "react";
import "./App.css";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { CaregiverList } from "./components/CaregiverList.jsx";
import MultiSelectDropdown from "./components/MultiSelectDropdown.jsx";
import { useSearch } from "./hooks/useSearch.jsx";
import { useCurrentLocation } from "./hooks/useCurrentLocation.jsx";
function App() {
  const onSearch = (keyword) => {
    console.log("検索", keyword);
  };

  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const { search, setSearch, handleChange, handleKeyDown } =
    useSearch(onSearch);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(0);
  useCurrentLocation((cityName, coords) => {
    setSearch(cityName);
    setCoords(coords);
  });
  const handleSelect = (selectedKey) => {};
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
            type="text"
            className="main_search"
            placeholder="検索機能(地域)"
            value={search}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <select
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="main_select"
          >
            <option value="">地域を選択</option>
            <option value="東京都">東京都</option>
            <option value="名古屋市">名古屋市</option>
            <option value="大阪市">大阪市</option>
            <option value="京都市">京都市</option>
          </select>
          <button className="search_Btn" onClick={() => onSearch(search)}>
            検索
          </button>
        </div>
        <div className="main_button">
          <button>距離順</button>
          <button> 経歴順</button>
          <button>時給順</button>
          <button>オンライン</button>
          <button>気に入り</button>
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
        <h2>介護士を探す</h2>
        <CaregiverList
          coords={coords}
          currentFilters={currentFilters}
          search={search}
        />
      </div>
    </>
  );
}

export default App;
