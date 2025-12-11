"use client";

import { useActionState, useState } from "react";
import { updateListingAction } from "../../actions";

interface Listing {
  id: string;
  category: string;
  name: string;
  description: string;
  quantityAvailable: number;
  unit: string;
  locationCountry: string;
  pricingMode: string;
  unitPrice: number | null;
  isActive: boolean;
}

interface EditListingFormProps {
  listing: Listing;
}

export default function EditListingForm({ listing }: EditListingFormProps) {
  const boundUpdateAction = async (
    _prevState: { error?: string } | null,
    formData: FormData
  ) => {
    return updateListingAction(listing.id, _prevState, formData);
  };
  const [state, formAction, isPending] = useActionState(boundUpdateAction, null);
  const [pricingMode, setPricingMode] = useState(listing.pricingMode);

  return (
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
          defaultValue={listing.category}
          className="form-select"
        >
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
          defaultValue={listing.name}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          maxLength={1000}
          rows={4}
          defaultValue={listing.description}
          className="form-textarea"
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
            defaultValue={listing.quantityAvailable}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="unit" className="form-label">Unit</label>
          <select
            id="unit"
            name="unit"
            required
            defaultValue={listing.unit}
            className="form-select"
          >
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
          defaultValue={listing.locationCountry}
          className="form-input"
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
            defaultValue={listing.unitPrice ?? undefined}
            className="form-input"
          />
        </div>
      )}

      <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          defaultChecked={listing.isActive}
          style={{ width: "auto" }}
        />
        <label htmlFor="isActive" style={{ marginBottom: 0 }}>
          Active listing (visible to buyers)
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary"
        style={{ width: "100%", marginTop: "0.5rem" }}
      >
        {isPending ? "Saving..." : "💾 Save Changes"}
      </button>
    </form>
  );
}
