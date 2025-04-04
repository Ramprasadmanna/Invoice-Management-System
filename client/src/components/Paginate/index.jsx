import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const Paginate = ({ pages, page, setPageNumber }) => {
  return (
    pages > 1 && (
      <nav className='sticky left-0 mt-6 mb-6 flex items-center justify-between gap-10 border-t border-gray-200 px-4 sm:px-0'>
        <div className='-mt-px flex flex-1'>
          {page > 1 ? (
            <button
              onClick={() => setPageNumber((prev) => prev - 1)}
              className='inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'>
              <ArrowLongLeftIcon
                aria-hidden='true'
                className='mr-3 h-5 w-5 text-gray-400'
              />
              Previous
            </button>
          ) : (
            <span className='inline-flex cursor-not-allowed items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-300'>
              <ArrowLongLeftIcon
                aria-hidden='true'
                className='mr-3 h-5 w-5 text-gray-300'
              />
              Previous
            </span>
          )}
        </div>

        <div className='hidden overflow-x-scroll scrollbar-none md:-mt-px md:flex'>
          {[...Array(pages).keys()].map((x) => (
            <button
              key={x + 1}
              onClick={() => setPageNumber(x + 1)}
              className={`inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium ${x + 1 === page ? 'border-wovBlue text-wovBlue' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
              {x + 1}
            </button>
          ))}
        </div>

        <div className='-mt-px flex flex-1 justify-end'>
          {page < pages ? (
            <button
              onClick={() => setPageNumber((prev) => prev + 1)}
              className='inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'>
              Next
              <ArrowLongRightIcon
                aria-hidden='true'
                className='ml-3 h-5 w-5 text-gray-400'
              />
            </button>
          ) : (
            <span className='inline-flex cursor-not-allowed items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-300'>
              Next
              <ArrowLongRightIcon
                aria-hidden='true'
                className='ml-3 h-5 w-5 text-gray-300'
              />
            </span>
          )}
        </div>
      </nav>
    )
  );
};

Paginate.propTypes = {
  pages: PropTypes.number,
  page: PropTypes.number,
  setPageNumber: PropTypes.func,
};

export default Paginate;
