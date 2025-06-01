import { useState, useEffect } from "react";
import "./App.css";
import Nav from "react-bootstrap/Nav";
import { CaregiverList } from "./components/CaregiverList.jsx";
import MultiSelectDropdown from "./components/MultiSelectDropdown.jsx";
import { useCurrentLocation } from "./hooks/useCurrentLocation.jsx";
import { LocationSelect } from "./components/LocationSelect.jsx";
import { calculateDistance } from "./hooks/geometry";

// 都市リストの定義
const CITIES = [
  { name: "東京都", lat: 35.6895, lng: 139.6917 },
  { name: "名古屋市", lat: 35.1815, lng: 136.9066 },
  { name: "大阪市", lat: 34.6937, lng: 135.5023 },
  { name: "京都市", lat: 35.0116, lng: 135.7681 },
  // 必要に応じて他の都市を追加
];

function App() {
  const {
    city: currentUserCity,
    coords: currentUserCoords,
    isLoaded: userLocationLoaded,
  } = useCurrentLocation();
  const [sortValue, setSortValue] = useState(""); // ソート基準
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [selectedCityName, setSelectedCityName] = useState(""); // 選択された都市名
  const [selectedCityCoords, setSelectedCityCoords] = useState(null); // 選択された都市の座標
  const [distanceToSelectedCity, setDistanceToSelectedCity] = useState(null); // 現在地から選択都市までの距離

  // 初回読み込み時に現在地の都市を選択状態に設定
  useEffect(() => {
    if (userLocationLoaded && currentUserCity && !selectedCityName) {
      setSelectedCityName(currentUserCity);
    }
  }, [userLocationLoaded, currentUserCity]);

  // 選択された都市名が変更されたら座標を更新
  useEffect(() => {
    if (selectedCityName) {
      const cityData = CITIES.find((c) => c.name === selectedCityName);
      if (cityData) {
        setSelectedCityCoords({ lat: cityData.lat, lng: cityData.lng });
      } else {
        setSelectedCityCoords(null); // 「地域を選択」または一致する都市がない場合
      }
    } else {
      setSelectedCityCoords(null); // 都市未選択時
    }
  }, [selectedCityName]);

  // 現在地または選択都市の座標が変更されたら距離を再計算
  useEffect(() => {
    if (currentUserCoords && selectedCityCoords) {
      const dist = calculateDistance(
        currentUserCoords.lat,
        currentUserCoords.lng,
        selectedCityCoords.lat,
        selectedCityCoords.lng
      );
      setDistanceToSelectedCity(dist);
    } else {
      setDistanceToSelectedCity(null); // 座標が揃っていない場合は距離計算しない
    }
  }, [currentUserCoords, selectedCityCoords]);

  const currentFilters = {
    genders: selectedGenders,
    languages: selectedLanguages,
  };

  return (
    <>
      <p className="login">ログイン / サインイン</p>
      <div className="main_header">
        <h2 className="title">TOMONI</h2>
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
          cities={CITIES} // 都市リストを渡す
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
        <h2>介護士を探す</h2>
        <CaregiverList
          sortValue={sortValue}
          fixedCoords={selectedCityCoords}
          currentFilters={currentFilters}
          userLocationLoaded={userLocationLoaded}
          currentUserCoords={currentUserCoords}
        />
      </div>
    </>
  );
}

export default App;
