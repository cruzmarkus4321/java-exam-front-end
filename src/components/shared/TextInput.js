import React from "react";
import { Form } from "react-bootstrap";

const TextInput = ({ controlId, label, type, placeholder, name, value, onChange, disabled, error }) => {
  return (
    <Form.Group controlId={controlId} className="mb-2">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className={error ? "is-invalid" : ""}
        disabled={disabled}
      />
      {error && <Form.Text className="text-danger">{error}</Form.Text>}
    </Form.Group>
  );
};

export default TextInput;