import { useEffect, useState } from "react";

export function useCurrentLocation() {
  const [locationInfo, setLocationInfo] = useState({
    city: "",
    coords: null,
    isLoaded: false,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const apiKey = import.meta.env.VITE_Maps_API_KEY;

        if (!apiKey) {
          console.error("Google Maps API key is missing. VITE_Maps_API_KEY");
          setLocationInfo({
            city: "APIキー未設定",
            coords: { lat, lng },
            isLoaded: true,
          });
          return;
        }

        const cityName = await reverseGeocode(lat, lng, apiKey);
        setLocationInfo({
          city: cityName,
          coords: { lat, lng },
          isLoaded: true,
        });
      },
      () => {
        console.warn("現在地の取得に失敗しました。東京をデフォルトとします。");
        setLocationInfo({
          city: "東京都",
          coords: { lat: 35.6895, lng: 139.6917 },
          isLoaded: true,
        });
      }
    );
  }, []);

  return locationInfo;
}

async function reverseGeocode(lat, lng, apiKey) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ja&key=${apiKey}`
    );
    if (!response.ok) {
      console.error(
        "Geocoding API request failed:",
        response.status,
        response.statusText
      );
      const errorData = await response.json();
      console.error("Geocoding API error details:", errorData);
      return "都市情報なし";
    }
    const data = await response.json();
    if (data.status !== "OK") {
      console.error("Geocoding API error:", data.status, data.error_message);
      return "都市情報なし";
    }
    const result = data.results?.[0];
    if (!result) return "都市情報なし";

    const cityComponent = result.address_components.find((c) =>
      c.types.includes("locality")
    );
    const prefectureComponent = result.address_components.find((c) =>
      c.types.includes("administrative_area_level_1")
    );
    return (
      cityComponent?.long_name ||
      prefectureComponent?.long_name ||
      "都市情報なし"
    );
  } catch (error) {
    console.error("Error during reverse geocoding:", error);
    return "都市情報取得エラー";
  }
}
