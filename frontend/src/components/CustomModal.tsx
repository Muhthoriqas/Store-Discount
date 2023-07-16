import React, { ReactNode } from 'react';
import Modal from 'react-modal';

type CustomModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  contentLabel: string;
  children: ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onRequestClose,
  contentLabel,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className="fixed inset-0 z-50 flex items-center justify-center shadow-lg"
      overlayClassName="fixed inset-0 bg-transparent opacity-100 flex items-center justify-center"
    >
      <div className="w-full max-w-md text-white rounded-lg shadow-lg p-9">
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;
