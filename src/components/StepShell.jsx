import React from 'react'

export default function StepShell({ title, subtitle, children }) {
  return (
    <div className="shell">
      <div className="headline">
        {title ? <h1>{title}</h1> : null}
        {subtitle ? <p>{subtitle}</p> : null}
      </div>

      <div className="stage">
        {children}
      </div>
    </div>
  )
}
