import React from 'react'

const BaseButton = ({ onClick, text }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {text}
    </button>
  )
}

export default BaseButton
