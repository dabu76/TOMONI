import { useEffect, useState } from "react";

// プルダウンで選べる都市の一覧（基準地点として使用）
const CITIES = [
  { name: "東京都", lat: 35.6895, lng: 139.6917 },
  { name: "名古屋市", lat: 35.1815, lng: 136.9066 },
  { name: "大阪市", lat: 34.6937, lng: 135.5023 },
  { name: "京都市", lat: 35.0116, lng: 135.7681 },
];
//緯度と経度そして30kmまでの値を入れる
function getNearestCity(lat, lng, thresholdKm = 30) {
  //地球の半径
  const R = 6371;
  //toRadとして角度をradianに変換
  const toRad = (deg) => (deg * Math.PI) / 180;
  //一番近い都市
  let nearest = null;
  //一番近い距離先には全ての都市より無条件大きくするために無限にする
  let minDist = Infinity;
  //各都市を今ユーザーがいる緯度と経度にして計算
  for (let city of CITIES) {
    const dLat = toRad(city.lat - lat);
    const dLng = toRad(city.lng - lng);
    //ハーバーサイン公式を利用して2地点の距離計算
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat)) *
        Math.cos(toRad(city.lat)) *
        Math.sin(dLng / 2) ** 2;
    //aとcは中間段階
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // 最終的に dist は現在地と都市との距離（キロメートル単位）
    const dist = R * c;
    //一番近い都市を半単今計算したdistが今までに一番近いし30km以下ならその都市を設定
    if (dist < minDist && dist <= thresholdKm) {
      minDist = dist;
      nearest = city;
    }
  }

  return nearest;
}
//propsに貰った変数として
export function LocationSelect({ coords, setCoords, setSearch }) {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    //もしcomponentsがmountした時位置情報がなかったら今の位置情報を取る
    if (!coords) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords({ lat, lng });
          //位置情報を関数にいれて都市を貰う
          const nearest = getNearestCity(lat, lng);
          if (nearest) {
            setSelected(nearest.name);
            setSearch(nearest.name);
            //もしなかったら""
          } else {
            setSelected("");
            setSearch("");
          }
        },
        // 位置情報が取得できなかった場合、東京をデフォルトとして設定
        () => {
          setCoords({ lat: 35.6895, lng: 139.6917 });
          setSelected("東京");
          setSearch("東京");
        }
      );
    }
  }, [coords, setCoords, setSearch]);
  // セレクトボックスの選択が変更されたときに実行される処理
  const handleChange = (e) => {
    const selectedName = e.target.value;
    setSelected(selectedName);
    setSearch(selectedName);

    const city = CITIES.find((c) => c.name === selectedName);
    if (city) setCoords({ lat: city.lat, lng: city.lng });
  };

  return (
    <select onChange={handleChange} value={selected} className="main_select">
      <option value="">地域を選択</option>
      {CITIES.map((c) => (
        <option key={c.name} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
