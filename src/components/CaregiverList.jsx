import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { HeartButton } from "./Heart.jsx";
import { usePagination } from "../hooks/usePagination.jsx";
import { calculateDistance } from "../hooks/geometry";

export function CaregiverList({
  fixedCoords,
  currentFilters,
  sortValue,
  userLocationLoaded,
  currentUserCoords, //  ユーザーの現在地座標を受け取る
}) {
  const [allCaregivers, setAllCaregivers] = useState([]);
  const [user, setUser] = useState(null);
  const [dataLoading, setDataLoading] = useState(true); // データ読み込み状態

  useEffect(() => {
    setDataLoading(true);
    Promise.all([
      axios.get("/data/caregiver_profiles.jsonl"), // ローカルJSONLファイル
      axios.get("/data/user_profile.json"), // ローカルJSONファイル
    ])
      .then(([caregiversRes, userRes]) => {
        const lines = caregiversRes.data.split("\n").filter(Boolean);
        const parsedCaregivers = lines
          .map((line, index) => {
            try {
              return JSON.parse(line);
            } catch (err) {
              console.error(`Line ${index + 1} のJSONパースエラー:`, line, err);
              return null;
            }
          })
          .filter(Boolean);
        setAllCaregivers(parsedCaregivers);
        setUser(userRes.data);
      })
      .catch((err) => {
        console.error("データ取得エラー:", err);
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, []); // 初回のみ実行

  const filteredCaregivers = useMemo(() => {
    let filtered = [...allCaregivers];

    if (currentFilters.genders?.length > 0) {
      filtered = filtered.filter((caregiver) =>
        currentFilters.genders.includes(caregiver.gender)
      );
    }

    if (currentFilters.languages?.length > 0) {
      filtered = filtered.filter(
        (caregiver) =>
          caregiver.languages &&
          currentFilters.languages.every((selectedLang) =>
            caregiver.languages.includes(selectedLang)
          )
      );
    }

    if (fixedCoords?.lat != null && fixedCoords?.lng != null) {
      filtered = filtered
        .map((c) => {
          if (c.location?.lat != null && c.location?.lng != null) {
            return {
              ...c,
              distance: calculateDistance(
                fixedCoords.lat,
                fixedCoords.lng,
                c.location.lat,
                c.location.lng
              ),
            };
          }
          return { ...c, distance: null };
        })
        .filter((c) => c.distance != null && c.distance <= 30); // 30km以内のみ
    } else {
      filtered = filtered.map((c) => ({ ...c, distance: null }));
    }

    if (sortValue === "距離順") {
      if (fixedCoords) {
        filtered.sort((a, b) => {
          if (a.distance === null && b.distance === null) return 0;
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      }
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
  }, [allCaregivers, currentFilters, fixedCoords, sortValue, user]);

  const itemsPerPage = 9;
  const pageGroupSize = 5;
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
  } = usePagination(filteredCaregivers, itemsPerPage, pageGroupSize);

  // ローディング状態の表示: userLocationLoaded は現在地、dataLoading はデータ自体
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
          caregiversToDisplay.map((c) => {
            //  現在地からの距離（カード表示用）
            let distanceFromUser = null;
            if (
              currentUserCoords &&
              c.location?.lat != null &&
              c.location?.lng != null
            ) {
              distanceFromUser = calculateDistance(
                currentUserCoords.lat,
                currentUserCoords.lng,
                c.location.lat,
                c.location.lng
              );
            }

            return (
              <Col
                key={c.id}
                xs={12}
                sm={6}
                md={4}
                style={{ marginBottom: "20px" }}
              >
                <Card style={{ width: "100%", padding: "0px" }}>
                  <Card.Img
                    style={{
                      width: "100%",
                      height: "180px",
                    }}
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
                      {c.experience != null ? `${c.experience}年` : "情報なし"}{" "}
                      / 時給: ¥{c.hourlyRate || "情報なし"}
                      <br />
                      {distanceFromUser !== null
                        ? `現在地からの距離: ${distanceFromUser.toFixed(2)} km`
                        : userLocationLoaded
                        ? "距離計算不可"
                        : "現在地を確認中..."}
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
                      <HeartButton caregiverId={c.id} />
                      <Button variant="primary" className="main_button">
                        予約
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
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
            ></Button>
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
            ></Button>
          )}
        </div>
      )}
    </Container>
  );
}
