import React from 'react'

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test App</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('Button clicked!')}>Test Button</button>
    </div>
  )
}

