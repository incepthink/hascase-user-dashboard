import { toast, Flip, ToastOptions } from "react-toastify";
import { ToastContainerProps } from "react-toastify";

const notify = (message: string, type?: string) => {
  toast(message, {
    position: "bottom-right",
    type: (type as ToastOptions["type"]) || "default",
  });
};

export const notifyPromise = (message: string, type?: string) => {
  const id = toast.loading(message, {
    position: "bottom-right",
    type: (type as ToastOptions["type"]) || "default",
  });
  return id;
};

export const notifyResolve = (
  id: string | number,
  message: string,
  type: string
) => {
  toast.update(id, {
    render: message,
    type: type as ToastOptions["type"],
    position: "bottom-right",
    isLoading: false,
    autoClose: 2000,
    closeButton: true,
    theme: "light",
    transition: Flip,
  });
};

export default notify;
