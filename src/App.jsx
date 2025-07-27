import { useEffect, useState } from "react";
import "./App.css";
import { CaregiverList } from "./components/CaregiverList.jsx";
import MultiSelectDropdown from "./components/MultiSelectDropdown.jsx";
import { useCurrentLocation } from "./hooks/useCurrentLocation.jsx";
import { LocationSelect } from "./components/LocationSelect.jsx";
import { useNavigate } from "react-router-dom";
import LoginModal from "./components/LoginModal"; // ログインモーダル

const CITIES = ["東京都", "名古屋市", "大阪市", "京都市"];
const API_BASE = "http://localhost:5238/api";

function App() {
  const navigate = useNavigate();

  // 現在位置（市区町村、緯度経度）を取得するカスタムフック
  const {
    city: currentUserCity,
    coords: currentUserCoords,
    isLoaded: userLocationLoaded,
  } = useCurrentLocation();

  // 絞り込み・ソート・都市選択の状態管理
  const [sortValue, setSortValue] = useState("");
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [autoSetDone, setAutoSetDone] = useState(false);

  // ログインモーダル関連の状態管理
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCaregiver, setPendingCaregiver] = useState(null); // 予約しようとした介護士を一時保存

  // 位置情報が取得できたら、自動で都市を設定する
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

  // 現在のフィルター条件をオブジェクトとしてまとめる
  const currentFilters = {
    genders: selectedGenders,
    languages: selectedLanguages,
  };

  // ログイン成功時：モーダルを閉じて予約画面に遷移
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (pendingCaregiver) {
      navigate(`/detail/${pendingCaregiver.id}`, {
        state: { caregiver: pendingCaregiver },
      });
      setPendingCaregiver(null);
    }
  };

  return (
    <>
      <div className="main_wrapper">
        {/* 都市選択コンポーネント */}
        <LocationSelect
          selectedCity={selectedCityName}
          setSelectedCity={setSelectedCityName}
          cities={CITIES}
        />

        {/* ソートボタン・フィルタードロップダウン */}
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

        {/* 介護士リストを表示するメインコンポーネント */}
        <CaregiverList
          sortValue={sortValue}
          currentFilters={currentFilters}
          userLocationLoaded={userLocationLoaded}
          currentUserCoords={currentUserCoords}
          selectedCityName={selectedCityName}
          setShowLoginModal={setShowLoginModal} // ログインモーダルを開くための関数を渡す
          setPendingCaregiver={setPendingCaregiver} // 予約対象の介護士情報を保存する関数を渡す
        />
      </div>

      {/* ログインモーダル（必要時のみ表示） */}
      {showLoginModal && (
        <LoginModal
          onSuccess={handleLoginSuccess} // ログイン成功時の処理（予約画面へ）
          onClose={() => setShowLoginModal(false)} // 単純にモーダルを閉じる処理
        />
      )}
    </>
  );
}

export default App;
