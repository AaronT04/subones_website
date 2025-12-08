'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import React, { ReactNode } from 'react';

export type ConfirmDialogStyle = {
  overlayStyle?: string;
  contentStyle?: string;
  titleStyle?: string;
  descriptionStyle?: string;
  cancelStyle?: string;
  actionStyle?: string;
};

const defaultConfirmDialogStyle: Required<ConfirmDialogStyle> = {
  overlayStyle: "fixed inset-0 bg-black/40 z-50",
  contentStyle:
    "fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 focus:outline-none",
  titleStyle: "text-base font-semibold text-gray-900 text-center",
  descriptionStyle: "mt-2 text-xl text-gray-800",
  cancelStyle:
    "px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300",
  actionStyle:
    "px-4 py-2 rounded-xl bg-maroon text-white hover:bg-maroon2",
};

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  styleOverride?: ConfirmDialogStyle;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description = 'Do you want to proceed?',
  confirmText = '',
  cancelText = 'Cancel',
  styleOverride = {},
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  
  // Merge style overrides with defaults
  const merged = { ...defaultConfirmDialogStyle, ...styleOverride };

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Portal>
        
        <AlertDialog.Overlay className={merged.overlayStyle} />

        <AlertDialog.Content className={merged.contentStyle}>
          
          <AlertDialog.Title className={merged.titleStyle}>
            {title}
          </AlertDialog.Title>

          <AlertDialog.Description className={merged.descriptionStyle}>
            {description}
          </AlertDialog.Description>

          <div className="mt-4 flex justify-end gap-4">

            <AlertDialog.Cancel asChild>
              <button onClick={onCancel} className={merged.cancelStyle}>
                {cancelText}
              </button>
            </AlertDialog.Cancel>

            {confirmText.trim() !== '' && (
              <AlertDialog.Action asChild>
                <button onClick={onConfirm} className={merged.actionStyle}>
                  {confirmText}
                </button>
              </AlertDialog.Action>
            )}

          </div>
        </AlertDialog.Content>

      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
