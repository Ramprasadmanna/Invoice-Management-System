import PropTypes from 'prop-types';
import {
  ArrowTurnDownRightIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  HomeIcon,
  NewspaperIcon,
  XMarkIcon,
  ChartPieIcon,
  BuildingOfficeIcon,
  SunIcon,
  CurrencyRupeeIcon,
  FolderIcon,
  PowerIcon,
  ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import { logout } from '@slices/authSlice';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '@slices/userApiSlice';
import { toast } from 'react-toastify';
import checkSessionExpired from '@utils/checkSession';

const SideBar = ({ showSidebar, setShowSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  // API Mutations
  const [logoutApiCall, { isLoading: logoutLoading }] = useLogoutMutation();

  const navLinks = [
    // {
    //   name: 'Overview',
    //   path: '/overview',
    //   icon: HomeIcon,
    // },
    // {
    //   name: 'Live Score',
    //   path: '/livescore',
    //   icon: ChartBarIcon,
    // },
    // {
    //   name: 'Statistics',
    //   path: '/statistics',
    //   icon: ChartPieIcon,
    // },
    // {
    //   name: 'My Business',
    //   path: '/mybusiness',
    //   icon: BuildingOfficeIcon,
    // },
    // {
    //   name: 'My Habits',
    //   path: '/myhabits',
    //   icon: SunIcon,
    // },
    // {
    //   name: 'My Finance',
    //   path: '/myfinance',
    //   icon: CurrencyRupeeIcon,
    // },
    {
      name: 'Invoices',
      path: '/invoice',
      icon: NewspaperIcon,
      children: [
        {
          name: 'Home',
          path: '/invoice/home',
        },
        {
          name: 'Customers',
          path: '/invoice/customers',
        },
        {
          name: 'Items',
          path: '/invoice/items',
        },
        {
          name: 'GST Sales',
          path: '/invoice/gstsales',
        },
        {
          name: 'Sales',
          path: '/invoice/cashsales',
        },
        {
          name: 'GST Orders',
          path: '/invoice/webhook-gst-order',
        },
        {
          name: 'Order',
          path: '/invoice/webhook-order',
        },
        {
          name: 'Purchase Items',
          path: '/invoice/gst-purchase-items',
        },
        {
          name: 'Purchase',
          path: '/invoice/gst-purchase',
        },
        {
          name: 'Expense Items',
          path: '/invoice/expense-items',
        },
        {
          name: 'Expense',
          path: '/invoice/expense',
        },
        {
          name: 'GST Paid',
          path: '/invoice/gst-paid',
        },
      ],
    },
    {
      name: 'Summary',
      path: '/summary',
      icon: ChartBarIcon,
      children: [
        {
          name: 'GST Sales Customer',
          path: '/summary/gst-sales-customer',
        },
        {
          name: 'GST Sales HSN',
          path: '/summary/gst-sales-hsn',
        },
        {
          name: 'GST Sales Product',
          path: '/summary/gst-sales-product',
        },
        {
          name: 'Sales Customer',
          path: '/summary/sales-customer',
        },
        {
          name: 'Sales Product',
          path: '/summary/sales-product',
        },
        {
          name: 'GST Purchase',
          path: '/summary/gst-purchase-items',
        },
        {
          name: 'Expense',
          path: '/summary/expense-items',
        },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
    } catch (error) {
      if (!checkSessionExpired(error, dispatch, 'Logging Out')) {
        console.error(error);
        toast.error(error?.data?.message);
      }
    }
  };

  return (
    <nav
      className={`${showSidebar ? 'left-0' : '-left-[300px]'} fixed z-50 mb-12 flex h-full max-w-[400px] flex-col gap-6 border-r border-slate-300 bg-white px-6 py-4 transition-all duration-500 md:relative md:left-0 md:row-span-2`}>
      {/* <div
        onClick={() => setcollapse(!collapse)}
        className='absolute right-0 top-5 hidden h-6 w-6 translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-indigo-950'>
        <ChevronLeftIcon className='h-4 w-4 text-white' strokeWidth='2.5' />
      </div> */}

      <div
        onClick={() => setShowSidebar(!showSidebar)}
        className='absolute top-5 right-0 z-999 flex h-6 w-6 shrink-0 translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-indigo-950 md:hidden'>
        <XMarkIcon className='h-4 w-4 text-white' strokeWidth='2.5' />
      </div>

      <div>
        <Link to='/'>
          <img
            src='/Images/Logo.png'
            className='mx-auto w-12'
            alt='World On Vaastu Logo'
          />
        </Link>
      </div>

      <ul className='scrollbar-none flex grow flex-col gap-4 overflow-y-scroll'>
        {navLinks.map((navItem, index) => {
          const isParentActive =
            location.pathname.startsWith(navItem.path) ||
            location.pathname === navItem.path;

          return (
            <NavItem
              navItem={navItem}
              key={index}
              isParentActive={isParentActive}
            />
          );
        })}
      </ul>

      <button
        className='flex cursor-pointer items-center justify-center gap-2 rounded-md bg-red-600 px-2.5 py-2 text-sm font-medium text-red-50'
        onClick={handleLogout}
        disabled={logoutLoading}>
        {logoutLoading ? 'Logging Out' : 'Logout'}
        <ArrowRightEndOnRectangleIcon className='size-4' strokeWidth='2.5' />
      </button>
    </nav>
  );
};

SideBar.propTypes = {
  showSidebar: PropTypes.bool.isRequired,
  setShowSidebar: PropTypes.func.isRequired,
};

export default SideBar;
