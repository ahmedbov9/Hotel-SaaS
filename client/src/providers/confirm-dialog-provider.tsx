"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
};

type ConfirmDialogContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

export const ConfirmDialogContext =
  createContext<ConfirmDialogContextValue | null>(null);

type ConfirmDialogProviderProps = {
  children: React.ReactNode;
};

export function ConfirmDialogProvider({
  children,
}: ConfirmDialogProviderProps) {
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const [dialog, setDialog] = useState<ConfirmOptions & { isOpen: boolean }>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default",
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeDialog = useCallback((result: boolean) => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
    resolverRef.current?.(result);
    resolverRef.current = null;
    setIsLoading(false);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setDialog({
      isOpen: true,
      title: options.title,
      description: options.description,
      confirmText: options.confirmText ?? "Confirm",
      cancelText: options.cancelText ?? "Cancel",
      variant: options.variant ?? "default",
    });

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const value = useMemo(
    () => ({
      confirm,
    }),
    [confirm],
  );

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}

      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        description={dialog.description}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        variant={dialog.variant}
        isLoading={isLoading}
        onCancel={() => closeDialog(false)}
        onConfirm={() => {
          setIsLoading(true);
          closeDialog(true);
        }}
      />
    </ConfirmDialogContext.Provider>
  );
}