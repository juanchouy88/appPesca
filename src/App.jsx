import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MobileLayout from './layouts/MobileLayout'
import Feed from './pages/Feed'
import Explore from './pages/Explore'
import CreateCatch from './pages/CreateCatch'
import Rankings from './pages/Rankings'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/explorar" element={<Explore />} />
          <Route path="/crear" element={<CreateCatch />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
