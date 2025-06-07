import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { HeartButton } from "./Heart.jsx";
import { usePagination } from "../hooks/usePagination.jsx";
import { calculateDistance } from "../hooks/geometry";
import { useNavigate } from "react-router-dom";

export function CaregiverList({
  currentFilters,
  sortValue,
  userLocationLoaded,
  currentUserCoords,
  selectedCityName,
}) {
  const [allCaregivers, setAllCaregivers] = useState([]);
  const [user, setUser] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  // ホバー時に詳細情報を表示する用の状態管理（個別カードごとに）
  const [hoveredId, setHoveredId] = useState(null);
  // 介護士カードをリストで表示する（map処理用）
  const langMap = {
    japanese: "日本語",
    english: "英語",
    korean: "韓国語",
  };
  const navigate = useNavigate();
  const handleCardClick = (caregiver) => {
    navigate(`/detail/${caregiver.id}`, { state: { caregiver } });
  };
  // ハート同期化するための変数
  const [likedIds, setLikedIds] = useState(new Set());
  const toggleLike = (caregiverId) => {
    const updatedSet = new Set(likedIds);
    if (updatedSet.has(caregiverId)) {
      updatedSet.delete(caregiverId);
    } else {
      updatedSet.add(caregiverId);
    }
    setLikedIds(updatedSet);

    // user.favorite も更新（必要ならバックエンドにも送信）
    user.favorite = [...updatedSet];
  };

  useEffect(() => {
    setDataLoading(true);
    Promise.all([
      axios.get("/data/caregiver_profiles.jsonl"),
      axios.get("/data/user_profile.json"),
    ])
      .then(([caregiversRes, userRes]) => {
        const lines = caregiversRes.data.split("\n").filter(Boolean);
        const parsedCaregivers = lines
          .map((line, index) => {
            try {
              return JSON.parse(line);
            } catch (err) {
              console.error(`Line ${index + 1} JSON パシフィックエラー:`, err);
              return null;
            }
          })
          .filter(Boolean);
        setAllCaregivers(parsedCaregivers);
        setUser(userRes.data);
      })
      .catch((err) => {
        console.error("データエラー:", err);
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, []);
  // user情報が読み込まれたら、お気に入りIDをSetに変換して保存
  useEffect(() => {
    if (user && Array.isArray(user.favorite)) {
      setLikedIds(new Set(user.favorite));
    }
  }, [user]);
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

    if (currentUserCoords?.lat != null && currentUserCoords?.lng != null) {
      filtered = filtered.map((c) => {
        if (c.location?.lat != null && c.location?.lng != null) {
          return {
            ...c,
            distance: calculateDistance(
              currentUserCoords.lat,
              currentUserCoords.lng,
              c.location.lat,
              c.location.lng
            ),
          };
        }
        return { ...c, distance: null };
      });
    } else {
      filtered = filtered.map((c) => ({ ...c, distance: null }));
    }

    if (sortValue === "距離順") {
      filtered.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
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
      if (user && Array.isArray(user.favorite)) {
        filtered = filtered.filter((c) => user.favorite.includes(c.id));
      } else {
        filtered = [];
      }
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
                // ホバーしたときに該当のc.idを記録
                onMouseEnter={() => setHoveredId(c.id)}
                // ホバーが外れたらIDをリセット
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleCardClick(c)}
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
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/*お気に入りボタン（ハート）コンポーネントユーザーが他の介護士を「お気に入り」に追加・削除するためのUI */}
                    <HeartButton
                      caregiverId={c.id}
                      liked={likedIds.has(c.id)}
                      onToggle={toggleLike}
                    />
                    <Button variant="primary">予約</Button>
                  </div>
                </Card.Body>

                {/* hoveredIdとc.idが一致する場合のみ詳細情報を表示 */}
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
                          {s.date} {s.time} - {s.user}
                        </li>
                      ))}
                    </ul>
                    <HeartButton
                      caregiverId={c.id}
                      liked={likedIds.has(c.id)}
                      onToggle={toggleLike}
                    />
                    <Button variant="primary">予約</Button>
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
