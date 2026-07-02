import { DEFAULT_REMARKS } from "../constants";

interface RemarkPickerProps {
  title: string;
  selectedRemarks: string[];
  confirmText: string;
  onToggleRemark: (remark: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RemarkPicker({
  title,
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
        {DEFAULT_REMARKS.map((remark) => (
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
