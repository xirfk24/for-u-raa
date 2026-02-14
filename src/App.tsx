import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SpecialPage from './pages/SpecialPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/special" element={<SpecialPage />} />
    </Routes>
  )
}

export default App
