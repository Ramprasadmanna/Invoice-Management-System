import PropTypes from 'prop-types';

const PageSize = ({ pageSize, setPageSize, setPageNumber }) => {
  const handlePageSize = (e) => {
    setPageSize(+e.target.value);
    setPageNumber(1);
  };

  return (
    <select
      onChange={handlePageSize}
      value={pageSize}
      className='border-wovBlue text-wovBlue cursor-pointer rounded-md border bg-transparent px-5 py-2.5 pr-8 text-sm focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'>
      <option value='20'>20 Rows Per Page</option>
      <option value='30'>30 Rows Per Page</option>
      <option value='40'>40 Rows Per Page</option>
      <option value='50'>50 Rows Per Page</option>
      <option value='100'>100 Rows Per Page</option>
    </select>
  );
};

PageSize.propTypes = {
  pageSize: PropTypes.number,
  setPageSize: PropTypes.func,
  setPageNumber: PropTypes.func,
};

export default PageSize;
