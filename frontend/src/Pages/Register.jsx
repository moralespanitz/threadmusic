import { Link } from 'react-router-dom';
import '../styles/AuthStyles.css';

const Register = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Create Your Account 🎶</h2>
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Register</button>
        <div className="toggle">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
