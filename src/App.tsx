import type { ComponentType } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import pages from './pages'
import './styles.css'

export default function App() {
  return (
    <div className="app">
      <nav className="sidebar">
        <h1>Feeling Good CBT</h1>
        <ul>
          {pages.map((p) => (
            <li key={p.path}>
              <Link to={p.path}>{p.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="content">
        <Routes>
          {pages.map((p) => {
            const Component = p.component as ComponentType<any>
            return <Route key={p.path} path={p.path} element={<Component />} />
          })}
        </Routes>
      </main>
    </div>
  )
}
