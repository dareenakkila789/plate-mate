import React from 'react'
import { Loader } from 'lucide-react'

export default function LoadingSpinner({ size = 48, className = '' }) {
  return (
    <div className={`flex justify-center items-center min-h-screen ${className}`}>
      <Loader className="animate-spin text-primary" size={size} />
    </div>
  )
}