import { toast } from 'sonner';

export const toastSuccess = (message: string, description?: string) =>
  toast.success(message, { description });

export const toastError = (message: string, description?: string) =>
  toast.error(message, { description });

export const toastInfo = (message: string, description?: string) => toast(message, { description });
