import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { HeartButton } from "../components/Heart.jsx";
import { usePagination } from "../hooks/usePagination.jsx";

export function CaregiverList({ coords, currentFilters }) {
  const [allCaregivers, setAllCaregivers] = useState([]);
  console.log(coords);
  const filteredCaregivers = useMemo(() => {
    let filtered = allCaregivers;

    if (currentFilters.genders && currentFilters.genders.length > 0) {
      filtered = filtered.filter((caregiver) =>
        currentFilters.genders.includes(caregiver.gender)
      );
    }

    if (currentFilters.languages && currentFilters.languages.length > 0) {
      filtered = filtered.filter(
        (caregiver) =>
          caregiver.languages &&
          currentFilters.languages.every((selectedLang) =>
            caregiver.languages.includes(selectedLang)
          )
      );
    }
    if (coords && coords.lat && coords.lng) {
      filtered = filtered
        .map((c) => ({
          ...c,
          distance: calculateDistance(
            coords.lat,
            coords.lng,
            c.location.lat,
            c.location.lng
          ),
        }))
        .filter((c) => c.distance <= 30)
        .sort((a, b) => a.distance - b.distance);
    }
    return filtered;
  }, [allCaregivers, currentFilters, coords]);
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  const itemsPerPage = 9;

  const {
    currentItems: caregivers,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination(filteredCaregivers, itemsPerPage);

  useEffect(() => {
    axios
      .get("/data/caregiver_profiles.jsonl")
      .then((res) => {
        const lines = res.data.split("\n").filter(Boolean);
        const parsed = lines
          .map((line, index) => {
            try {
              return JSON.parse(line);
            } catch (err) {
              console.error(`Line ${index + 1} JSON parsingエラー:`, line);
              return null;
            }
          })
          .filter(Boolean);
        setAllCaregivers(parsed);
      })
      .catch((err) => {
        console.error("データロードエラー", err);
      });
  }, []);

  return (
    <Container>
      <Row>
        {Array.isArray(caregivers) &&
          caregivers.map((c) => (
            <Col key={c.id} xs={12} sm={3} md={4}>
              <Card
                style={{
                  width: "100%",
                  marginBottom: "20px",
                  padding: "0px",
                }}
              >
                <Card.Img
                  style={{ width: "100%", height: "180px" }}
                  variant="top"
                  src="/img/image.png"
                />
                <Card.Body>
                  <Card.Title>{c.name}</Card.Title>
                  <Card.Text>
                    {c.age}歳 / 経験: {c.experience}年 / 時給: ¥{c.hourlyRate}
                    <br />
                    距離: {c.distance?.toFixed(2)} km
                    <br />
                    {c.available ? "勤務可能" : "現在休止中"}
                  </Card.Text>
                  <HeartButton />
                  <Button className="main_button">予約</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Button
            className="main_button"
            key={pageNum}
            variant={currentPage === pageNum ? "primary" : "outline-primary"}
            onClick={() => goToPage(pageNum)}
            style={{ margin: "0 5px" }}
          >
            {pageNum}
          </Button>
        ))}
      </div>
    </Container>
  );
}
