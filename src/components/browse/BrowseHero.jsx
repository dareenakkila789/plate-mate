import React from 'react';
import { Search } from 'lucide-react';

export default function BrowseHero({ searchTerm, setSearchTerm, onShare }) {
  return (
    <div className="bg-gradient-to-b from-green-50 to-white w-full">
      <div className="max-w-8xl mx-auto px-6 sm:px-12 lg:px-24 py-20 text-center">
        <section className="text-center py-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Discover Shared Meals in Your Neighborhood
          </h1>
          <p className="text-gray-600 text-2xl mb-10 max-w-4xl mx-auto">
            Browse homemade dishes, fresh ingredients, and surplus food shared by your community.
          </p>
          <button
            className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl shadow-md text-white bg-green-500 hover:bg-green-600 transition"
            onClick={onShare}
          >
            Share Food
          </button>
        </section>
        <div className="mt-14 w-full max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row rounded-xl shadow-lg overflow-hidden border-2 border-gray-700">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={24} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full py-4 pl-12 pr-4 text-lg border-2 border-gray-700"
                placeholder="Search dishes, ingredients, or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-green-500 text-white text-lg font-semibold px-8 py-4 hover:bg-green-600">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}