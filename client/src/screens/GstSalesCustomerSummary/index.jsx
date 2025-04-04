import { useEffect, useState } from 'react';
import {
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import {
  useGetGstSalesSummaryQuery,
  useDownloadGstSalesSummaryExcelMutation,
} from '@slices/gstSalesApiSlice';
import { toast } from 'react-toastify';
import Alert from '@components/Alert';
import Loader from '@components/Loader';
import { ClipLoader } from 'react-spinners';
import Summary from './Summary';
import YearNavigator from '@components/YearSelector';

const GstSalesCustomerSummaryScreen = () => {
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [showDownloadOption, setShowDownloadOption] = useState(false);
  const [year, setYear] = useState(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth < 4 ? currentYear - 1 : currentYear;
  });

  // API Slice Query
  const { data, isError, error, isFetching } = useGetGstSalesSummaryQuery({
    keyword,
    year,
  });

  // API Slice Mutatuion
  const [downloadExcel, { isLoading: downloadExcelLoading }] =
    useDownloadGstSalesSummaryExcelMutation();

  // Debounce Search Function
  useEffect(() => {
    const handler = setTimeout(() => {
      setKeyword(search.trim());
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // const handlePreviousYear = () => {
  //   setYear(+year - 1);
  // };

  // const handleCurrentYear = () => {
  //   const currentYear = new Date().getFullYear();
  //   const currentMonth = new Date().getMonth() + 1;
  //   setYear(currentMonth < 4 ? currentYear - 1 : currentYear);
  // };

  // const handleNextYear = () => {
  //   setYear(+year + 1);
  // };

  // Download Excel File
  const handleDownloadExcel = async () => {
    try {
      const url = await downloadExcel({ year, keyword }).unwrap();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${Date.now()}.xlsx`;
      link.click();
      link.remove();
      toast.success('Excel File Downloaded');
    } catch (error) {
      console.error(error);
      toast.error('Error Downloading Excel File');
    }
  };

  return (
    <div className='scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 flex flex-col gap-8 overflow-x-hidden overflow-y-scroll p-4 sm:p-6'>
      {/* Header */}
      <div className='flex flex-col items-center justify-between gap-6 xl:flex-row'>
        <p className='text-2xl font-semibold'>
          GST Sales Customer Summary ({`${year}-${year + 1}`})
        </p>

        <div className='flex w-full flex-wrap justify-end gap-4 lg:flex-nowrap'>
          <div className='flex w-full grow-1 items-center gap-3 rounded-lg bg-slate-300 px-4 py-1.5 xl:max-w-80'>
            <MagnifyingGlassIcon className='h-4 w-4 shrink-0 text-slate-800' />
            <input
              type='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Customer Name / ID'
              className='w-full border-none bg-transparent p-1 text-sm placeholder:text-slate-500 focus:ring-0'
            />
          </div>

          <div className='relative z-10'>
            <button
              onClick={() => setShowDownloadOption(!showDownloadOption)}
              className='bg-wovBlue flex grow cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm text-white transition-transform duration-500 active:scale-95 sm:grow-0'>
              <ArrowUpTrayIcon className='size-5' />
              Export
            </button>

            {showDownloadOption && (
              <ul className='absolute top-14 right-0 flex flex-col gap-2 rounded-md bg-white p-2 text-sm shadow-md'>
                <li>
                  <button
                    onClick={handleDownloadExcel}
                    disabled={downloadExcelLoading}
                    className={`${!downloadExcelLoading && 'hover:bg-wovBlue transition-colors duration-300 hover:text-white'} border-wovBlue text-wovBlue flex w-full items-center justify-between gap-2 rounded-md border px-3 py-1.5 whitespace-nowrap disabled:cursor-not-allowed`}>
                    Excel File
                    {downloadExcelLoading ? (
                      <ClipLoader
                        size={15}
                        speedMultiplier={1}
                        color='#1e265a'
                      />
                    ) : (
                      <TableCellsIcon className='size-5 shrink-0' />
                    )}
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <YearNavigator year={year} setYear={setYear} />

      {isFetching ? (
        <Loader />
      ) : isError ? (
        <Alert type='error'>
          {error?.data?.message || 'Something Went Wrong'}
        </Alert>
      ) : data.length ? (
        <div className='flex flex-col gap-4'>
          {data.map((saleDetails, index) => (
            <Summary saleDetails={saleDetails} key={index} />
          ))}
        </div>
      ) : (
        <Alert type='info'>No GST Sales Found</Alert>
      )}
    </div>
  );
};

export default GstSalesCustomerSummaryScreen;
