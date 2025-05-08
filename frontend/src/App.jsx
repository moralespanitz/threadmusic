import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Bookmarks from './Pages/Bookmarks';
import RightSidebar from './components/RightSidebar';

function App() {
  const location = useLocation();

  return (
    <div className="d-flex w-100">
      <Navbar />

      <div className="flex-grow-1 d-flex justify-content-center position-relative" style={{ marginTop: '2rem' }}>
        {/* Post Content */}
        <div
          className="content-container"
          style={{
            maxWidth: '650px',
            width: '100%',
            padding: '0 1rem',
          }}
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home />
                  </PageTransition>
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
            </Routes>
          </AnimatePresence>
        </div>

        {/* Floating Sidebar beside content */}
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
  );
}

export default App;

// Page animation wrapper
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
