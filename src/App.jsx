import { useEffect, useState } from "react";
import "./App.css";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { CaregiverList } from "./components/CaregiverList.jsx";
import MultiSelectDropdown from "./components/MultiSelectDropdown.jsx";
import { useSearch } from "./hooks/useSearch.jsx";
import { useCurrentLocation } from "./hooks/useCurrentLocation.jsx";
import { LocationSelect } from "./components/LocationSelect.jsx";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/data/user_profile.json");
        setUser(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("データ取得エラー:", err);
      }
    };

    fetchUser();
  }, []);
  const onSearch = (keyword) => {
    console.log("検索", keyword);
  };
  const [sortValue, setSortValue] = useState("");
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const { search, setSearch } = useSearch(onSearch);
  const [coords, setCoords] = useState(0);
  useCurrentLocation((cityName, coords) => {
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
          <LocationSelect
            coords={coords}
            setCoords={setCoords}
            setSearch={setSearch}
          />
        </div>
        <div className="main_button">
          <button onClick={() => setSortValue("距離順")}>距離順</button>
          <button onClick={() => setSortValue("経歴順")}> 経歴順</button>
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
        <h2>介護士を探す</h2>
        <CaregiverList
          sortValue={sortValue}
          coords={coords}
          currentFilters={currentFilters}
        />
      </div>
    </>
  );
}

export default App;
