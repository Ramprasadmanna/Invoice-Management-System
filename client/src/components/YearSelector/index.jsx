import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const YearNavigator = ({ year, setYear }) => {
  const handlePreviousYear = () => {
    setYear(+year - 1);
  };

  const handleCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    setYear(currentMonth < 4 ? currentYear - 1 : currentYear);
  };

  const handleNextYear = () => {
    setYear(+year + 1);
  };

  return (
    <div className='flex w-full items-center whitespace-nowrap sm:ml-auto sm:w-fit'>
      <button
        onClick={handlePreviousYear}
        className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-l-md px-3 py-2.5 text-white active:scale-95'>
        <ChevronLeftIcon className='size-5' />
      </button>
      <button
        onClick={handleCurrentYear}
        className='bg-wovBlue flex grow items-center justify-center gap-2 border-r-2 border-l-2 border-slate-50/30 px-3 py-2.5 text-sm text-white uppercase active:scale-95'>
        Current Year
      </button>
      <button
        onClick={handleNextYear}
        className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-r-md px-3 py-2.5 text-white active:scale-95'>
        <ChevronRightIcon className='size-5' />
      </button>
    </div>
  );
};

YearNavigator.propTypes = {
  year: PropTypes.number,
  setYear: PropTypes.func,
};

export default YearNavigator;
