import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_EMPLOYEE, UPDATE_EMPLOYEE, GET_EMPLOYEES } from "../../graphql";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import TextInput from "../shared/TextInput";
import DatePickerInput from "../shared/DatePickerInput";
import { Trash, Plus } from 'react-bootstrap-icons';
import moment from "moment";
import Swal from 'sweetalert2';
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  birthDate: Yup.string().required("Birth Date is required"),
  gender: Yup.string().required("Gender is required"),
  maritalStatus: Yup.string().required("Marital Status is required"),
  position: Yup.string().required("Position is required"),
  dateHired: Yup.string().required("Date Hired is required"),
  contacts: Yup.array().of(
    Yup.object().shape({
      value: Yup.string().required("Contact Value is required"),
      isPrimary: Yup.boolean(),
    })
  ).test('at-least-one-contact', 'At least one contact is required', function (
    value
  ) {
    return value && value.length > 0;
  }),
  addresses: Yup.array().of(
    Yup.object().shape({
      address1: Yup.string().required("Address 1 is required"),
      address2: Yup.string().required("Address 2 is required"),
      isPrimary: Yup.boolean(),
    })
  ).test('at-least-one-address', 'At least one address is required', function (
    value
  ) {
    return value && value.length > 0;
  }),
});

const EmployeeForm = ({ showModal = false, employee, onUpdate, onClose, viewOnly = false }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!!employee) {
      setFormData({
        firstName: employee ? employee.firstName : "",
        lastName: employee ? employee.lastName : "",
        middleName: employee ? employee.middleName : "",
        birthDate: employee ? moment(employee.birthDate, "YYYY-MM-DD").toDate() : new Date(),
        gender: employee ? employee.gender : "",
        maritalStatus: employee ? employee.maritalStatus : "",
        position: employee ? employee.position : "",
        dateHired: employee ? moment(employee.dateHired, "YYYY-MM-DD").toDate() : new Date(),
        contacts: employee ? employee.contacts : [],
        addresses: employee ? employee.addresses : [],
      });
    } else {
      setFormData({});
    }
  }, [employee]);

  const [validationError, setValidationError] = useState({});

  const [addEmployee] = useMutation(ADD_EMPLOYEE);

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);

  const onHide = () => {
    setValidationError({});
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddContact = () => {
    let newContacts = [];
    if (!!formData.contacts && formData.contacts.length > 0) {
      newContacts = [
        ...formData.contacts,
        { value: "", isPrimary: false },
      ];
    } else {
      newContacts = [
        { value: "", isPrimary: false },
      ];
    }

    setFormData((prevData) => ({
      ...prevData,
      contacts: newContacts,
    }));
  };

  const handleContactChange = (index) => (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      contacts: prevData.contacts.map((contact, i) => {
        if (i === index) {
          return {
            ...contact,
            [name]: value,
          };
        }
        return contact;
      }),
    }));
  };

  const handleRemoveContact = (index) => () => {
    setFormData((prevData) => ({
      ...prevData,
      contacts: prevData.contacts.filter((contact, i) => i !== index),
    }));
  };


  const handleAddAddress = () => {
    let newAddresses = [];
    if (!!formData.addresses && formData.addresses.length > 0) {
      newAddresses = [
        ...formData.addresses,
        { address1: "", address2: "", isPrimary: false },
      ];
    } else {
      newAddresses = [
        { address1: "", address2: "", isPrimary: false },
      ];
    }

    setFormData((prevData) => ({
      ...prevData,
      addresses: newAddresses,
    }));
  };

  const handleAddressChange = (index) => (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      addresses: prevData.addresses.map((address, i) => {
        if (i === index) {
          return {
            ...address,
            [name]: value,
          };
        }
        return address;
      }),
    }));
  };

  const handleRemoveAddress = (index) => () => {
    setFormData((prevData) => ({
      ...prevData,
      addresses: prevData.addresses.filter((addresses, i) => i !== index),
    }));
  };

  const handlePrimaryToggle = (index, type) => {
    if (type === "contact") {
      setFormData((prevData) => {
        const updatedContacts = prevData.contacts.map((contact, i) => {
          if (i === index) {
            return {
              ...contact,
              isPrimary: true,
            };
          } else {
            return {
              ...contact,
              isPrimary: false,
            };
          }
        });
        return {
          ...prevData,
          contacts: updatedContacts,
        };
      });
    } else {
      setFormData((prevData) => {
        const updatedAddresses = prevData.addresses.map((contact, i) => {
          if (i === index) {
            return {
              ...contact,
              isPrimary: true,
            };
          } else {
            return {
              ...contact,
              isPrimary: false,
            };
          }
        });
        return {
          ...prevData,
          addresses: updatedAddresses,
        };
      });
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setValidationError({});

      const {
        firstName,
        lastName,
        middleName,
        birthDate,
        gender,
        maritalStatus,
        position,
        dateHired,
        contacts,
        addresses
      } = formData;

      Swal.fire({
        title: `${!!employee ? "Update" : "Add"} Employee`,
        text: `Are you sure you want to ${!!employee ? "update" : "add"} this employee?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (!result.isConfirmed) return;

        if (employee) {
          updateEmployee({
            variables: {
              id: employee.id,
              employee: {
                firstName,
                lastName,
                middleName,
                birthDate: moment(birthDate).format("YYYY-MM-DD").toString(),
                gender,
                maritalStatus,
                position,
                dateHired: moment(dateHired).format("YYYY-MM-DD").toString(),
                contacts,
                addresses
              }
            },
          }).then(() => {
            Swal.fire("Employee has been successfully updated!");

            onUpdate();
            onHide();
          });
        } else {
          addEmployee({
            variables: {
              employee: {
                firstName,
                lastName,
                middleName,
                birthDate: moment(birthDate).format("YYYY-MM-DD").toString(),
                gender,
                maritalStatus,
                position,
                dateHired: moment(dateHired).format("YYYY-MM-DD").toString(),
                contacts,
                addresses
              }
            },
          }).then(() => {
            Swal.fire("Employee has been successfully added!");

            onUpdate();
            onHide();
          });
        }
      });
    } catch (error) {
      const errors = {};

      error.inner.forEach((e) => {
        errors[e.path] = e.message;
      });

      setValidationError(errors);
    }
  };

  return (
    <Modal show={showModal} onClose={onHide} size={"xl"}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header>
          <Modal.Title>{employee ? "Edit Employee" : "Add Employee"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="m-2">
          <Row>
            <Col>
              <TextInput
                controlId="formFirstName"
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={validationError && validationError.firstName}
                disabled={viewOnly}
              />
              <TextInput
                controlId="formLastName"
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={validationError && validationError.lastName}
                disabled={viewOnly}
              />
              <TextInput
                controlId="formMiddleName"
                label="Middle Name"
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                error={validationError && validationError.middleName}
                disabled={viewOnly}
              />
              <DatePickerInput
                controlId="formBirthDate"
                label="Birth Date"
                name="birthDate"
                value={formData.birthDate}
                maxDate={new Date()}
                onChange={handleDateChange}
                error={validationError && validationError.birthDate}
                disabled={viewOnly}
              />
              <TextInput
                controlId="formGender"
                label="Gender"
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={validationError && validationError.gender}
                disabled={viewOnly}
              />
              <TextInput
                controlId="formMaritalStatus"
                label="Marital Status"
                type="text"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                error={validationError && validationError.maritalStatus}
                disabled={viewOnly}
              />
              <TextInput
                controlId="formPosition"
                label="Position"
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                error={validationError && validationError.position}
                disabled={viewOnly}
              />
              <DatePickerInput
                controlId="formDateHired"
                label="Date Hired"
                name="dateHired"
                value={formData.dateHired}
                maxDate={new Date()}
                onChange={handleDateChange}
                error={validationError && validationError.dateHired}
                disabled={viewOnly}
              />
            </Col>
            <Col>
              <div className="d-flex justify-content-between mb-2">
                <h5>
                  Contacts
                </h5>
                <Button
                  variant="success"
                  onClick={handleAddContact}
                  disabled={viewOnly}
                >
                  <Plus />
                </Button>
              </div>
              {formData.contacts &&
                formData.contacts.length > 0 &&
                formData.contacts.map((contact, index) => (
                  <div key={index} className="mb-3">
                    <Row>
                      <Col>
                        <TextInput
                          controlId={`value_${index}`}
                          label="Contact Value"
                          type="text"
                          placeholder="Enter contact value"
                          name="value"
                          value={contact.value}
                          onChange={handleContactChange(index)}
                          error={validationError && validationError[`contacts[${index}].value`]}
                          disabled={viewOnly}
                        />
                      </Col>
                      <Col>
                        <div className="d-flex justify-content-between mt-2 mb-2">
                          <Form.Check
                            type="checkbox"
                            id={`primaryContact_${index}`}
                            label="Primary"
                            name={"isPrimary"}
                            checked={contact.isPrimary}
                            onChange={() => handlePrimaryToggle(index, "contact")}
                            disabled={viewOnly}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="ml-2"
                            onClick={handleRemoveContact(index)}
                            disabled={viewOnly}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              {validationError.contacts && (
                <Form.Text className="text-danger">{validationError.contacts}</Form.Text>
              )}
              <div className="d-flex justify-content-between mt-5 mb-2">
                <h5>
                  Addresses
                </h5>
                <Button
                  variant="success"
                  onClick={handleAddAddress}
                  disabled={viewOnly}
                >
                  <Plus />
                </Button>
              </div>
              {formData.addresses &&
                formData.addresses.length > 0 &&
                formData.addresses.map((address, index) => (
                  <div key={index} className="mb-3">
                    <Row>
                      <Col>
                        <TextInput
                          controlId={`address1_${index}`}
                          label="Address 1"
                          type="text"
                          name="address1"
                          value={address.address1}
                          onChange={handleAddressChange(index)}
                          error={validationError && validationError[`addresses[${index}].address1`]}
                          disabled={viewOnly}
                        />
                      </Col>
                      <Col>
                        <TextInput
                          controlId={`address2_${index}`}
                          label="Address 2"
                          type="text"
                          name="address2"
                          value={address.address2}
                          onChange={handleAddressChange(index)}
                          error={validationError && validationError[`addresses[${index}].address2`]}
                          disabled={viewOnly}
                        />
                      </Col>
                      <Col>
                        <div className="d-flex justify-content-between mt-2 mb-2">
                          <Form.Check
                            type="checkbox"
                            id={`primaryContact_${index}`}
                            label="Primary"
                            name={"isPrimary"}
                            checked={address.isPrimary}
                            onChange={() => handlePrimaryToggle(index, "address")}
                            disabled={viewOnly}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="ml-2"
                            onClick={handleRemoveAddress(index)}
                            disabled={viewOnly}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              {validationError.addresses && (
                <Form.Text className="text-danger">{validationError.addresses}</Form.Text>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {!viewOnly && <Button variant="primary" type="submit">
            {!!employee ? "Update" : "Add"}
          </Button>}
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;