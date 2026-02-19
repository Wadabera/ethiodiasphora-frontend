import React from "react";
import type{ Investment } from "@/types/index";

interface AdminInvestmentCardProps {
  investment: Investment;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (investment: Investment) => void;
}

const AdminInvestmentCard: React.FC<AdminInvestmentCardProps> = ({
  investment,
  onApprove,
  onReject,
  onViewDetails,
}) => {
  return (
    <div className="investment-card">
      <h3>{investment.title}</h3>
      <p>{investment.businessName}</p>

      <span className={`status-badge ${investment.status}`}>
        {investment.status}
      </span>

      <div className="action-buttons">
        <button onClick={() => onViewDetails(investment)}>View</button>

        {investment.status === "pending" && (
          <>
            <button onClick={() => onApprove(investment._id)}>Approve</button>
            <button onClick={() => onReject(investment._id)}>Reject</button>
          </>
        )}

        {investment.status === "approved" && (
          <button onClick={() => console.log("Publish logic")}>Publish</button>
        )}
      </div>
    </div>
  );
};

export default AdminInvestmentCard;
