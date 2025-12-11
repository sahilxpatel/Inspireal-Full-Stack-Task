"use client";

import { useActionState, useState } from "react";
import { createListingAction } from "../actions";

export default function NewListingPage() {
  const [state, formAction, isPending] = useActionState(createListingAction, null);
  const [pricingMode, setPricingMode] = useState("fixed");

  return (
    <main className="container container-md">
      <div className="page-header">
        <h1 className="page-title">➕ Create New Listing</h1>
        <p className="page-subtitle">Add a new product or service to the marketplace</p>
      </div>

      <div className="card">
        <form action={formAction}>
          {state?.error && (
            <div className="alert alert-danger">{state.error}</div>
          )}

          <div className="form-group">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              name="category"
              required
              className="form-select"
            >
              <option value="">Select a category</option>
              <option value="raw_material">🪨 Raw Material</option>
              <option value="service">🔧 Service</option>
              <option value="other">📦 Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">Product/Service Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              minLength={3}
              maxLength={100}
              className="form-input"
              placeholder="e.g., Industrial Steel Beams"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              maxLength={1000}
              rows={4}
              className="form-textarea"
              placeholder="Describe your product or service..."
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="quantityAvailable" className="form-label">Quantity Available</label>
              <input
                type="number"
                id="quantityAvailable"
                name="quantityAvailable"
                required
                min={0}
                className="form-input"
                placeholder="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="unit" className="form-label">Unit</label>
              <select
                id="unit"
                name="unit"
                required
                className="form-select"
              >
                <option value="">Select unit</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="ton">Ton</option>
                <option value="litre">Litre</option>
                <option value="unit">Unit</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="locationCountry" className="form-label">Location Country</label>
            <input
              type="text"
              id="locationCountry"
              name="locationCountry"
              required
              className="form-input"
              placeholder="e.g., United States"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pricingMode" className="form-label">Pricing Mode</label>
            <select
              id="pricingMode"
              name="pricingMode"
              required
              value={pricingMode}
              onChange={(e) => setPricingMode(e.target.value)}
              className="form-select"
            >
              <option value="fixed">💵 Fixed Price</option>
              <option value="rfq_only">📝 RFQ Only (Request for Quote)</option>
            </select>
          </div>

          {pricingMode === "fixed" && (
            <div className="form-group">
              <label htmlFor="unitPrice" className="form-label">Unit Price ($)</label>
              <input
                type="number"
                id="unitPrice"
                name="unitPrice"
                required={pricingMode === "fixed"}
                min={0}
                step="0.01"
                className="form-input"
                placeholder="0.00"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {isPending ? "Creating..." : "🚀 Create Listing"}
          </button>
        </form>
      </div>
    </main>
  );
}
