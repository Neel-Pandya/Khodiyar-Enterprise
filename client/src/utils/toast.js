import toast from 'react-hot-toast';

export const success = (msg) => toast.success(msg, { duration: 2000 });
export const error = (msg) => toast.error(msg, { duration: 2000 });