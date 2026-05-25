function CollectionTargetManager({
  collectionTargets,
  newTarget,
  setNewTarget,
  onAddTarget,
  onToggleTarget,
  onDeleteTarget
}) {
  return (
    <section className="panel target-panel">
      <div className="panel-header">
        <h2>수집 대상 관리</h2>
        <span>Collection Targets</span>
      </div>

      <form className="target-form" onSubmit={onAddTarget}>
        <select
          value={newTarget.type}
          onChange={(event) =>
            setNewTarget({
              ...newTarget,
              type: event.target.value
            })
          }
        >
          <option value="citydata">도시데이터</option>
          <option value="subway">지하철</option>
        </select>

        <input
          type="text"
          placeholder="예: 광화문·덕수궁 또는 강남"
          value={newTarget.name}
          onChange={(event) =>
            setNewTarget({
              ...newTarget,
              name: event.target.value
            })
          }
        />

        <button type="submit">추가</button>
      </form>

      {collectionTargets.length > 0 ? (
        <div className="target-list">
          {collectionTargets.map((target) => (
            <div className="target-item" key={target._id}>
              <div>
                <strong>{target.name}</strong>
                <span>{target.type}</span>
              </div>

              <span
                className={`target-status ${
                  target.isActive ? "active" : "inactive"
                }`}
              >
                {target.isActive ? "활성" : "비활성"}
              </span>

              <div className="target-actions">
                <button onClick={() => onToggleTarget(target._id)}>
                  {target.isActive ? "비활성화" : "활성화"}
                </button>

                <button
                  className="danger-button"
                  onClick={() => onDeleteTarget(target._id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>등록된 수집 대상이 없습니다.</p>
      )}
    </section>
  );
}

export default CollectionTargetManager;