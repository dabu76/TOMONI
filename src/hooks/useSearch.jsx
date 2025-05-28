import { useCallback, useState } from "react";

export function useSearch(onSearch) {
  const [search, setSearch] = useState("");

  const handleChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);
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
    search,
    setSearch,
    handleChange,
    handleKeyDown,
  };
}
