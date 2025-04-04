import { logout } from '@slices/authSlice';
import { toast } from 'react-toastify';

const checkSessionExpired = (error, dispatch) => {
  if (error?.status === 401) {
    toast.error('Session Expired, Login Again');
    dispatch(logout());
    return true;
  }
  return false;
};

export default checkSessionExpired;
