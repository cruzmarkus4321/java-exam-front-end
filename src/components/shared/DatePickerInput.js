import React from "react";
import { Form } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";

const TextInput = ({ controlId, label, name, value, maxDate, onChange, disabled, error }) => {
  return (
    <Form.Group controlId={controlId} className="mb-2">
      <Form.Label>{label}</Form.Label>
      <br/>
      <ReactDatePicker
        className={`form-control m-custom-datepicker ${error ? "is-invalid" : ""}`}
        name={name}
        selected={value}
        onChange={(date) => onChange(name, date)}
        maxDate={maxDate}
        disabled={disabled}
      />
      <br/>
      {error && <Form.Text className="text-danger">{error}</Form.Text>}
    </Form.Group>
  );
};

export default TextInput;