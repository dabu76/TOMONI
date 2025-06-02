import React from "react";

export function LocationSelect({ selectedCity, setSelectedCity, cities }) {
  const handleChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <select
      onChange={handleChange}
      value={selectedCity}
      className="main_select"
    >
      <option value="">地域を選択</option>{" "}
      {cities.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
