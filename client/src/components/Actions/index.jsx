import PropTypes from 'prop-types';
import {
  ArrowDownTrayIcon,
  EnvelopeIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import { logout } from '@slices/authSlice';
import { useDispatch } from 'react-redux';
import checkSessionExpired from '@utils/checkSession';

const Preview = ({ queryfunc, id }) => {
  const dispatch = useDispatch();
  const [preview, { isFetching: previewLoading }] = queryfunc();

  const handlePreview = async (id) => {
    try {
      const url = await preview({ id }).unwrap();
      window.open(url, '_blank');
    } catch (error) {
      if (!checkSessionExpired(error, dispatch)) {
        console.error(error);
        return toast.error('Error While Previewing');
      }
    }
  };
  return (
    <button
      onClick={() => handlePreview(id)}
      disabled={previewLoading}
      className='flex items-center gap-1 rounded-sm bg-green-50 px-2 py-1 text-sm font-semibold text-green-700 shadow-xs ring-1 ring-green-700 ring-inset hover:bg-white'>
      {previewLoading ? (
        <ClipLoader size={10} color='#15803d' />
      ) : (
        <EyeIcon className='h-3 w-3' />
      )}
      Preview
    </button>
  );
};

const SendMail = ({ queryfunc, id }) => {
  const dispatch = useDispatch();
  const [sendMail, { isFetching: sendMailLoading }] = queryfunc();

  const handleSendMail = async (id) => {
    try {
      await sendMail({ id }).unwrap();
      toast.success('Mail Send SuccessFully');
    } catch (error) {
      if (!checkSessionExpired(error, dispatch)) {
        console.error(error);
        return toast.error('Error While Sending Mail');
      }
    }
  };
  return (
    <button
      onClick={() => handleSendMail(id)}
      disabled={sendMailLoading}
      className='flex items-center gap-1 rounded-sm bg-purple-50 px-2 py-1 text-sm font-semibold text-purple-700 shadow-xs ring-1 ring-purple-700 ring-inset hover:bg-white'>
      {sendMailLoading ? (
        <ClipLoader size={10} color='#7e22ce' />
      ) : (
        <EnvelopeIcon className='h-3 w-3' />
      )}
      Send Mail
    </button>
  );
};

const Download = ({ queryfunc, id, fileName }) => {
  const dispatch = useDispatch();
  const [download, { isFetching: downloadLoading }] = queryfunc();

  const handleDownload = async (id) => {
    try {
      const url = await download({ id }).unwrap();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.pdf`;
      link.click();
      link.remove();
      toast.success('Invoice Downloaded Sucessfully');
    } catch (error) {
      if (!checkSessionExpired(error, dispatch)) {
        console.error(error);
        return toast.error('Error While Downloading Invoice');
      }
    }
  };
  return (
    <button
      onClick={() => handleDownload(id)}
      disabled={downloadLoading}
      className='flex items-center gap-1 rounded-sm bg-orange-50 px-2 py-1 text-sm font-semibold text-orange-700 shadow-xs ring-1 ring-orange-700 ring-inset hover:bg-white'>
      {downloadLoading ? (
        <ClipLoader size={10} color='#c2410c' />
      ) : (
        <ArrowDownTrayIcon className='h-3 w-3' />
      )}
      Download
    </button>
  );
};

const Delete = ({ queryfunc, id, message }) => {
  const dispatch = useDispatch();
  const [deleteData, { isFetching: deleteLoading }] = queryfunc();
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = async (id) => {
    try {
      await deleteData({ id }).unwrap();
      toast.success(message);
    } catch (error) {
      if (!checkSessionExpired(error, dispatch)) {
        console.error(error);
        return toast.error(error?.data?.message || error?.message);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        disabled={deleteLoading}
        className='flex items-center gap-1 rounded-sm bg-red-50 px-2 py-1 text-sm font-semibold text-red-600 shadow-xs ring-1 ring-red-600 ring-inset hover:bg-white disabled:cursor-not-allowed'>
        {deleteLoading ? (
          <ClipLoader size={10} color='#dc2626' />
        ) : (
          <TrashIcon className='h-3 w-3' />
        )}
        Delete
      </button>

      {showDialog && (
        <div className='fixed top-0 left-0 z-50 flex min-h-screen min-w-full items-center justify-center px-10 backdrop-blur-xs'>
          <div className='bg-wovBlue z-99 max-w-[520px] rounded-md p-6 text-white shadow-2xl'>
            <p className='text-left text-lg font-semibold'>
              Are you absolutely sure?
            </p>
            <p className='mt-2 text-left text-xs whitespace-normal text-slate-400'>
              This action cannot be undone. This will permanently delete remove
              your data from our servers.
            </p>
            <div className='mt-4 flex items-center justify-end gap-4'>
              <button
                onClick={() => setShowDialog(false)}
                className='border-salte-400 rounded-md border px-4 py-2'>
                Cancel
              </button>
              <button
                onClick={() => handleDelete(id)}
                className='text-wovBlue rounded-md bg-white px-4 py-2'>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Preview.propTypes = {
  queryfunc: PropTypes.func,
  id: PropTypes.number,
};

SendMail.propTypes = {
  queryfunc: PropTypes.func,
  id: PropTypes.number,
};

Download.propTypes = {
  queryfunc: PropTypes.func,
  id: PropTypes.number,
  fileName: PropTypes.string,
};

Delete.propTypes = {
  queryfunc: PropTypes.func,
  id: PropTypes.number,
  message: PropTypes.string,
};

export { Preview, SendMail, Download, Delete };
