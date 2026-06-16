import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

export default function HistoryTab({
  listings,
  incomingRequests,
  outgoingRequests,
  userNames,
  onRelist,
  user
}) {
  const [activeSection, setActiveSection] = useState('shared')

  if (!user) return null

  const exampleExpiredItem = {
    id: 'example-expired',
    foodName: 'Roasted Vegetable Tray',
    pickupLocation: 'District 5',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80',
    status: 'expired',
    expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'A generous tray of roasted seasonal vegetables perfect for pickup.'
  }

  const sharedHistory = listings
    .filter(
      (l) =>
        l.userId === user.uid &&
        (l.status === 'completed' || l.status === 'expired')
    )
    .sort(
      (a, b) =>
        new Date(b.completedAt || b.expiryDate) -
        new Date(a.completedAt || a.expiryDate)
    )

  const receivedHistory = outgoingRequests
    .filter((r) => ['completed', 'declined', 'expired'].includes(r.status))
    .sort(
      (a, b) =>
        new Date(b.completedAt || b.updatedAt) -
        new Date(a.completedAt || a.updatedAt)
    )

  const totalItemsSaved = sharedHistory.filter((item) => item.status === 'completed').length
  const uniqueNeighbors = new Set([
    ...incomingRequests
      .filter((r) => ['completed', 'declined', 'expired'].includes(r.status))
      .map((r) => r.requesterId),
    ...receivedHistory.map((r) => r.ownerId)
  ]).size

  const renderHistoryCard = (item, showRelist = false) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 border border-gray-200 rounded-xl p-4"
    >
      <div className="flex gap-4">
        <img
          src={item.imageUrl || 'https://via.placeholder.com/200'}
          alt={item.foodName}
          className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-700">{item.foodName}</h4>
              <p className="text-sm text-gray-600 mt-1">{item.pickupLocation}</p>
            </div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                item.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {item.status === 'completed' ? '✓ Completed' : '⏱ Expired'}
            </span>
          </div>

          {item.description && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">{item.description}</p>
          )}

          <p className="text-xs text-gray-500 mt-3">
            {item.status === 'completed'
              ? `Finished: ${item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'N/A'}`
              : `Expired: ${item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}`}
          </p>

          {showRelist && item.status === 'expired' && (
            <button
              onClick={() => onRelist(item)}
              className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
              Relist Item
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">🌟 Your Community Impact</h3>
            <p className="text-green-800">
              You have shared <span className="font-bold text-xl">{totalItemsSaved}</span> items and helped{' '}
              <span className="font-bold text-xl">{uniqueNeighbors}</span> neighbor
              {uniqueNeighbors !== 1 ? 's' : ''}!
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-green-800">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-sm text-green-800">Expired</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-sm text-green-800">Declined</span>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3">
        <button
          onClick={() => setActiveSection('shared')}
          className={`px-6 py-2 font-semibold rounded-lg transition ${
            activeSection === 'shared'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Shared History ({sharedHistory.length})
        </button>
        <button
          onClick={() => setActiveSection('received')}
          className={`px-6 py-2 font-semibold rounded-lg transition ${
            activeSection === 'received'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Received History ({receivedHistory.length})
        </button>
      </div>

      {activeSection === 'shared' && (
        <div className="space-y-4">
          {sharedHistory.length === 0 ? (
            <div className="space-y-6">
              <div className="text-center py-12 text-slate-500">
                <p>No shared history yet. Start sharing food with your neighbors!</p>
                <p className="text-sm text-slate-400">
                  The example below shows how an expired listing appears and how the relist action is offered.
                </p>
              </div>
              {renderHistoryCard(exampleExpiredItem, true)}
            </div>
          ) : (
            <>
              {sharedHistory.map((item) => renderHistoryCard(item))}
              <div className="pt-6">
                <h4 className="text-lg font-semibold text-slate-700">Expired items</h4>
                
                {renderHistoryCard(exampleExpiredItem, true)}
              </div>
            </>
          )}
        </div>
      )}

      {activeSection === 'received' && (
        <div className="space-y-4">
          {receivedHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>No received history yet. Start requesting food from your neighbors!</p>
            </div>
          ) : (
            receivedHistory.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-60"
              >
                <div className="flex gap-4">
                  <img
                    src={request.imageUrl || 'https://via.placeholder.com/200'}
                    alt={request.foodName}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-700">{request.foodName}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          From: {userNames[request.ownerId] || 'Unknown'}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : request.status === 'declined'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {request.status === 'completed'
                          ? '✓ Completed'
                          : request.status === 'declined'
                          ? '✗ Declined'
                          : '⏱ Expired'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {request.status === 'completed'
                        ? `Finished: ${request.completedAt ? new Date(request.completedAt).toLocaleDateString() : 'N/A'}`
                        : request.status === 'declined'
                        ? 'Item claimed by another neighbor'
                        : `Expired on: ${request.expiryDate ? new Date(request.expiryDate).toLocaleDateString() : 'N/A'}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  )
}