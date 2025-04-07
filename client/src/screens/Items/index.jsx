import { useEffect, useState } from 'react';
import GstItems from './gstItems';
import { ClipLoader } from 'react-spinners';
import {
  ArrowUpTrayIcon,
  BanknotesIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  SquaresPlusIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import {
  useDownloadGstItemPdfMutation,
  useDownloadGstItemExcelMutation,
} from '@slices/gstItemsApiSlice';
import { toast } from 'react-toastify';
import CashItems from './Items';
import {
  useDownloadCashItemExcelMutation,
  useDownloadCashItemPdfMutation,
} from '@slices/cashItemsApiSlice';
import PageSize from '@components/PageSize';
import { useDispatch } from 'react-redux';
import { logout } from '@slices/authSlice';
import checkSessionExpired from '@utils/checkSession';

const ItemsScreen = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [showDownloadOption, setShowDownloadOption] = useState(false);
  const [showGstItemForm, setShowGstItemForm] = useState(false);
  const [showCashItemForm, setShowCashItemForm] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentTab, setCurrentTab] = useState('Gst Items');
  const [pageNumber, setPageNumber] = useState(1);

  // API Slice Mutation
  const [downloadGstItemPdf, { isLoading: downloadGstItemPdfLoading }] =
    useDownloadGstItemPdfMutation();

  const [downloadGstItemExcel, { isLoading: downloadGstItemExcelLoading }] =
    useDownloadGstItemExcelMutation();

  const [downloadCashItemPdf, { isLoading: downloadCashItemPdfLoading }] =
    useDownloadCashItemPdfMutation();

  const [downloadCashItemExcel, { isLoading: downloadCashItemExcelLoading }] =
    useDownloadCashItemExcelMutation();

  // Debounce Search Function
  useEffect(() => {
    const handler = setTimeout(() => {
      setKeyword(search);
      setPageNumber(1);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Download Pdf File
  const handleDownloadPdf = async () => {
    const downloadFunction =
      currentTab === 'Gst Items' ? downloadGstItemPdf : downloadCashItemPdf;
    try {
      const url = await downloadFunction({
        keyword,
        pageNumber,
        pageSize,
      }).unwrap();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${Date.now()}.pdf`;
      link.click();
      link.remove();
      toast.success('PDF File Downloaded');
    } catch (error) {
      if (!checkSessionExpired(error, dispatch)) {
        console.error(error);
        return toast.error('Error Downloading PDF File');
      }
    }
  };

  // Download Excel File
  const handleDownloadExcel = async () => {
    const downloadFunction =
      currentTab === 'Gst Items' ? downloadGstItemExcel : downloadCashItemExcel;
    try {
      const url = await downloadFunction({
        keyword,
        pageNumber,
        pageSize,
      }).unwrap();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${Date.now()}.xlsx`;
      link.click();
      link.remove();
      toast.success('Excel File Downloaded');
    } catch (error) {
      if (!checkSessionExpired(error, dispatch)) {
        console.error(error);
        return toast.error('Error Downloading EXCEL File');
      }
    }
  };

  return (
    <>
      <div className='scrollbar-none flex flex-col gap-6 overflow-hidden p-4 sm:p-6'>
        {/* Header */}
        <div className='flex flex-col justify-between gap-6 xl:flex-row'>
          <p className='text-2xl font-semibold md:text-3xl'>Items</p>

          <div className='flex flex-wrap justify-end gap-4'>
            <div className='flex min-w-full flex-1 items-center gap-3 rounded-lg bg-slate-300 px-4 py-1.5 lg:min-w-fit'>
              <MagnifyingGlassIcon className='h-4 w-4 text-slate-800' />
              <input
                type='search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Name / HSN / Desc'
                className='w-full border-none bg-transparent p-1 text-sm placeholder:text-slate-500 focus:ring-0'
              />
            </div>

            {currentTab === 'Gst Items' ? (
              <button
                onClick={() => setShowGstItemForm(true)}
                className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm text-white transition-transform duration-500 active:scale-90 sm:grow-0'>
                <SquaresPlusIcon className='size-5' />
                Add GST Items
              </button>
            ) : (
              <button
                onClick={() => setShowCashItemForm(true)}
                className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm text-white transition-transform duration-500 active:scale-90 sm:grow-0'>
                <BanknotesIcon className='size-5' />
                Add Item
              </button>
            )}

            <div className='relative z-50'>
              <button
                onClick={() => setShowDownloadOption(!showDownloadOption)}
                className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm text-white transition-transform duration-500 active:scale-95 sm:grow-0'>
                <ArrowUpTrayIcon className='size-5' />
                Export
              </button>

              {showDownloadOption && (
                <ul className='absolute top-14 right-0 flex flex-col gap-2 rounded-md bg-white p-2 text-sm shadow-md'>
                  <li>
                    <button
                      onClick={handleDownloadPdf}
                      disabled={
                        downloadGstItemPdfLoading || downloadCashItemPdfLoading
                      }
                      className={`${!downloadGstItemPdfLoading && !downloadCashItemPdfLoading && 'hover:bg-wovBlue transition-colors duration-300 hover:text-white'} border-wovBlue text-wovBlue flex w-full items-center justify-between gap-2 rounded-md border px-3 py-1.5 whitespace-nowrap disabled:cursor-not-allowed`}>
                      Pdf File
                      {downloadGstItemPdfLoading ||
                      downloadCashItemPdfLoading ? (
                        <ClipLoader
                          size={15}
                          speedMultiplier={1}
                          color='#1e265a'
                        />
                      ) : (
                        <DocumentTextIcon className='size-5 shrink-0' />
                      )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleDownloadExcel}
                      disabled={
                        downloadGstItemExcelLoading ||
                        downloadCashItemExcelLoading
                      }
                      className={`${!downloadGstItemExcelLoading && !downloadCashItemExcelLoading && 'hover:bg-wovBlue transition-colors duration-300 hover:text-white'} border-wovBlue text-wovBlue flex w-full items-center justify-between gap-2 rounded-md border px-3 py-1.5 whitespace-nowrap disabled:cursor-not-allowed`}>
                      Excel File
                      {downloadGstItemExcelLoading ||
                      downloadCashItemExcelLoading ? (
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

            <PageSize
              pageSize={pageSize}
              setPageSize={setPageSize}
              setPageNumber={setPageNumber}
            />
          </div>
        </div>

        {/* Tab */}
        <div className='flex w-fit gap-2 rounded-md bg-slate-300 p-1'>
          <button
            onClick={() => setCurrentTab('Gst Items')}
            className={`${currentTab === 'Gst Items' ? 'bg-wovBlue text-white' : 'text-slate-600'} col-span-full flex h-fit items-center justify-center gap-2 self-end rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300`}>
            <SquaresPlusIcon className='size-4' />
            GST Items
          </button>

          <button
            onClick={() => setCurrentTab('Items')}
            className={`${currentTab === 'Items' ? 'bg-wovBlue text-white' : 'text-slate-600'} col-span-full flex h-fit items-center justify-center gap-2 self-end rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300`}>
            <BanknotesIcon className='size-4' />
            Items
          </button>
        </div>

        {currentTab === 'Gst Items' ? (
          <>
            {/* Gst Items */}
            <GstItems
              keyword={keyword}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              pageSize={pageSize}
              showGstItemForm={showGstItemForm}
              setShowGstItemForm={setShowGstItemForm}
            />
          </>
        ) : (
          <>
            {/* Items */}
            <CashItems
              keyword={keyword}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              pageSize={pageSize}
              showCashItemForm={showCashItemForm}
              setShowCashItemForm={setShowCashItemForm}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ItemsScreen;
