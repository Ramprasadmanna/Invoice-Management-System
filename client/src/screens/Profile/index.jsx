import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Alert from '@components/Alert';
import Loader from '@components/Loader';
import { setCredentials } from '@slices/authSlice';
import { Link } from 'react-router-dom';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetAllUserQuery,
  useUpdateMutation,
} from '@slices/userApiSlice';
import {
  CheckCircleIcon,
  PencilSquareIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import checkSessionExpired from '@utils/checkSession';
import AddUserForm from './AddUserForm';
import { Delete } from '@components/Actions';

const ProfileScreen = () => {
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [initinalData, setInitinalData] = useState(null);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // API Slice Query
  const {
    data: userList,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAllUserQuery();

  // API Slice Mutations
  const [createUser, { isLoading: loadingCreateUser }] =
    useCreateUserMutation();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useUpdateMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setId(userInfo.id);
    }
  }, [userInfo]);

  const handleOpenAddForm = () => {
    setInitinalData(null);
    setShowAddUserForm(true);
  };

  // Edit Data Handler Function
  const handleEdit = (data) => {
    setShowAddUserForm(true);
    setInitinalData(data);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const response = await updateProfile({
          id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(response));
        setPassword('');
        setConfirmPassword('');
        toast.success('Profile updated');
      } catch (error) {
        if (!checkSessionExpired(error, dispatch)) {
          console.error(error);
          return toast.error(error?.data?.message || error?.message);
        }
      }
    }
  };

  const userSubmitHandler = async (userData) => {
    if (initinalData) {
      try {
        const response = await updateProfile({
          ...userData,
          id: initinalData.id,
        }).unwrap();
        toast.success('User Updated Sucessfully');
        setInitinalData(null);
        setShowAddUserForm(false);
      } catch (error) {
        if (!checkSessionExpired(error, dispatch)) {
          console.error(error);
          return toast.error(error?.data?.message || error?.message);
        }
      }
    } else {
      try {
        await createUser(userData).unwrap();
        toast.success('User Added SucessFully');
        setShowAddUserForm(false);
        refetch();
      } catch (error) {
        if (!checkSessionExpired(error, dispatch)) {
          console.error(error);
          return toast.error(error?.data?.message || error?.message);
        }
      }
    }
  };

  return (
    <div className='scrollbar-none overflow-y-scroll bg-white'>
      <div className='mx-auto max-w-2xl px-4 pt-10 pb-10 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>
          Your Profile
        </h1>

        <form onSubmit={submitHandler}>
          <div className='mt-16 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-3'>
            <div>
              <h2 className='text-base leading-7 font-semibold text-slate-900'>
                Personal Information
              </h2>
              <p className='mt-1 text-sm leading-6 text-slate-600'>
                Update your personal information.
              </p>
            </div>

            <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
              <div className='sm:col-span-full'>
                <label
                  htmlFor='full-name'
                  className='block text-sm leading-6 font-medium text-slate-900'>
                  Full Name
                </label>
                <div className='mt-2'>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id='full-name'
                    type='text'
                    className='focus:ring-wovBlue block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-slate-300 transition-all ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-full'>
                <label
                  htmlFor='email'
                  className='block text-sm leading-6 font-medium text-slate-900'>
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id='email'
                    type='email'
                    disabled
                    className='focus:ring-wovBlue block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-slate-300 transition-all ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset disabled:cursor-not-allowed disabled:bg-slate-100 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='password'
                  className='block text-sm leading-6 font-medium text-slate-900'>
                  Password
                </label>
                <div className='mt-2'>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id='password'
                    type='password'
                    className='focus:ring-wovBlue block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-slate-300 transition-all ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
              <div className='sm:col-span-3'>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm leading-6 font-medium text-slate-900'>
                  Confirm Password
                </label>
                <div className='mt-2'>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id='confirmPassword'
                    type='password'
                    className='focus:ring-wovBlue block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-slate-300 transition-all ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 flex items-center justify-end gap-x-6'>
            <button
              type='submit'
              disabled={loadingUpdateProfile}
              className='bg-wovBlue focus-visible:outline-wovBlue rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed'>
              {loadingUpdateProfile ? 'Loading...' : 'Update'}
            </button>
          </div>
        </form>
      </div>

      <div className='mx-auto max-w-2xl px-4 pt-10 pb-10 sm:px-6 lg:max-w-7xl lg:px-8'>
        <div className='flex justify-between gap-4'>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>
            All Users
          </h1>

          <button
            onClick={handleOpenAddForm}
            className='bg-wovBlue flex w-fit cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm text-white transition-transform duration-500 active:scale-90'>
            <UserPlusIcon className='size-5' />
            Add User
          </button>
        </div>

        {isFetching ? (
          <Loader />
        ) : isError ? (
          <Alert type='error'>{error?.data?.message || error?.message}</Alert>
        ) : (
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300'>
                  <thead>
                    <tr>
                      <th
                        scope='col'
                        className='py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0'>
                        ID
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                        Name
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                        Email
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                        Admin
                      </th>
                      <th
                        scope='col'
                        className='relative py-3.5 pr-4 pl-3 sm:pr-0'>
                        <span className='sr-only'>Buttons</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {userList.map((user) => (
                      <tr key={user.id}>
                        <td className='py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0'>
                          {user.id}
                        </td>
                        <td className='px-3 py-4 text-sm whitespace-nowrap text-gray-500 capitalize'>
                          {user.name}
                        </td>
                        <td className='px-3 py-4 text-sm whitespace-nowrap text-gray-500'>
                          <span className='font-bold'>{user.email}</span>
                        </td>
                        <td className='px-3 py-4 text-sm whitespace-nowrap text-gray-500'>
                          {user.isAdmin ? (
                            <CheckCircleIcon className='h-5 w-5 text-green-600' />
                          ) : (
                            ''
                          )}
                        </td>
                        <td className='relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0'>
                          <div className='flex gap-4'>
                            <button
                              onClick={() => handleEdit(user)}
                              className='text-wovBlue ml-auto ring-wovBlue flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-1 text-sm font-semibold shadow-xs ring-1 ring-inset hover:bg-white'>
                              <PencilSquareIcon className='h-3 w-3' />
                              Edit
                            </button>

                            <Delete
                              queryfunc={useDeleteUserMutation}
                              id={user.id}
                              message='Customer Deleted Sucessfully'
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <AddUserForm
          showForm={showAddUserForm}
          setShowForm={setShowAddUserForm}
          handleSubmitData={userSubmitHandler}
          initinalData={initinalData}
          setInitinalData={setInitinalData}
          loadingCreateUser={loadingCreateUser}
          loadingUpdateProfile={loadingUpdateProfile}
        />
      </div>
    </div>
  );
};

export default ProfileScreen;
