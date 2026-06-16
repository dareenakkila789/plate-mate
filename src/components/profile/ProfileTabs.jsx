export default function ProfileTabs({
  activeTab,
  setActiveTab,
  listings,
  incomingRequests,
  outgoingRequests,
  user
}) {
  const activeListingCount = listings.filter(
    (l) => l.status !== 'completed' && l.status !== 'expired'
  ).length

  const requestsCount = incomingRequests.filter(
    (r) => r.status !== 'declined' && r.status !== 'completed'
  ).length

  const outgoingCount = outgoingRequests.filter(
    (r) => r.status !== 'declined' && r.status !== 'completed'
  ).length

  const sharedHistoryCount = user
    ? listings.filter(
        (l) =>
          l.userId === user.uid &&
          (l.status === 'completed' || l.status === 'expired')
      ).length
    : 0

  const receivedHistoryCount = outgoingRequests.filter((r) =>
    ['completed', 'declined', 'expired'].includes(r.status)
  ).length

  const historyCount = sharedHistoryCount + receivedHistoryCount

  const pendingIncoming = incomingRequests.filter((r) => r.status === 'pending').length
  const pendingOutgoing = outgoingRequests.filter((r) => r.status === 'pending').length

  return (
    <div className="flex border-b-2 border-slate-200 mb-6 overflow-x-auto">
      <button
        onClick={() => setActiveTab('active')}
        className={`px-6 py-4 font-semibold -mb-px text-xl whitespace-nowrap ${
          activeTab === 'active'
            ? 'border-b-4 border-slate-900 text-slate-900'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Active Listings ({activeListingCount})
      </button>

      <button
        onClick={() => setActiveTab('requests')}
        className={`px-6 py-4 font-semibold -mb-px text-xl whitespace-nowrap ${
          activeTab === 'requests'
            ? 'border-b-4 border-slate-900 text-slate-900'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Requests ({requestsCount})
        {pendingIncoming > 0 && (
          <span className="ml-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
            {pendingIncoming} new
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('outgoing')}
        className={`px-6 py-4 font-semibold -mb-px text-xl whitespace-nowrap ${
          activeTab === 'outgoing'
            ? 'border-b-4 border-slate-900 text-slate-900'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Requested Items ({outgoingCount})
        {pendingOutgoing > 0 && (
          <span className="ml-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">
            {pendingOutgoing} pending
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('history')}
        className={`px-6 py-4 font-semibold -mb-px text-xl whitespace-nowrap ${
          activeTab === 'history'
            ? 'border-b-4 border-slate-900 text-slate-900'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        History ({historyCount})
      </button>
    </div>
  )
}