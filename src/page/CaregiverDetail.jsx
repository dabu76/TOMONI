import { useParams } from "react-router-dom";

export default function CaregiverDetail() {
  const { id } = useParams();
  console.log("선택된 caregiver ID:", id);
  return (
    <>
      <div className="container">
        <div className="caregiver_picture">여기에 사진넣고</div>
        <div className="content">
          <div className="content_language">대응언어</div>
          <div className="content_introduce">자기소개</div>
        </div>
        <button className="reservation">
          이걸 푸터쪽에 아예 박아넣어서 언제든 예약버튼을 누를수있게만들기기
        </button>
      </div>
    </>
  );
}
