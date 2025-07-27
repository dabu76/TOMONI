import { useEffect, useState, useMemo, useContext } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { HeartButton } from "./Heart.jsx";
import { usePagination } from "../hooks/usePagination.jsx";
import { calculateDistance } from "../hooks/geometry";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// 介護士一覧コンポーネント
export function CaregiverList({
  currentFilters,
  sortValue,
  userLocationLoaded,
  currentUserCoords,
  selectedCityName,
  setShowLoginModal, // ログインモーダルを開く関数（Appから受け取り）
  setPendingCaregiver, // 予約対象の介護士を保存する関数（Appから受け取り）
}) {
  const [allCaregivers, setAllCaregivers] = useState([]); // 全ての介護士データ
  const { user } = useContext(UserContext); // ユーザー情報（ログイン状態）
  const [dataLoading, setDataLoading] = useState(true); // ローディングフラグ
  const [hoveredId, setHoveredId] = useState(null); // ホバー中のカードID
  const [likedIds, setLikedIds] = useState(new Set()); // お気に入り状態
  const navigate = useNavigate();

  // お気に入りトグル処理
  const toggleLike = (caregiverId) => {
    const updatedSet = new Set(likedIds);
    updatedSet.has(caregiverId)
      ? updatedSet.delete(caregiverId)
      : updatedSet.add(caregiverId);
    setLikedIds(updatedSet);
  };

  // 「予約」ボタンが押されたときの処理
  const handleReserveClick = (e, caregiver) => {
    e.stopPropagation();
    if (!user || !user.userId) {
      alert("予約にはログインが必要です。");
      setPendingCaregiver(caregiver);
      setShowLoginModal(true);
      return;
    }
    navigate(`/detail/${caregiver.id}`, { state: { caregiver } });
  };

  // JSONLファイルから介護士データを取得
  useEffect(() => {
    setDataLoading(true);
    axios
      .get("/data/caregiver_profiles.jsonl")
      .then((res) => {
        const lines = res.data.split("\n").filter(Boolean);
        const parsed = lines
          .map((line, idx) => {
            try {
              return JSON.parse(line);
            } catch (err) {
              console.error(`Line ${idx + 1} JSON パースエラー`, err);
              return null;
            }
          })
          .filter(Boolean);
        setAllCaregivers(parsed);
      })
      .catch((err) => console.error("データ読み込みエラー:", err))
      .finally(() => setDataLoading(false));
  }, []);

  // ユーザーのお気に入り（favorite）を初期化
  useEffect(() => {
    if (user?.favorite) {
      setLikedIds(new Set(user.favorite));
    }
  }, [user]);

  // フィルター・距離・ソート条件を適用した介護士リストを生成
  const filteredCaregivers = useMemo(() => {
    let filtered = [...allCaregivers];
    if (currentFilters.genders?.length > 0) {
      filtered = filtered.filter((c) =>
        currentFilters.genders.includes(c.gender)
      );
    }
    if (currentFilters.languages?.length > 0) {
      filtered = filtered.filter(
        (c) =>
          c.languages &&
          currentFilters.languages.every((lang) => c.languages.includes(lang))
      );
    }
    if (selectedCityName) {
      filtered = filtered.filter((c) => c.city === selectedCityName);
    }
    if (currentUserCoords?.lat && currentUserCoords?.lng) {
      filtered = filtered.map((c) => ({
        ...c,
        distance:
          c.location?.lat && c.location?.lng
            ? calculateDistance(
                currentUserCoords.lat,
                currentUserCoords.lng,
                c.location.lat,
                c.location.lng
              )
            : null,
      }));
    }
    if (sortValue === "距離順") {
      filtered.sort((a, b) => {
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      });
    } else if (sortValue === "経歴順") {
      filtered.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    } else if (sortValue === "時給順") {
      filtered.sort(
        (a, b) =>
          (parseFloat(b.hourlyRate) || 0) - (parseFloat(a.hourlyRate) || 0)
      );
    } else if (sortValue === "オンライン") {
      filtered = filtered.filter((c) => c.available);
    } else if (sortValue === "気に入り") {
      filtered = user?.favorite
        ? filtered.filter((c) => user.favorite.includes(c.id))
        : [];
    }
    return filtered;
  }, [
    allCaregivers,
    currentFilters,
    currentUserCoords,
    sortValue,
    user,
    selectedCityName,
  ]);

  const {
    currentItems: caregiversToDisplay,
    currentPage,
    totalPages,
    visiblePageNumbers,
    goToPage,
    goToNextPageGroup,
    goToPrevPageGroup,
    hasPrevGroup,
    hasNextGroup,
  } = usePagination(filteredCaregivers, 9, 5);

  if (!userLocationLoaded && dataLoading) {
    return <p>位置情報と介護士データを読み込んでいます...</p>;
  }
  if (!userLocationLoaded) {
    return <p>現在の位置情報を確認中です。少々お待ちください...</p>;
  }
  if (dataLoading) {
    return <p>介護士のリストを読み込んでいます...</p>;
  }

  return (
    <Container>
      <Row>
        {caregiversToDisplay.length > 0 ? (
          caregiversToDisplay.map((c) => (
            <Col
              key={c.id}
              xs={12}
              sm={6}
              md={4}
              style={{ marginBottom: "20px" }}
            >
              <Card
                className="caregiver_card"
                style={{ width: "100%", padding: "0px", position: "relative" }}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user || !user.userId) {
                    alert("詳細を見るにはログインが必要です。");
                    setPendingCaregiver(c);
                    setShowLoginModal(true);
                    return;
                  }
                  navigate(`/detail/${c.id}`, { state: { caregiver: c } });
                }}
              >
                <Card.Img
                  style={{ width: "100%", height: "180px" }}
                  variant="top"
                  src={c.image || "/placeholder-image.png"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.png";
                  }}
                />
                <Card.Body>
                  <Card.Title>{c.name || "名前未設定"}</Card.Title>
                  <Card.Text>
                    {c.age ? `${c.age}歳` : "年齢情報なし"} / 経験:{" "}
                    {c.experience != null ? `${c.experience}年` : "情報なし"} /
                    時給: ¥{c.hourlyRate || "情報なし"}
                    <br />
                    {c.distance != null
                      ? `現在地からの距離: ${c.distance.toFixed(2)} km`
                      : "距離情報なし"}
                    <br />
                    {c.available ? "勤務可能" : "現在非対応"}
                  </Card.Text>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <HeartButton
                      caregiverId={c.id}
                      liked={likedIds.has(c.id)}
                      onToggle={toggleLike}
                    />
                    <Button
                      variant="primary"
                      onClick={(e) => handleReserveClick(e, c)}
                    >
                      予約
                    </Button>
                  </div>
                </Card.Body>
                {hoveredId === c.id && (
                  <div className="card_hover_detail">
                    <p>プロフィール: {c.profile}</p>
                    <p>
                      言語: {c.languages?.map((l) => langMap[l]).join(" / ")}
                    </p>
                    <p>スケジュール:</p>
                    <ul style={{ paddingLeft: "20px" }}>
                      {c.schedule?.map((s, i) => (
                        <li key={i}>
                          {s.date} {s.time}
                        </li>
                      ))}
                    </ul>
                    <HeartButton
                      caregiverId={c.id}
                      liked={likedIds.has(c.id)}
                      onToggle={toggleLike}
                    />
                    <Button
                      onClick={(e) => handleReserveClick(e, c)}
                      variant="primary"
                    >
                      予約
                    </Button>
                  </div>
                )}
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>条件に合う介護士が見つかりませんでした。</p>
          </Col>
        )}
      </Row>
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            userSelect: "none",
          }}
        >
          {hasPrevGroup && (
            <Button
              variant="outline-primary"
              onClick={goToPrevPageGroup}
              style={{ margin: "0 5px" }}
            >
              {" <"}
            </Button>
          )}
          {visiblePageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "primary" : "outline-primary"}
              onClick={() => goToPage(pageNum)}
              style={{ margin: "0 5px" }}
            >
              {pageNum}
            </Button>
          ))}
          {hasNextGroup && (
            <Button
              variant="outline-primary"
              onClick={goToNextPageGroup}
              style={{ margin: "0 5px" }}
            >
              {" >"}
            </Button>
          )}
        </div>
      )}
    </Container>
  );
}

// 言語表示用マッピング
const langMap = {
  japanese: "日本語",
  english: "英語",
  korean: "韓国語",
};
