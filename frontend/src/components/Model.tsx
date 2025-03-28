// frontend/src/components/Modal.tsx
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        {/* Overlay with blur effect */}
        <div className="min-h-screen px-4 text-center bg-gray-500/30 backdrop-blur-sm">
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            {/* Modal content with glass effect */}
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/80 backdrop-blur-md shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                {title}
              </Dialog.Title>
              <div className="mt-4">
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;