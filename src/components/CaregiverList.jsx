import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { HeartButton } from "../components/Heart.jsx";
import { usePagination } from "../hooks/usePagination.jsx";

export function CaregiverList({ currentFilters }) {
  const [allCaregivers, setAllCaregivers] = useState([]);

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

    return filtered;
  }, [allCaregivers, currentFilters]);

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
        const parsed = lines.map((line) => JSON.parse(line));
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
