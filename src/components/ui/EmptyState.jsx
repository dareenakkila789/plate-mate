function EmptyState({ icon, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="mb-3">
        {icon}
      </div>
      <h4 className="text-gray-700 font-medium mb-1">{title}</h4>
      <p className="text-gray-500 text-sm max-w-xs">{message}</p>
    </div>
  )
}

export default EmptyState