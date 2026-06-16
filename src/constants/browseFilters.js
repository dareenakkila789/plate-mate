export const districts = Array.from({ length: 22 }, (_, i) => ({
  value: `District ${i + 1}`,
  label: `District ${i + 1}`,
}));

export const categories = [
  { value: "", label: "All Categories" },
  { value: "baked", label: "Baked Goods" },
  { value: "cooked", label: "Cooked Meals" },
  { value: "fruits", label: "Fruits & Vegetables" },
  { value: "other", label: "Other" },
];

export const dietaryOptions = [
  { value: "", label: "All Diets" },
  { value: "Vegan", label: "Vegan" },
  { value: "Gluten-Free", label: "Gluten-Free" },
  { value: "Dairy-Free", label: "Dairy-Free" },
  { value: "Nut-Free", label: "Nut-Free" },
];

export const freshnessOptions = [
  { value: "all", label: "All Freshness" },
  { value: "expiringSoon", label: "Expiring Soon" },
  { value: "fresh", label: "Fresh" },
  { value: "today", label: "Expiring Today" },
];

export const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "pickupSoon", label: "Pickup Soon" },
  { value: "expirySoon", label: "Expiry Soon" },
];