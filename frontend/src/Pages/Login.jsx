import { SignIn } from '@clerk/clerk-react';
import '../styles/AuthStyles.css';

const Login = () => {
  return (
    <div className="auth-wrapper">
      <SignIn path="/login" routing="path" signUpUrl="/register" />
    </div>
  );
};

export default Login;