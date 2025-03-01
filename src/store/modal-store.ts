import { create } from "zustand";
import { ReactNode } from "react";

type ModalData = Record<string, unknown>;

interface ModalStore {
  isOpen: boolean;
  type: string | null;
  data: ModalData;
  component: ReactNode | null;

  onOpen: (type: string, component: ReactNode, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  type: null,
  data: {},
  component: null,

  onOpen: (type, component, data = {}) =>
    set({
      isOpen: true,
      type,
      component,
      data,
    }),

  onClose: () =>
    set({
      isOpen: false,
      type: null,
      component: null,
      data: {},
    }),
}));
