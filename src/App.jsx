import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/layout/NavBar'

import DiscoverHome from './pages/discover/DiscoverHome'
import ByMuscleGroup from './pages/discover/ByMuscleGroup'
import ByGoal from './pages/discover/ByGoal'
import ByWorkoutType from './pages/discover/ByWorkoutType'
import ByEquipment from './pages/discover/ByEquipment'

import TodayGym from './pages/today/TodayGym'
import TodayHome from './pages/today/TodayHome'
import ExerciseLog from './pages/today/ExerciseLog'
import QRScan from './pages/today/QRScan'

import MartialArtsHome from './pages/martial-arts/MartialArtsHome'
import MuayThaiOverview from './pages/martial-arts/MuayThaiOverview'
import KravMagaOverview from './pages/martial-arts/KravMagaOverview'
import BJJOverview from './pages/martial-arts/BJJOverview'
import BJJPositionalMap from './pages/martial-arts/BJJPositionalMap'
import TechniqueDetail from './pages/martial-arts/TechniqueDetail'
import CombinationCard from './pages/martial-arts/CombinationCard'
import ScenarioDetail from './pages/martial-arts/ScenarioDetail'

import WorkoutComplete from './pages/utility/WorkoutComplete'
import PlateCalculator from './pages/utility/PlateCalculator'

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

        <Route path="/discover/martial-arts" element={<MartialArtsHome />} />
        <Route path="/discover/martial-arts/muay-thai" element={<MuayThaiOverview />} />
        <Route path="/discover/martial-arts/krav-maga" element={<KravMagaOverview />} />
        <Route path="/discover/martial-arts/bjj" element={<BJJOverview />} />
        <Route path="/discover/martial-arts/bjj/map" element={<BJJPositionalMap />} />
        <Route path="/discover/martial-arts/:art/technique/:id" element={<TechniqueDetail />} />
        <Route path="/discover/martial-arts/muay-thai/combo/:id" element={<CombinationCard />} />
        <Route path="/discover/martial-arts/krav-maga/scenario/:id" element={<ScenarioDetail />} />

        <Route path="/today" element={<TodayGym />} />
        <Route path="/today/home" element={<TodayHome />} />
        <Route path="/today/exercise/:id" element={<ExerciseLog />} />
        <Route path="/today/qr" element={<QRScan />} />
        <Route path="/today/complete" element={<WorkoutComplete />} />
        <Route path="/today/plate-calc" element={<PlateCalculator />} />
      </Routes>
      <NavBar />
    </div>
  )
}
