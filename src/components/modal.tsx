import React from 'react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      <div className='bg-white p-6 relative rounded-md shadow-lg w-[70vw] h-[70vh] max-w-xl'>
        <button onClick={onClose} className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'>
          X
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal