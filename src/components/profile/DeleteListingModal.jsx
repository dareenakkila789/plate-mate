// import { Loader, AlertTriangle } from 'lucide-react'

// export default function DeleteListingModal({ open, onClose, onConfirm, loading, listing }) {
//   if (!open) return null

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//       <div className="bg-white rounded p-8 max-w-md w-full shadow-lg">
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//             <AlertTriangle className="w-5 h-5 text-red-600" />
//           </div>
//           <h3 className="text-2xl font-semibold">Delete Listing</h3>
//         </div>
//         <p className="mb-8 text-lg">
//           Are you sure you want to delete "{listing?.foodName}"? This action cannot be undone.
//         </p>
//         <div className="flex justify-end gap-6">
//           <button
//             onClick={onClose}
//             className="px-6 py-3 rounded border border-gray-400 hover:bg-gray-100 text-lg disabled:opacity-50"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-6 py-3 rounded bg-red-600 text-white hover:bg-red-700 text-lg flex items-center gap-2 disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading && <Loader className="animate-spin" size={16} />}
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
import { AlertTriangle } from 'lucide-react'

export default function DeleteListingModal({ open, listing, onClose, onConfirm, loading }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-text">Delete Listing</h2>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{listing?.title || listing?.foodName}"? This action cannot be undone.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}