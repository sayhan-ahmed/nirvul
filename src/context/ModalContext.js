"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmationModal from '@/components/ConfirmationModal';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const showConfirm = useCallback((title, message, onConfirm) => {
    setModal({
      show: true,
      title,
      message,
      onConfirm
    });
  }, []);

  const hideModal = useCallback(() => {
    setModal(prev => ({ ...prev, show: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (modal.onConfirm) modal.onConfirm();
    hideModal();
  }, [modal, hideModal]);

  return (
    <ModalContext.Provider value={{ showConfirm, hideModal }}>
      {children}
      {modal.show && (
        <ConfirmationModal
          title={modal.title}
          message={modal.message}
          onConfirm={handleConfirm}
          onClose={hideModal}
        />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
