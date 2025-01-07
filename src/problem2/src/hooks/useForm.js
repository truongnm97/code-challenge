import { useState } from "react";

export const useForm = (initialValues, validate, onSubmit, options = {}) => {
  const { validateOnChange = false } = options;

  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (validateOnChange && validate) {
      const fieldErrors = validate({ ...values, [name]: value });
      setErrors(fieldErrors);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);

    if (Object.keys(validationErrors || {}).length === 0 && onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Submission error:", error);
      }
    }
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setValues(initialValues || {});
    setErrors({});
  };

  const setFieldValue = (field, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));

    if (validateOnChange && validate) {
      const fieldErrors = validate({ ...values, [field]: value });
      setErrors(fieldErrors);
    }
  };

  const updateValues = (newValues) => {
    setValues((prevValues) => ({
      ...prevValues,
      ...newValues,
    }));

    if (validateOnChange && validate) {
      const fieldErrors = validate({ ...values, ...newValues });
      setErrors(fieldErrors);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    updateValues,
    resetForm,
  };
};
