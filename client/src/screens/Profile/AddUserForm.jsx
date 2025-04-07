import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const AddUserForm = ({
  showForm,
  setShowForm,
  handleSubmitData,
  initinalData,
  setInitinalData,
  loadingCreateUser,
  loadingUpdateProfile,
}) => {
  // Forms UseState
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //  ------ Event Handler

  // Handle Close Form
  const handleCloseForm = () => {
    setShowForm(false);
    if (initinalData) {
      setInitinalData(null);
    }
  };

  // Set Initinal Data For Edit Mode
  const fillInitinalData = ({ name, email }) => {
    setName(name);
    setEmail(email);
  };

  // Clear Form After Submitting
  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  // Verify Data Before Submitting
  const handleVerifyData = (e) => {
    e.preventDefault();

    if (!name) {
      return toast.error('Invalid Name');
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return toast.error('Enter Valid Email');
    }

    if (!initinalData && !password) {
      return toast.error('Invalid Password');
    }

    if (!initinalData && !confirmPassword) {
      return toast.error('Invalid Confirm Password');
    }

    if (password !== confirmPassword) {
      return toast.error('Password And Confirm Password Not Matching');
    }

    const user = {
      name,
      email,
      password,
    };

    handleSubmitData(user);
  };

  // ------ Use Effects

  useEffect(() => {
    if (initinalData) {
      fillInitinalData(initinalData);
    } else {
      clearForm();
    }
  }, [initinalData, showForm]);

  return (
    <div
      className={`fixed px-6 transition-all duration-300 ${showForm ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgb(0,0,0,0.5)]`}>
      <div className='relative z-50 flex max-h-[600px] w-[400px] flex-col rounded-md bg-white shadow-md'>
        <p className='bg-wovBlue rounded-t-md py-5 text-center text-xl font-semibold text-white'>
          {initinalData ? 'Edit User' : 'Add New User'}
        </p>
        <div
          onClick={handleCloseForm}
          className='absolute top-0 right-0 w-fit translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white p-0.5'>
          <XMarkIcon className='size-5' />
        </div>

        <form
          onSubmit={handleVerifyData}
          className='scrollbar-none max-h-full w-full space-y-8 overflow-x-hidden overflow-y-scroll p-6'>
          <div className='grid grid-cols-1 gap-4'>
            <div className='name'>
              <label
                htmlFor='name'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Name  <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='name'
                  type='text'
                  placeholder='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setName(name.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='email'>
              <label
                htmlFor='email'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Email  <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-4'>
                <input
                  id='email'
                  type='text'
                  disabled={initinalData ? true : false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmail(email.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='password'>
              <label
                htmlFor='password'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Password  <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-4'>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPassword(password.trim())}
                  id='password'
                  type='password'
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='confirm-password'>
              <label
                htmlFor='confirm-password'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Confirm Password  <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-4'>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setConfirmPassword(confirmPassword.trim())}
                  id='confirm-password'
                  type='password'
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>
          </div>

          {/* Submitting Data */}
          <div className='flex items-center justify-center border-t border-slate-900/10'>
            <button
              className='bg-wovBlue mt-8 w-full rounded-md px-4 py-2 text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-80'
              disabled={loadingUpdateProfile || loadingCreateUser}>
              {initinalData
                ? loadingUpdateProfile
                  ? 'Updating User...'
                  : 'Update User'
                : loadingCreateUser
                  ? 'Adding User...'
                  : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddUserForm.propTypes = {
  showForm: PropTypes.bool,
  setShowForm: PropTypes.func,
  handleSubmitData: PropTypes.func,
  initinalData: PropTypes.object,
  setInitinalData: PropTypes.func,
  loadingCreateUser: PropTypes.bool,
  loadingUpdateProfile: PropTypes.bool,
};

export default AddUserForm;
