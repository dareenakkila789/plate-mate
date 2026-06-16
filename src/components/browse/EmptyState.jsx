import React from 'react';

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <h3 className="text-2xl font-semibold mb-2">No food matches your filters right now</h3>
      <p className="text-gray-500">Try a different combination or reset filters.</p>
    </div>
  );
}