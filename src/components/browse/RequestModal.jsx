import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';

export default function RequestModal({
  open,
  listing,
  requestMessage,
  setRequestMessage,
  requestPickupTime,
  setRequestPickupTime,
  submitting,
  onClose,
  onSubmit,
}) {
  if (!listing) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-8 max-w-lg w-full"
          >
            <h3 className="text-2xl font-bold mb-4">Request {listing.foodName}</h3>
            <p className="mb-2 text-lg">📍 {listing.pickupLocation}</p>
            <p className="mb-4 text-lg">
              🗓 {listing.pickupDate} • {listing.availabilityStartTime} - {listing.availabilityEndTime}
            </p>
            <label className="block font-semibold mb-2 text-lg">Preferred Pickup Time *</label>
            <input
              type="time"
              value={requestPickupTime}
              onChange={(e) => setRequestPickupTime(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 text-lg"
              required
            />
            <label className="block font-semibold mb-2 text-lg">Message to Owner (Optional)</label>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              className="w-full p-3 border rounded-lg mb-6 text-lg"
              placeholder="Example: I can pick up around 5 PM."
              rows="4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-5 py-2 border rounded-lg text-lg hover:bg-gray-100"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={submitting}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-lg flex items-center gap-2"
              >
                {submitting && <Loader size={16} className="animate-spin" />}
                {submitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}