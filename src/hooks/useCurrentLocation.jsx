<<<<<<< HEAD
import { useEffect } from "react";

export function useCurrentLocation(callback) {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const cityName = await reverseGeocode(lat, lng);
        callback(cityName, { lat, lng }); // 都市と座標を渡して距離計算をする
      },
      () => {
        // もし位置情報をもらえなかったら名古屋
        callback("名古屋市", null);
      }
    );
  }, []);
}

// 逆ジオコーディング:緯度/経度→都市名
async function reverseGeocode(lat, lng) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ja&key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }`
  );

  const data = await response.json();
  const result = data.results?.[0];
  if (!result) return "";

  const city = result.address_components.find((c) =>
    c.types.includes("locality")
  );
  return city?.long_name || "";
}
=======
import { useEffect } from "react";

export function useCurrentLocation(setSearch) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  console.log(apiKey);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        console.log("位置情報:", lat, lng);

        const cityName = await reverseGeocode(lat, lng);
        console.log("都市:", cityName);
        setSearch(cityName);
      },
      async () => {
        // もし位置情報をもらえなかったら名古屋
        setSearch("名古屋市");
      }
    );
  }, []);
}

// 逆ジオコーディング:緯度/経度→都市名
async function reverseGeocode(lat, lng) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ja&key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }`
  );

  const data = await response.json();
  const result = data.results?.[0];
  if (!result) return "";

  const city = result.address_components.find((c) =>
    c.types.includes("locality")
  );
  return city?.long_name || "";
}
>>>>>>> main
