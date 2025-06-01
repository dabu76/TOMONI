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

        const cityName = await reverseGeocode(lat, lng);
        setLocationInfo({
          city: cityName,
          coords: { lat, lng },
          isLoaded: true,
        });
      },
      () => {
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
