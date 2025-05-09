import { useState, useEffect } from 'react';
import { useLocation, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Bookmarks from './Pages/Bookmarks';
import Login from './Pages/Login';
import Register from './Pages/Register';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Redirige al home tras autenticarse
  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {isAuthRoute ? (
        // Rutas públicas (login y register)
        <div className="w-100">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/login"
                element={
                  <PageTransition>
                    <Login onLogin={() => setIsAuthenticated(true)} />
                  </PageTransition>
                }
              />
              <Route
                path="/register"
                element={
                  <PageTransition>
                    <Register />
                  </PageTransition>
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </AnimatePresence>
        </div>
      ) : (
        // Rutas privadas con layout
        <div className="d-flex w-100">
          <Navbar />

          <div className="flex-grow-1 d-flex justify-content-center position-relative" style={{ marginTop: '2rem' }}>
            <div
              className="content-container"
              style={{
                maxWidth: '650px',
                width: '100%',
                padding: '0 1rem',
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <Routes location={location} key={location.pathname}>
                  <Route
                    path="/"
                    element={
                      isAuthenticated ? (
                        <PageTransition>
                          <Home />
                        </PageTransition>
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PageTransition>
                        <Profile />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/bookmarks"
                    element={
                      <PageTransition>
                        <Bookmarks />
                      </PageTransition>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AnimatePresence>
            </div>

            <div
              className="d-none d-md-block"
              style={{
                position: 'absolute',
                left: 'calc(50% + 325px)',
                top: 0,
                paddingTop: '2rem',
                width: '250px',
              }}
            >
              <RightSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
