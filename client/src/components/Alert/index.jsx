import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const Alert = ({ type = 'info', children: message }) => {
  const icons = {
    success: <CheckCircleIcon className='h-5 w-5 text-green-600' />,
    error: <XCircleIcon className='h-5 w-5 text-red-600' />,
    info: <InformationCircleIcon className='h-5 w-5 text-indigo-600' />,
    warning: <ExclamationCircleIcon className='h-5 w-5 text-yellow-600' />,
  };

  return (
    <div
      className={`mb-3 mt-6 rounded-lg border bg-white px-3 py-3 text-sm ${type === 'info' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : type === 'sucess' ? 'border-green-600 bg-green-50 text-green-700' : type === 'error' ? 'border-red-600 bg-red-50 text-red-700' : type === 'warning' ? 'border-yellow-600 bg-yellow-50 text-yellow-700' : 'border-gray-600'}`}>
      <div className='flex gap-3'>
        <div>{icons[type]}</div>
        <p>{message}</p>
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  children: PropTypes.node,
};

export default Alert;
