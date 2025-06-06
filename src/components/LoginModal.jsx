// propsで受け取った値をもとにモーダルを生成
export default function LoginModal({ onClose, children }) {
  const handleBackgroundClick = (e) => {
    // 背景部分をクリックした場合にモーダルを閉じる
    if (e.target.classList.contains("modal_background")) {
      onClose();
    }
  };

  return (
    // propsで受け取ったchildrenを表示
    <div className="modal_background" onClick={handleBackgroundClick}>
      <div className="modal_content">{children}</div>
    </div>
  );
}
