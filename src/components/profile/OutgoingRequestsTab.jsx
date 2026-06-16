  import { Package } from 'lucide-react'
  import OutgoingRequestCard from './OutgoingRequestCard'
  
  export default function OutgoingRequestsTab({
    outgoingRequests,
    userNames,
    onArrived,
    onRateExperience
  }) {
    if (outgoingRequests.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">No requests made</h3>
          <p className="text-gray-600">Your food requests will appear here.</p>
        </div>
      )
    }
  
    const sortedOutgoing = [...outgoingRequests].sort(
      (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    )
  
    return (
      <div className="space-y-4">
        {sortedOutgoing.map((request) => (
          <OutgoingRequestCard
            key={request.id || request.requestId}
            request={request}
            userNames={userNames}
            onArrived={onArrived}
            onRateExperience={onRateExperience}
          />
        ))}
      </div>
    )
  }