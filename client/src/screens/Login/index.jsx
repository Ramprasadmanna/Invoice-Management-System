import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useLoginMutation } from '@slices/userApiSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { setCredentials } from '@slices/authSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasssword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const redirect = '/invoice/home';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo]);

  const handleVerifyData = (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error('Enter Valid Email Id');
    }
    if (!password) {
      return toast.error('Enter Valid Password');
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      const response = await login({ email, password }).unwrap();
      toast.success(`Welcome Back ${response?.name}`);
      dispatch(setCredentials({ ...response }));
      navigate(redirect);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className='mt-10'>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='flex justify-center'>
          <img
            className='w-20'
            src='/Images/Logo.png'
            alt='World On Vastu Logo'
          />
        </div>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-center text-2xl leading-9 font-semibold tracking-tight text-gray-900'>
            Invoice Management System
          </h2>
          <p className='font-regular mt-2 text-center text-sm text-slate-500'>
            Login To Your Account
          </p>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={handleVerifyData} className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Email
              </label>
              <div className='mt-2'>
                <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='focus:ring-wovBlue block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Password
              </label>
              <div className='relative mt-2'>
                <input
                  type={showPasssword ? 'text' : 'password'}
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='focus:ring-wovBlue block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
                />

                {showPasssword ? (
                  <EyeIcon
                    onClick={() => setShowPassword(!showPasssword)}
                    className='absolute top-1/2 right-2 size-5 -translate-y-1/2 cursor-pointer text-slate-400'
                  />
                ) : (
                  <EyeSlashIcon
                    onClick={() => setShowPassword(!showPasssword)}
                    className='absolute top-1/2 right-2 size-5 -translate-y-1/2 cursor-pointer text-slate-400'
                  />
                )}
              </div>
            </div>

            <div>
              <button
                type='submit'
                className='bg-wovBlue flex w-full justify-center rounded-md px-3 py-1.5 text-sm leading-6 font-semibold text-white shadow-xs active:scale-95'>
                {isLoading ? 'Loading...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
