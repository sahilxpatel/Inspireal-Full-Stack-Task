"use client";

import { useActionState, useState, useEffect } from "react";
import { createRequestAction } from "@/app/requests/actions";

interface RequestFormProps {
  listingId: string;
  pricingMode: string;
  unitPrice: number | null;
  unit: string;
}

export default function RequestForm({
  listingId,
  pricingMode,
  unitPrice,
  unit,
}: RequestFormProps) {
  const [state, formAction, isPending] = useActionState(createRequestAction, null);
  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setSubmitted(true);
    }
  }, [state]);

  if (submitted) {
    return (
      <div className="alert alert-success">
        ✓ Request submitted successfully!
      </div>
    );
  }

  const totalAmount = pricingMode === "fixed" && unitPrice 
    ? (quantity * unitPrice).toFixed(2) 
    : null;

  return (
    <form action={formAction} className="card" style={{ padding: "1rem" }}>
      <input type="hidden" name="listingId" value={listingId} />

      {state?.error && (
        <div className="alert alert-danger">{state.error}</div>
      )}

      <div className="form-group">
        <label htmlFor={`qty-${listingId}`} className="form-label">
          Quantity ({unit})
        </label>
        <input
          type="number"
          id={`qty-${listingId}`}
          name="requestedQuantity"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="form-input"
          style={{ maxWidth: "120px" }}
        />
      </div>

      {pricingMode === "fixed" && totalAmount && (
        <p style={{ marginBottom: "0.75rem", fontSize: "1rem" }}>
          <strong>Total:</strong>{" "}
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>${totalAmount}</span>
        </p>
      )}

      {pricingMode === "rfq_only" && (
        <div className="form-group">
          <label htmlFor={`msg-${listingId}`} className="form-label">
            Message (optional)
          </label>
          <textarea
            id={`msg-${listingId}`}
            name="message"
            rows={2}
            maxLength={1000}
            className="form-textarea"
            placeholder="Enter your quote request details..."
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={`btn ${pricingMode === "fixed" ? "btn-primary" : "btn-secondary"}`}
        style={{ width: "100%" }}
      >
        {isPending
          ? "Submitting..."
          : pricingMode === "fixed"
          ? "🛒 Request Purchase"
          : "📝 Request Quote"}
      </button>
    </form>
  );
}
