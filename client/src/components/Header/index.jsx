import { Bars3Icon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = ({ setShowSidebar }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { name, isAdmin } = userInfo;
  return (
    <header className='flex w-full justify-between border-b border-slate-300 bg-white px-4 py-4 md:px-10'>
      <div
        onClick={() => setShowSidebar((prev) => !prev)}
        className='flex items-center md:invisible'>
        <Bars3Icon className='h-6 w-6' />
      </div>

      <Link to='/profile'>
        <div className='flex items-center gap-2'>
          <div className='size-10 overflow-hidden rounded-full'>
            {/* <img src='/Images/user.jpg' alt='User Image' /> */}
            <img
              src='/Images/User2.png'
              alt='User Image'
            />
          </div>
          <div>
            <p className='text-sm font-semibold capitalize'>{name}</p>
            <p className='text-xs font-medium text-slate-500'>
              {isAdmin && 'Admin'}
            </p>
          </div>
        </div>
      </Link>
    </header>
  );
};

Header.propTypes = {
  setShowSidebar: PropTypes.func.isRequired,
};

export default Header;
