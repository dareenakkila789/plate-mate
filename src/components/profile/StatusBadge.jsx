export default function StatusBadge({ status }) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    accepted: { color: 'bg-green-100 text-green-800', text: 'Accepted' },
    ready_for_pickup: { color: 'bg-blue-100 text-blue-800', text: 'Ready for Pickup' },
    arrived: { color: 'bg-indigo-100 text-indigo-800', text: 'Arrived' },
    completed: { color: 'bg-gray-100 text-gray-800', text: 'Completed' },
    declined: { color: 'bg-red-100 text-red-800', text: 'Declined' },
    expired: { color: 'bg-rose-100 text-rose-800', text: 'Expired' }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${config.color}`}>
      {config.text}
    </span>
  )
}