import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const Toaster = () => {
  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export const toastSuccess = (msg: string, close = true) => {
  toast.success(
    msg,
    !close
      ? {
          autoClose: false,
        }
      : {}
  );
};

export const toastError = (msg: string, close = true) => {
  toast.error(
    msg,
    !close
      ? {
          autoClose: false,
        }
      : {}
  );
};

export const toastWarning = (msg: string, close = true) => {
  toast.warning(
    msg,
    !close
      ? {
          autoClose: false,
        }
      : {}
  );
};
