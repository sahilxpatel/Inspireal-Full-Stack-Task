"use client";

import { updateRequestStatusAction, markAsPaidAction } from "./actions";

interface RequestStatusFormProps {
  requestId: string;
  currentStatus: string;
  pricingMode: string;
  paymentStatus: string;
}

export default function RequestStatusForm({
  requestId,
  currentStatus,
  pricingMode,
  paymentStatus,
}: RequestStatusFormProps) {
  const handleUpdateStatus = async (formData: FormData) => {
    await updateRequestStatusAction(requestId, formData);
  };

  const handleMarkPaid = async () => {
    await markAsPaidAction(requestId);
  };

  if (currentStatus === "pending") {
    return (
      <div className="action-buttons">
        <form action={handleUpdateStatus}>
          <input type="hidden" name="status" value="accepted" />
          <button type="submit" className="btn btn-success btn-sm">
            ✓ Accept
          </button>
        </form>
        <form action={handleUpdateStatus}>
          <input type="hidden" name="status" value="rejected" />
          <button type="submit" className="btn btn-danger btn-sm">
            ✕ Reject
          </button>
        </form>
      </div>
    );
  }

  if (
    currentStatus === "accepted" &&
    pricingMode === "fixed" &&
    paymentStatus === "unpaid"
  ) {
    return (
      <form action={handleMarkPaid}>
        <button type="submit" className="btn btn-primary btn-sm">
          💵 Mark Paid
        </button>
      </form>
    );
  }

  return <span style={{ color: "var(--muted)" }}>-</span>;
}
