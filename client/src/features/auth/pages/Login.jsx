import { useState } from 'react';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';
import AuthLayout from '../components/AuthLayout';
import { Link } from 'react-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Log in to your account"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <Input
          id="email"
          label="Email address"
          type="email"
          placeholder="Enter Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex flex-col">
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end mt-2">
            <Link to="/forgot-password" 
              type="button" 
              className="text-xs font-semibold text-blue-900 hover:cursor-pointer"
            >
              Forgot Password ?
            </Link>
          </div>
        </div>

        <Button type="submit" className="mt-2">
          Log In
        </Button>
      </form>

      {/* Footer Section */}
      <div className="mt-2 text-center text-sm">
        <p className="text-slate-600">
          Don't have an account ?{' '}
          <Link to="/signup" className="text-blue-900 font-bold hover:cursor-pointer">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
