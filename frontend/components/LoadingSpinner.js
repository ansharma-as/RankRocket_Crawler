'use client'

import { ClimbingBoxLoader } from 'react-spinners'

export default function LoadingSpinner({ 
  color = "#00bf63", 
  size = 30, 
  className = "",
  text = "Loading...",
  showText = true 
}) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <ClimbingBoxLoader
        color={color}
        size={size}
      />
      {showText && (
        <p className="text-gray-400 text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Full page loading component
export function FullPageLoader({ 
  color = "#00bf63", 
  size = 40, 
  text = "Loading...",
  showText = true 
}) {
  return (
    <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner 
        color={color} 
        size={size} 
        text={text} 
        showText={showText}
        className="bg-neutral-800/90 backdrop-blur-md p-8 rounded-2xl border border-neutral-700/50 shadow-2xl"
      />
    </div>
  )
}

// Inline loading component for buttons, etc.
export function InlineLoader({ 
  color = "#ffffff", 
  size = 15, 
  text = "",
  className = "" 
}) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <ClimbingBoxLoader
        color={color}
        size={size}
      />
      {text && (
        <span className="text-sm">
          {text}
        </span>
      )}
    </div>
  )
}