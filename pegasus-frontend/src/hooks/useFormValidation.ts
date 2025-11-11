import { type Ref } from "vue";

export interface DefaultField {
  value: string;
  isValid: boolean;
  errorMessage: string;
}

export default function useFormValidation() {
  const createDefaultField = (): DefaultField => ({
    value: "",
    isValid: true,
    errorMessage: "",
  });

  const validateField = (field: DefaultField, fieldName: string) => {
    field.isValid = !!field.value;
    field.errorMessage = field.isValid ? "" : `${fieldName} is required`;
  };

  const validateEmail = (email: DefaultField) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.value) {
      email.isValid = false;
      email.errorMessage = "Email is required";
    } else if (!regex.test(email.value)) {
      email.isValid = false;
      email.errorMessage = "Please enter a valid email address";
    } else {
      email.isValid = true;
      email.errorMessage = "";
    }
  };

  const validatePhoneNumber = (phoneNumber: DefaultField) => {
    const regex = /^[\d\s+()-]{10,}$/;

    if (!phoneNumber.value) {
      phoneNumber.isValid = false;
      phoneNumber.errorMessage = "Phone number is required";
    } else if (!regex.test(phoneNumber.value)) {
      phoneNumber.isValid = false;
      phoneNumber.errorMessage = "Please enter a valid phone number";
    } else {
      phoneNumber.isValid = true;
      phoneNumber.errorMessage = "";
    }
  };

  const validatePassword = (
    password: DefaultField,
    isRegistration: boolean
  ) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;

    if (!password.value) {
      password.isValid = false;
      password.errorMessage = "Password is required";
    } else if (isRegistration && !regex.test(password.value)) {
      password.isValid = false;
      password.errorMessage =
        "Password must be at least 6 characters and contain uppercase, lowercase, digit, and special character";
    } else {
      password.isValid = true;
      password.errorMessage = "";
    }
  };

  const validateConfirmedPassword = (
    confirmedPassword: DefaultField,
    password: DefaultField
  ) => {
    if (!confirmedPassword.value) {
      confirmedPassword.isValid = false;
      confirmedPassword.errorMessage = "Please confirm your password";
    } else if (confirmedPassword.value !== password.value) {
      confirmedPassword.isValid = false;
      confirmedPassword.errorMessage = "Passwords do not match";
    } else {
      confirmedPassword.isValid = true;
      confirmedPassword.errorMessage = "";
    }
  };

  const isValidForm = (fields: Ref<DefaultField>[]) => {
    return fields.every((field) => field.value.isValid);
  };

  return {
    createDefaultField,
    validateField,
    validateEmail,
    validatePhoneNumber,
    validatePassword,
    validateConfirmedPassword,
    isValidForm,
  };
}
