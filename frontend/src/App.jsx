import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useUser, useClerk } from '@clerk/clerk-react';
import { AnimatePresence, motion } from 'framer-motion';

import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Bookmarks from './Pages/Bookmarks';

import Navbar from './components/Navbar';
import RightSidebar from './components/RightSidebar';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

function App() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    if (authLoaded && userLoaded) {
      setHasCheckedSession(true);
    }
  }, [authLoaded, userLoaded]);

  useEffect(() => {
    if (!authLoaded || !userLoaded || !hasCheckedSession) return;

    const publicRoutes = ['/login', '/register', '/sign-in', '/sign-up', '/factor-one'];
    const protectedRoutes = ['/home', '/profile', '/bookmarks'];
    const currentPath = location.pathname;

    if (isSignedIn) {
      if (publicRoutes.some(route => currentPath.startsWith(route))) {
        navigate('/home', { replace: true });
      }
    } else {
      if (protectedRoutes.some(route => currentPath.startsWith(route))) {
        navigate('/login', { replace: true });
      }
    }
  }, [isSignedIn, authLoaded, userLoaded, hasCheckedSession, location, navigate]);

  // Mostrar data del usuario logeado
  useEffect(() => {
    if (userLoaded && isSignedIn && user) {
      console.log("Usuario logeado:", user);
    }
  }, [userLoaded, isSignedIn, user]);

  if (!authLoaded || !userLoaded || !hasCheckedSession) {
    return null;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar izquierdo (Navbar) */}
        {isSignedIn && (
          <div className="col-3 d-none d-md-block p-0">
            <Navbar />
          </div>
        )}

        {/* Contenido central */}
        <div className="col-12 col-md-7 col-lg-4 px-3 mx-auto" style={{ minHeight: '100vh' }}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route
                path="/login/*"
                element={
                  !isSignedIn ? (
                    <PageTransition><Login /></PageTransition>
                  ) : (
                    <Navigate to="/home" replace />
                  )
                }
              />
              <Route
                path="/register/*"
                element={
                  !isSignedIn ? (
                    <PageTransition><Register /></PageTransition>
                  ) : (
                    <Navigate to="/home" replace />
                  )
                }
              />
              <Route path="/sign-in/*" element={<Login />} />
              <Route path="/sign-up/*" element={<Register />} />
              <Route path="/factor-one/*" element={<Login />} />
              <Route
                path="/home"
                element={
                  isSignedIn ? (
                    <PageTransition><Home /></PageTransition>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  isSignedIn ? (
                    <PageTransition><Profile /></PageTransition>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/bookmarks"
                element={
                  isSignedIn ? (
                    <PageTransition><Bookmarks /></PageTransition>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AnimatePresence>
        </div>

        {/* Sidebar derecho */}
        {isSignedIn && (
          <div className="col-lg-3 d-none d-lg-block p-0">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
