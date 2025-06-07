/**
 * [変更履歴]
 * 以前は HeartButton 内で liked 状態を useState によりローカル管理していたが、
 * 同じ ID のハートが複数存在する場合に状態が同期されない問題が発生。
 *
 * → 状態を上位コンポーネント（CaregiverList）で一元管理し、
 *    props（liked, onToggle）を通じて制御する構造にリファクタリング。
 *
 * これにより、同じ ID を持つハートが複数あっても
 * 一括で同期され、UI 一貫性が保たれるようになった。
 */

export function HeartButton({ caregiverId, liked, onToggle }) {
  return (
    <button className="heart" onClick={() => onToggle(caregiverId)}>
      {liked ? "❤️" : "🤍"}
    </button>
  );
}
