import { Link } from 'react-router-dom';
import '../styles/AuthStyles.css';

const Login = ({ onLogin }) => {
  const handleLogin = () => {
    // Simulate a successful login
    onLogin(); // This sets isAuthenticated to true in App
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Welcome Back 🎧</h2>
        <input type="text" placeholder="Username or Email" />
        <input type="password" placeholder="Password" />
        <button onClick={handleLogin}>Login</button>
        <div className="toggle">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
