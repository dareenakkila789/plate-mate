import { MessageCircle } from 'lucide-react'
import IncomingRequestCard from './IncomingRequestCard'

export default function RequestsTab({
  incomingRequests,
  userNames,
  onSelectRequest,
  onRespond,
  actionLoading
}) {
  const sortedRequests = [...incomingRequests].sort(
    (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  )

  if (sortedRequests.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-text mb-2">No incoming requests yet</h3>
        <p className="text-gray-600 max-w-xl mx-auto">
          Requests you receive from other users will show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedRequests.map((request) => (
        <IncomingRequestCard
          key={request.id}
          request={request}
          userNames={userNames}
          onClick={() => onSelectRequest(request)}
          onRespond={onRespond}
          actionLoading={actionLoading}
        />
      ))}
    </div>
  )
}