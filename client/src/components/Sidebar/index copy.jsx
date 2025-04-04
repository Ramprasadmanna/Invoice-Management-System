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
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const SideBar = ({ showSidebar, setShowSidebar }) => {
  const [collapse, setcollapse] = useState(false);

  const location = useLocation();

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
          name: 'GST Summary',
          path: '/invoice/gst-sale-summary',
        },
      ],
    },
    {
      name: 'Summary',
      path: '/summary',
      icon: ChartBarIcon,
      children: [
        {
          name: 'GST Sales',
          path: '/summary/gst-sales-summary',
        },
      ],
    },
  ];

  return (
    <nav
      className={`${showSidebar ? 'left-0' : '-left-[300px]'} fixed z-50 h-full max-w-[400px] border-r border-slate-300 bg-white px-6 py-4 transition-all duration-500 md:relative md:left-0 md:row-span-2`}>
      <div
        onClick={() => setcollapse(!collapse)}
        className='absolute right-0 top-5 hidden h-6 w-6 translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-indigo-950'>
        <ChevronLeftIcon className='h-4 w-4 text-white' strokeWidth='2.5' />
      </div>
      <div
        onClick={() => setShowSidebar(!showSidebar)}
        className='absolute right-0 top-5 z-999 flex h-6 w-6 shrink-0 translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-indigo-950 md:hidden'>
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

      <ul className='mt-6 flex h-[90%] flex-col gap-4 overflow-y-scroll scrollbar-none'>
        {navLinks.map((navItem, index) => {
          const isParentActive =
            location.pathname.startsWith(navItem.path) ||
            location.pathname === navItem.path;

          return (
            <li key={index}>
              {/* <NavLink
                end={true}
                to={
                  navItem.path === '/invoice'
                    ? '/'
                    : `${navItem.path.toLowerCase().replaceAll(' ', '')}`
                }
                className={({ isActive }) =>
                  `flex cursor-pointer items-center gap-4 rounded-md px-4 py-2 transition-colors ${isActive || isParentActive ? 'bg-blue-950 text-slate-100' : 'hover:bg-slate-200'}`
                }>
                {
                  <navItem.icon
                    className={`size-6 shrink-0 text-inherit`}
                  />
                }
                <p className='font-semibold'>{navItem.name}</p>

                {navItem?.children?.length && (
                  <ChevronDownIcon
                    className={`ml-auto size-5 text-inherit`}
                    strokeWidth='2.5'
                  />
                )}
              </NavLink> */}
              <div
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 transition-colors ${isParentActive ? 'bg-blue-950 text-slate-100' : 'hover:bg-slate-200'}`}>
                <navItem.icon className={`size-5 shrink-0 text-inherit`} />
                <p className='text-sm font-medium'>{navItem.name}</p>
                {navItem?.children?.length && (
                  <ChevronDownIcon
                    className={`ml-auto size-4 text-inherit`}
                    strokeWidth='2.5'
                  />
                )}
              </div>

              {/* Sub Childrens */}
              {navItem.children && (
                <ul
                  className={`flex flex-col gap-2 overflow-hidden border border-red-500 pl-4 pt-4 transition-all duration-300`}>
                  {navItem.children.map((children, index) => (
                    <li key={index}>
                      <NavLink
                        to={children.path}
                        className={({ isActive }) =>
                          `flex cursor-pointer gap-2 text-sm ${isActive ? 'font-semibold text-indigo-950' : 'text-slate-500 hover:text-indigo-800'}`
                        }>
                        <ArrowTurnDownRightIcon className='h-4 w-4' />
                        <p>{children.name}</p>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

SideBar.propTypes = {
  showSidebar: PropTypes.bool.isRequired,
  setShowSidebar: PropTypes.func.isRequired,
};

export default SideBar;
