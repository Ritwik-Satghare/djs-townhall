import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useFormStore } from "@/stores/FormStore";
import { Trash2, Plus, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const FormCreator = () => {
  const location = useLocation();
  const questions = useFormStore((state) => state.questions);
  const addQuestion = useFormStore((state) => state.addQuestion);
  const updateQuestion = useFormStore((state) => state.updateQuestion);
  const deleteQuestion = useFormStore((state) => state.deleteQuestion);
  const [editingId, setEditingId] = useState(null);
  
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
    const question = questions.find(q => q.id === id);
    const newOptions = [...question.options, `Option ${question.options.length + 1}`];
    updateQuestion(id, { options: newOptions });
  };

   const handleUpdateOption = (id, index, value) => {
    const question = questions.find(q => q.id === id);
    const newOptions = [...question.options];
    newOptions[index] = value;
    updateQuestion(id, { options: newOptions });
  };

  const handleDeleteOption = (id, index) => {
    const question = questions.find(q => q.id === id);
    const newOptions = question.options.filter((_, i) => i !== index);
    updateQuestion(id, { options: newOptions });
  };


  const handleSaveForm = () => {
    console.log("Saving form:", questions);
    alert("Form saved");
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
          <Button onClick={() => handleAddQuestion("short_text")} className="w-full text-white bg-blue-500 hover:bg-blue-600">
            Short Text
          </Button>
          <Button onClick={() => handleAddQuestion("radio")} className="w-full text-white bg-blue-500 hover:bg-blue-600">
            Multiple Choice
          </Button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 p-6">
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Form Builder</h1>
            <p>Create your custom form</p>
          </div>
          <Button onClick={handleSaveForm} className="text-white bg-green-500 hover:bg-green-600">
            <Save className="w-4 h-4 mr-2" />
            Save Form
          </Button>
        </div>

        {/* Empty State */}
        {questions.length === 0 && (
          <div className="p-8 text-center border-2 border-dashed">
            <p>No questions yet. Add questions from the sidebar.</p>
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
                    onChange={(e) => handleUpdateLabel(q.id, e.target.value)}
                    className="w-full p-2 text-lg font-semibold border"
                    placeholder="Question title"
                  />
                  <p className="mt-1 text-sm">
                    {q.type === "short_text" ? "SHORT TEXT" : "MULTIPLE CHOICE"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteQuestion(q.id)}
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
                    className="w-full p-2 border"
                  />
                )}

                {/* Radio */}
                {q.type === "radio" && (
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="radio" name={`q-${q.id}`} disabled />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(q.id, i, e.target.value)}
                          className="flex-1 p-1 border"
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
        {/* <pre>{JSON.stringify(eventData, null, 2)}</pre> */}
      </motion.div>
      </div>
  );
};

export default FormCreator;