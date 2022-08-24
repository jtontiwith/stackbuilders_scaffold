import React, { forwardRef } from 'react'
// onChange, value, defaultValue, inline
const Input = forwardRef<HTMLInputElement>((props, ref) => {
  return (
    <>
      <label htmlFor="email" className="sr-only">
        text
      </label>
      <input
        ref={ref}
        value={props.value}
        onChange={props.onChange}
        onKeyPress={props.onKeyPress}
        defaultValue={props.defaultValue}
        type="text"
        name="text"
        id="text"
        className={`grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md ${
          props.inline === true
            ? 'border-none shadow-none focus:ring-0 h-6'
            : ''
        }`}
        placeholder={props.placeholder}
      />
    </>
  )
})

Input.displayName = 'Input'
export default Input
