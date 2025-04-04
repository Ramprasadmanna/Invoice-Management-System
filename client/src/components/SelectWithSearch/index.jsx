import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';

const SelectWithSearch = ({
  state,
  setState,
  list,
  placeholder = 'Search...',
  listPosition = 'bottom',
}) => {
  const [showList, setShowList] = useState(false);

  const filteredList = useMemo(() => {
    return list.filter((item) =>
      item.toLowerCase().includes(state.toLowerCase())
    );
  }, [state, list]);

  const handleInputChange = (e) => {
    setState(e.target.value);
    setShowList(true);
  };

  const handleItemClick = (item) => {
    setState(item);
    setShowList(false);
  };

  const handleBlur = () => {
    setState(state.trim());
    setShowList(false);
  };

  return (
    <div className='relative w-full'>
      <input
        type='text'
        className={`block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0`}
        onChange={handleInputChange}
        value={state}
        placeholder={placeholder}
        onFocus={() => setShowList(true)}
        onBlur={handleBlur}
      />

      {showList && filteredList.length > 0 && (
        <ul
          className={`${listPosition === 'bottom' ? 'top-10' : 'bottom-10'} absolute z-50 max-h-72 w-full overflow-hidden overflow-y-auto rounded-md bg-white shadow-md scrollbar-thin`}>
          {filteredList.map((item, index) => (
            <li
              key={index}
              className='cursor-pointer px-3 py-1.5 text-sm capitalize hover:bg-indigo-700 hover:text-white'
              onMouseDown={() => handleItemClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

SelectWithSearch.propTypes = {
  state: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
  listPosition: PropTypes.oneOf(['bottom', 'top']),
};

export default SelectWithSearch;
