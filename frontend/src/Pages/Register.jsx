import { SignUp } from '@clerk/clerk-react';
import '../styles/AuthStyles.css';

const Register = () => {
  return (
    <div className="auth-wrapper">
      <SignUp path="/register" routing="path" signInUrl="/login" />
    </div>
  );
};

export default Register;
