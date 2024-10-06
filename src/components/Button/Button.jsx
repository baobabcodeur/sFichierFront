import React from 'react'
import './Button.css'

export default function Button({text, onClick, type, disabled}) {
  return (
    <div>
        <button className='button' onClick={onClick} type={type} disabled={disabled}>
          {text || "Opération"}
        </button>
    </div>
  )
}

