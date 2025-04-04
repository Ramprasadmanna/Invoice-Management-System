import {
  ArrowTurnDownRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavItem = ({ navItem, isParentActive }) => {
  const [showChildren, setShowChildren] = useState(false);

  return (
    <li>
      <div
        onClick={() => setShowChildren(!showChildren)}
        className={`flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 transition-colors ${isParentActive ? 'bg-blue-950 text-slate-100' : 'hover:bg-slate-200'}`}>
        <navItem.icon className={`size-5 shrink-0 text-inherit`} />
        <p className='whitespace-nowrap text-sm font-medium'>{navItem.name}</p>
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
          className={`flex flex-col gap-2 overflow-hidden pl-4 transition-[max-height,padding] duration-500 ${showChildren ? 'max-h-[500px] pt-4' : 'max-h-0 pt-0'}`}>
          {navItem.children.map((children, index) => (
            <li key={index}>
              <NavLink
                to={children.path}
                className={({ isActive }) =>
                  `flex cursor-pointer gap-2 text-sm ${isActive ? 'font-semibold text-indigo-950' : 'text-slate-500 hover:text-indigo-800'}`
                }>
                <ArrowTurnDownRightIcon className='h-4 w-4' />
                <p className='whitespace-nowrap'>{children.name}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

NavItem.propTypes = {
  navItem: PropTypes.object,
  isParentActive: PropTypes.bool,
};

export default NavItem;
