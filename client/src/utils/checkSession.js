import { logout } from '@slices/authSlice';
import { toast } from 'react-toastify';

const checkSessionExpired = (error, dispatch, message) => {
  if (error?.status === 401) {
    toast.error(message ? message : 'Session Expired, Login Again');
    dispatch(logout());
    return true;
  }
  return false;
};

export default checkSessionExpired;
