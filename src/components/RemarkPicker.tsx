interface RemarkPickerProps {
  title: string;
  remarks: string[];
  selectedRemarks: string[];
  confirmText: string;
  onToggleRemark: (remark: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RemarkPicker({
  title,
  remarks,
  selectedRemarks,
  confirmText,
  onToggleRemark,
  onConfirm,
  onCancel,
}: RemarkPickerProps) {
  return (
    <section className="remark-picker" aria-label="备注选择">
      <div className="remark-head">
        <h2>{title}</h2>
        <button className="text-button" type="button" onClick={onCancel}>
          取消
        </button>
      </div>
      <div className="remark-tags">
        {remarks.length === 0 ? <span className="empty-inline">暂无备注</span> : null}
        {remarks.map((remark) => (
          <button
            className={selectedRemarks.includes(remark) ? "remark-tag selected" : "remark-tag"}
            key={remark}
            type="button"
            onClick={() => onToggleRemark(remark)}
          >
            {remark}
          </button>
        ))}
      </div>
      <button className="button full" type="button" onClick={onConfirm}>
        {confirmText}
      </button>
    </section>
  );
}
