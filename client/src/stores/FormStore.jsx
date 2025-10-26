import { create } from "zustand";

export const useFormStore = create((set) => ({
  questions: [],
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  updateQuestion: (id, updatedData) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, ...updatedData } : q
      ),
    })),
  deleteQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),
}));
