"use client";

import { useRouter } from "next/navigation";

interface CategoryFilterProps {
  currentCategory: string;
}

const categories = [
  { value: "all", label: "All Categories", icon: "🏷️" },
  { value: "raw_material", label: "Raw Material", icon: "🪨" },
  { value: "service", label: "Service", icon: "🔧" },
  { value: "other", label: "Other", icon: "📦" },
];

export default function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  const router = useRouter();

  const onSelect = (value: string) => {
    if (value === "all") {
      router.push("/");
    } else {
      router.push(`/?category=${value}`);
    }
  };

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {categories.map((cat) => {
          const active = currentCategory === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onSelect(cat.value)}
              className={`btn ${active ? "btn-primary" : "btn-outline"} btn-sm`}
            >
              <span style={{ marginRight: "0.25rem" }}>{cat.icon}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
