///useProductStore.js
import { create } from "zustand";

const useProductStore = create((set) => ({
  data: [],
  editMode: false,
  editItemId: null,
  apiError: null,

  setData: (data) => set(() => ({ data })),
  setEditMode: (editMode) => set(() => ({ editMode })),
  setEditItemId: (editItemId) => set(() => ({ editItemId })),
  setApiError: (apiError) => set(() => ({ apiError })),
}));

export default useProductStore;
