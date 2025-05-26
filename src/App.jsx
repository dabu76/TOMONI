import { useState } from "react";
import "./App.css";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { HeartButton } from "./component/heart.jsx";
function App() {
  function handleSelect(selectedKey) {}

  return (
    <>
      <p className="login">ログイン/サインイン</p>
      <div className="main_header">
        <h2 className="title">TOMONI</h2>
      </div>
      <Nav activeKey="1" onSelect={handleSelect} className="custom-nav">
        <Nav.Item>
          <Nav.Link eventKey="1" href="#/search">
            介護士を探す
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="2" href="#/history">
            依頼履歴
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="3" href="#/mypage">
            アカウント
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="main_wrapper">
        <div>
          <input
            className="main_search"
            type="text"
            placeholder=" 検索機能(地域) "
          />
          <select className="main_select">
            <option value="">地域を選択</option>
            <option value="tokyo">東京都</option>
            <option value="nagoya">名古屋市</option>
            <option value="osaka">大阪市</option>
            <option value="kyoto">京都市</option>
          </select>
        </div>
        <div className="main_button">
          <button>距離順</button>
          <button> 経歴順</button>
          <button>時給順</button>
          <button>オンライン</button>
          <select class="dropdown-toggle">
            <option value="">その他</option>
            <option value="gender">性別</option>
            <option value="language">言語</option>
          </select>
        </div>
        <Container>
          <Row>
            {[1, 2, 3, 4].map((_, idx) => (
              <Col key={idx} xs={12} sm={3} md={4}>
                <Card
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                    padding: "0px",
                  }}
                >
                  <Card.Img
                    style={{ width: "80%" }}
                    variant="top"
                    src="/img/image.png"
                  />
                  <Card.Body>
                    <Card.Title>お名前</Card.Title>
                    <Card.Text>経歴,情報など</Card.Text>
                    <HeartButton /> {/* ← ✅ 이렇게 */}
                    <Button variant="primary">要約</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
}

export default App;
