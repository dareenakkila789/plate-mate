import React from 'react';
import { districts, categories, dietaryOptions, freshnessOptions, sortOptions } from '../../constants/browseFilters';

export default function BrowseFilters({
  selectedCategory,
  setSelectedCategory,
  selectedDistrict,
  setSelectedDistrict,
  selectedDietary,
  setSelectedDietary,
  selectedAvailabilityDate,
  setSelectedAvailabilityDate,
  selectedFreshness,
  setSelectedFreshness,
  sortOption,
  setSortOption,
}) {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-5 py-3 rounded-lg border text-lg"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-5 py-3 rounded-lg border text-lg"
        >
          <option value="">All Districts</option>
          {districts.map((district) => (
            <option key={district.value} value={district.value}>
              {district.label}
            </option>
          ))}
        </select>
        <select
          value={selectedDietary}
          onChange={(e) => setSelectedDietary(e.target.value)}
          className="px-5 py-3 rounded-lg border text-lg"
        >
          {dietaryOptions.map((diet) => (
            <option key={diet.value} value={diet.value}>
              {diet.label}
            </option>
          ))}
        </select>
        <select
          value={selectedFreshness}
          onChange={(e) => setSelectedFreshness(e.target.value)}
          className="px-5 py-3 rounded-lg border text-lg"
        >
          {freshnessOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="date"
          value={selectedAvailabilityDate}
          onChange={(e) => setSelectedAvailabilityDate(e.target.value)}
          className="px-5 py-3 rounded-lg border text-lg"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-5 py-3 rounded-lg border text-lg"
        >
          {sortOptions.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}