import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'

export default function RatingModal({ open, request, onClose, onSubmit, loading }) {
  const [stars, setStars] = useState(0)
  const [comment, setComment] = useState('')
  const [touched, setTouched] = useState(false)
  const prevLoadingRef = useRef(false)

  useEffect(() => {
    if (open && request) {
      setStars(0)
      setComment('')
      setTouched(false)
    }
  }, [open, request])

  // Close modal when submission finishes (loading flips true → false)
  useEffect(() => {
    if (prevLoadingRef.current === true && loading === false) {
      onClose()
    }
    prevLoadingRef.current = loading
  }, [loading])

  if (!open || !request) return null

  const title = request.foodName || request.foodTitle || request.listing?.title || 'this request'
  const canSubmit = stars > 0 && !loading

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          className="w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
        >
          <div className="p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold">
                  Rate Experience
                </p>
                <h2 className="mt-3 text-3xl font-bold text-text">
                  How was pickup for {title}?
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-slate-50 p-3 text-slate-600 transition hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-text mb-3">Stars</p>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setStars(value)
                      setTouched(true)
                    }}
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                      value <= stars
                        ? 'bg-amber-400 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <Star className="w-6 h-6" />
                  </button>
                ))}
              </div>
              {touched && stars === 0 && (
                <p className="mt-3 text-sm text-red-600">Please select at least one star.</p>
              )}
            </div>

            <div className="mt-8">
              <label className="block text-sm font-semibold text-text mb-3">
                Optional comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="5"
                className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-lg text-text focus:border-primary focus:outline-none"
                placeholder="Share a short note about the pickup..."
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-w-[180px] items-center justify-center rounded-3xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => onSubmit(request.id, stars, comment)}
                className="inline-flex min-w-[180px] items-center justify-center rounded-3xl bg-primary px-6 py-4 text-base font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}