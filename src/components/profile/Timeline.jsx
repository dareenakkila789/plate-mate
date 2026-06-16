export default function Timeline({ currentStatus, status, timeline = [], compact = false }) {
  const actualStatus = status || currentStatus
  const statusOrder = ['pending', 'accepted', 'ready_for_pickup', 'arrived', 'completed']
  const currentIndex = Math.max(0, statusOrder.indexOf(actualStatus))

  const steps = [
    { key: 'pending', label: 'Requested' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'ready_for_pickup', label: 'Ready' },
    { key: 'arrived', label: 'Arrived' },
    { key: 'completed', label: 'Completed' }
  ]

  const stepStyles = {
    pending: { dot: 'bg-amber-400 text-amber-900', line: 'bg-amber-300' },
    accepted: { dot: 'bg-emerald-400 text-emerald-900', line: 'bg-emerald-300' },
    ready_for_pickup: { dot: 'bg-sky-500 text-sky-900', line: 'bg-sky-300' },
    arrived: { dot: 'bg-indigo-500 text-white', line: 'bg-indigo-300' },
    completed: { dot: 'bg-slate-600 text-white', line: 'bg-slate-400' }
  }

  const dotSize = compact ? 22 : 28
  const minStepWidth = compact ? 76 : 92
  const labelClass = compact ? 'text-[10px]' : 'text-xs'

  return (
    <div className="flex items-center gap-1 overflow-x-auto rounded-[20px] bg-slate-50 p-2 shadow-sm">
      {steps.map((step, index) => {
        const isDone = index <= currentIndex
        const style = stepStyles[step.key] || stepStyles.pending
        const lineClass = index < currentIndex ? style.line : 'bg-slate-200'

        return (
          <div key={step.key} className="flex items-center gap-1" style={{ minWidth: minStepWidth }}>
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center rounded-full border-2 ${
                  isDone
                    ? style.dot
                    : 'border-slate-200 bg-slate-100 text-slate-500'
                }`}
                style={{ width: dotSize, height: dotSize }}
              >
                <span className="text-[10px] font-semibold">{index + 1}</span>
              </div>
              <div className="min-w-0">
                <p className={`${labelClass} font-semibold ${isDone ? 'text-text' : 'text-slate-500'}`}>
                  {step.label}
                </p>
              </div>
            </div>

            {index !== steps.length - 1 && (
              <div className={`h-px flex-1 ${lineClass}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}