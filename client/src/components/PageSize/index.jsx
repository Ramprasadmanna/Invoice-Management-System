import PropTypes from 'prop-types';

const PageSize = ({ handlePageSize }) => {
  return (
    <select
      onChange={handlePageSize}
      className='cursor-pointer rounded-md border border-wovBlue bg-transparent px-5 py-2.5 pr-8 text-sm text-wovBlue focus:outline-0 focus:ring-0 active:outline-0 active:ring-0'>
      <option value='20'>20 Rows Per Page</option>
      <option value='30'>30 Rows Per Page</option>
      <option value='40'>40 Rows Per Page</option>
      <option value='50'>50 Rows Per Page</option>
      <option value='100'>100 Rows Per Page</option>
    </select>
  );
};

PageSize.propTypes = {
  handlePageSize: PropTypes.func,
};

export default PageSize;
