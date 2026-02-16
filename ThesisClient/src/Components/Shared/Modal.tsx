import { forwardRef, useRef, useImperativeHandle } from "react";
import Button from "./Button";

export type ModalHandle = {
  open: () => void;
};

const Modal = forwardRef<
  ModalHandle,
  {
    title: string;
    buttonText: string;
    buttonColor: "red" | "yellow";
    handleSubmit: () => void;
    children?: React.ReactNode;
  }
>(({ title, buttonText, buttonColor, handleSubmit, children }, ref) => {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current?.showModal();
      },
    };
  });

  return (
    <dialog
      ref={dialog}
      className="backdrop:bg-black/50 rounded-lg shadow-xl p-0 m-auto"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        {children}
        <form method="dialog" className="flex gap-3 justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <Button
            color={buttonColor}
            handleClick={handleSubmit}
            label={buttonText}
          />
        </form>
      </div>
    </dialog>
  );
});

export default Modal;
