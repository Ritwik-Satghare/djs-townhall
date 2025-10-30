import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useFormStore } from "@/stores/FormStore";
import { Trash2, Plus, Save } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const FormCreator = () => {
  const location = useLocation();
  const questions = useFormStore((state) => state.questions);
  const addQuestion = useFormStore((state) => state.addQuestion);
  const updateQuestion = useFormStore((state) => state.updateQuestion);
  const deleteQuestion = useFormStore((state) => state.deleteQuestion);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { eventData } = location.state || {};

  const handleAddQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      label: "Untitled question",
      options: type === "radio" ? ["Option 1", "Option 2"] : [],
    };
    addQuestion(newQuestion);
    setEditingId(newQuestion.id);
  };

  const handleUpdateLabel = (id, label) => {
    updateQuestion(id, { label });
  };

  const handleAddOption = (id) => {
    const question = questions.find((q) => q.id === id);
    const newOptions = [
      ...question.options,
      `Option ${question.options.length + 1}`,
    ];
    updateQuestion(id, { options: newOptions });
  };

  const handleUpdateOption = (id, index, value) => {
    const question = questions.find((q) => q.id === id);
    const newOptions = [...question.options];
    newOptions[index] = value;
    updateQuestion(id, { options: newOptions });
  };

  const handleDeleteOption = (id, index) => {
    const question = questions.find((q) => q.id === id);
    const newOptions = question.options.filter((_, i) => i !== index);
    updateQuestion(id, { options: newOptions });
  };

  const handleDeleteQuestion = (id) => {
    deleteQuestion(id);
  };

  const handleSaveForm = async () => {
    // Validation
    if (!eventData) {
      toast.error("No event data found!");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question!");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Saving event and form...");

    try {
      const formData = new FormData();
      formData.append("image", eventData.picture);
      formData.append("eventData", JSON.stringify(eventData));
      formData.append("questions", JSON.stringify(questions));
      const response = await axios.post("/events/save", formData);

      toast.dismiss(loadingToast);
      toast.success("Event and Form saved successfully!", {
        duration: 4000,
      });
      console.log("event :", eventData);
      console.log("questions:", questions);
      console.log("Saved Event:", response.data.event);
      console.log("Saved Form:", response.data.form);
    } catch (error) {
      toast.dismiss(loadingToast);

      if (error.response) {
        toast.error(error.response.data.error || "Failed to save!", {
          duration: 4000,
        });
        console.error("Error details:", error.response.data);
      } else if (error.request) {
        toast.error("Cannot connect to server. Make sure backend is running!", {
          duration: 5000,
        });
        console.error("Network error:", error.request);
      } else {
        toast.error("An unexpected error occurred!");
        console.error("Error:", error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="p-8"
      >
        <h1 className="mb-4 text-2xl font-bold">Form Creator</h1>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-1/4 p-4 border-r">
            <h2 className="mb-4 font-bold">Question Types</h2>
            <div className="space-y-2">
              <Button
                onClick={() => handleAddQuestion("short_text")}
                className="w-full text-white bg-blue-500 hover:bg-blue-600"
              >
                Short Text
              </Button>
              <Button
                onClick={() => handleAddQuestion("radio")}
                className="w-full text-white bg-blue-500 hover:bg-blue-600"
              >
                Multiple Choice
              </Button>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="flex-1 p-6">
            <div className="flex justify-between mb-6">
              <div>
                {eventData && (
                  <p className="mt-2 text-sm text-gray-600">
                    Event: <strong>{eventData.name}</strong>
                  </p>
                )}
              </div>
              <Button
                onClick={handleSaveForm}
                disabled={isSaving || questions.length === 0}
                className="text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Form"}
              </Button>
            </div>

            {/* Empty State */}
            {questions.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed rounded-lg">
                <p className="text-gray-500">
                  No questions yet. Add questions from the sidebar.
                </p>
              </div>
            )}

            {/* Questions */}
            <div className="space-y-4">
              {questions.map((q) => (
                <Card key={q.id}>
                  <CardHeader className="flex flex-row justify-between">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={q.label}
                        onChange={(e) =>
                          handleUpdateLabel(q.id, e.target.value)
                        }
                        className="w-full p-2 text-lg font-semibold border rounded"
                        placeholder="Question title"
                      />
                      <p className="mt-1 text-sm text-gray-600">
                        {q.type === "short_text"
                          ? "SHORT TEXT"
                          : "MULTIPLE CHOICE"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>

                  <CardContent>
                    {/* Short Text */}
                    {q.type === "short_text" && (
                      <input
                        type="text"
                        placeholder="Short answer text"
                        disabled
                        className="w-full p-2 border rounded bg-gray-50"
                      />
                    )}

                    {/* Radio */}
                    {q.type === "radio" && (
                      <div className="space-y-2">
                        {q.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input type="radio" name={`q-${q.id}`} disabled />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) =>
                                handleUpdateOption(q.id, i, e.target.value)
                              }
                              className="flex-1 p-1 border rounded"
                              placeholder={`Option ${i + 1}`}
                            />
                            {q.options.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteOption(q.id, i)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddOption(q.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add option
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FormCreator;
