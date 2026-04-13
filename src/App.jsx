import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/layout/NavBar'

import DiscoverHome from './pages/discover/DiscoverHome'
import ByMuscleGroup from './pages/discover/ByMuscleGroup'
import ByGoal from './pages/discover/ByGoal'
import ByWorkoutType from './pages/discover/ByWorkoutType'
import ByEquipment from './pages/discover/ByEquipment'

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Routes>
        <Route path="/" element={<Navigate to="/discover" replace />} />
        <Route path="/discover" element={<DiscoverHome />} />
        <Route path="/discover/muscle" element={<ByMuscleGroup />} />
        <Route path="/discover/goal" element={<ByGoal />} />
        <Route path="/discover/type" element={<ByWorkoutType />} />
        <Route path="/discover/equipment" element={<ByEquipment />} />
      </Routes>
      <NavBar />
    </div>
  )
}
