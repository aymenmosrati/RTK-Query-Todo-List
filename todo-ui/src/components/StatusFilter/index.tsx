import React from "react";
import { colors } from "../../types/colorTypes";

interface TabProps {
  label: string;
  status: string;
  count?: number;
  bg: colors;
  isActive: boolean;
  onClick: (status: string) => void;
}

const StatusFilter: React.FC<TabProps> = ({
  label,
  status,
  count,
  bg,
  isActive,
  onClick,
}) => (
  <button
    className={`tab-item ${isActive ? "active" : ""}`}
    onClick={() => onClick(status)}
  >
    {<div className="bg-status" style={{ background: bg }}></div>}
    {label}
    <div className="count">{count}</div>
  </button>
);

export default StatusFilter;
