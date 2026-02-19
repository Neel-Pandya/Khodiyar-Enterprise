import AuthLayout from '../components/AuthLayout';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';
import { Link } from 'react-router'

const Signup = () => {
    return (
        <AuthLayout title="Sign Up" subtitle="Start your journey with us">
            <form className="w-full flex flex-col gap-5">
                <Input
                    id="name"
                    label="Name"
                    type="text"
                    placeholder="Enter Name"
                    required
                />
                <Input
                    id="email"
                    label="Email address"
                    type="email"
                    placeholder="Enter Address"
                    required
                />
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter Password"
                    required
                />

                <Input
                    id="confirm-password"
                    label="Confirm Password"
                    type="password"
                    placeholder="Enter Confirm Password"
                    required
                />
                <Button type="submit">Sign Up</Button>


            </form>
            {/* Footer Section */}
            <div className="mt-3 text-center text-sm">
                <p className="text-slate-600">
                    Already have an account ?{' '}
                    <Link to="/login" className="text-blue-900 font-bold hover:cursor-pointer">
                        Login
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}

export default Signup;
