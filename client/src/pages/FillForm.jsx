import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  const { eventId } = useParams();
  const [formData, setFormData] = useState(null);
  const [formSchema, setFormSchema] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`/events/forms/${eventId}`);
        const fetchedForm = res.data.form;
        setFormData(fetchedForm);

        // building zod schema
        const schemaShape = {};
        fetchedForm.questions.forEach((q) => {
          schemaShape[q.label] = z
            .string()
            .min(1, "This question is required");
        });
        const schema = z.object(schemaShape);
        setFormSchema(schema);
      } catch (error) {
        console.log("error fetching form: " + error);
        toast.error("Error fetching form");
      }
    };
    fetchForm();
  }, [eventId]);

  if (!formSchema) return <div>Loading ...</div>;
  
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  return (
    <div>
      <div className="min-h-screen mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-wide text-white">
          Registration Form
        </h1>
        <h3 className="mt-2 text-2xl font-medium">for {formData.name}</h3>
      </div>
    </div>
  );
};

export default FillForm;
