import { useCallback, useState } from "react";

export function useSearch(onSearch) {
  const [search, setSearch] = useState("");

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (onSearch && typeof onSearch === "function") {
          onSearch(search);
        }
      }
    },
    [search, onSearch]
  );
  return {
    setSearch,
  };
}
