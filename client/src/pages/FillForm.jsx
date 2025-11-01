import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const FillForm = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [formData, setFormData] = useState(null);
  const [formSchema, setFormSchema] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    defaultValues: {},
  });

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`/events/forms/${eventId}`);
        const fetchedData = res.data;
        setFormData(fetchedData);

        const schemaShape = {};
        const defaultValues = {};

        fetchedData.form.questions.forEach((q) => {
          // Use q.id instead of q.label for uniqueness
          const fieldName = String(q.id);

          if (q.type === "short_text") {
            schemaShape[fieldName] = z
              .string()
              .min(1, "This field is required");
          } else if (q.type === "radio") {
            schemaShape[fieldName] = z
              .string()
              .min(1, "Please select an option");
          }

          defaultValues[fieldName] = "";
        });

        const schema = z.object(schemaShape);
        setFormSchema(schema);
        form.reset(defaultValues);
      } catch (error) {
        console.error("Error fetching form:", error);
        toast.error("Error fetching form");
      }
    };

    fetchForm();
  }, [eventId]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Saving Registration...");

    try {
      const res = await axios.post(`/events/forms/${eventId}/submit`, {
        response: data,
      });
      toast.dismiss(loadingToast);
      toast.success("Form submitted successfully!", {
        duration: 4000,
      });
      form.reset();
      navigate("/myevents");
    } catch (error) {
      toast.dismiss(loadingToast);
      if (error.response) {
        toast.error(error.response.data.error || "Failed to save!", {
          duration: 4000,
        });
      } else if (error.request) {
        toast.error("Cannot connect to server. Make sure backend is running!", {
          duration: 5000,
        });
      } else {
        toast.error("An unexpected error occurred!");
      }
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formSchema || !formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl min-h-screen pt-4 mx-auto">
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-semibold text-center">
          Registration Form
        </h1>
        <p className="text-center tetext-center">for {formData.name}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {formData.form.questions.map((question, index) => {
            const fieldName = String(question.id); // unique field name

            return (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{question.label}</FormLabel>

                    <FormControl>
                      {question.type === "short_text" ? (
                        <Input
                          type="text"
                          placeholder={question.placeholder || ""}
                          {...field}
                        />
                      ) : question.type === "radio" ? (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2"
                        >
                          {question.options?.map((option, optIndex) => {
                            const optionId = `${fieldName}-opt-${optIndex}`;
                            return (
                              <div
                                key={optionId}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  id={optionId}
                                  name={fieldName} // ensures separation
                                  value={option}
                                />
                                <FormLabel
                                  htmlFor={optionId}
                                  className="font-normal cursor-pointer"
                                >
                                  {option}
                                </FormLabel>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      ) : null}
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-300"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FillForm;
