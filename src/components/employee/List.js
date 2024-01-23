import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { DELETE_EMPLOYEE, GET_EMPLOYEES } from "../../graphql";
import { Table, Button } from "react-bootstrap";
import EmployeeForm from "./Form";
import Swal from 'sweetalert2';
import PaginationComponent from "../shared/PaginationComp";
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const user = JSON.parse(localStorage.getItem("user"));
    let username = "";
    let userType = "1";

    if (!!user) {
        username = user.username || "";
        userType = user.userType || "1";
    } else {
        logout();
    }

    const [currentPage, setCurrentPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
        variables: { page: currentPage, size },
    });
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);

    useEffect(() => {
        refetch();
    }, [currentPage]);

    useEffect(() => {
        if (data) {
            setEmployees(data.getEmployees.employees);
            setTotalCount(data.getEmployees.totalCount || 0);
            setTotalPages(data.getEmployees.totalPages || 0);
        }
    }, [data]);

    const getPrimaryAddress = (addresses) => {
        if (addresses && addresses.length > 0) {
            const primaryAddress = addresses.find((address) => address.isPrimary);
            return primaryAddress ? primaryAddress.address1 + ", " + primaryAddress.address2 : 'No primary address';
        } else {
            return 'No primary address';
        }
    };

    const getPrimaryContact = (contacts) => {
        if (contacts && contacts.length > 0) {
            const primaryContact = contacts.find((contact) => contact.isPrimary);
            return primaryContact ? primaryContact.value : 'No primary contact';
        } else {
            return 'No primary contact';
        }
    };

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();

        if (today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            return age - 1;
        }

        return age;
    };

    const calculateYearsInCompany = (dateHired) => {
        const today = new Date();
        const hiredDate = new Date(dateHired);

        let yearsDiff = today.getFullYear() - hiredDate.getFullYear();
        const monthsDiff = today.getMonth() - hiredDate.getMonth();

        let formattedResult = '';

        if (today.getMonth() < hiredDate.getMonth() || (today.getMonth() === hiredDate.getMonth() && today.getDate() < hiredDate.getDate())) {
            yearsDiff--;
        }

        if (yearsDiff > 0) {
            formattedResult += `${yearsDiff}y `;
        }

        if (monthsDiff >= 0) {
            formattedResult += `${monthsDiff}m`;
        } else {
            formattedResult += `${monthsDiff + 12}m`;
        }

        return formattedResult.trim() || 'N/A';
    };

    const handleClose = () => {
        setSelectedEmployee(null);
    };

    const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

    const removeEmployee = (id) => {
        Swal.fire({
            title: "Delete Employee",
            text: `Are you sure you want to delete this employee?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (!result.isConfirmed) return;

            deleteEmployee({
                variables: {
                    id
                },
            }).then(() => {
                Swal.fire("Employee has been successfully deleted!");

                refetch();
            });
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-row">
                    <Button
                        variant="danger"
                        className="mb-4"
                        onClick={() => logout()}>
                        LOG-OUT
                    </Button>
                    <h5 className="mt-1 ms-4">Hello, {username}!</h5>
                </div>

                <Button
                    variant="success"
                    className="mb-4"
                    onClick={() => {
                        setShowEmployeeModal(true);
                    }}
                    hidden={userType === "2"}
                >

                    Add
                </Button>
            </div>
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Primary Address</th>
                            <th>Primary Contact Info</th>
                            <th>Age</th>
                            <th># of Years in the Company</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length > 0 && employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.firstName + " " + employee.lastName}</td>
                                <td>{getPrimaryAddress(employee.addresses)}</td>
                                <td>{getPrimaryContact(employee.contacts)}</td>
                                <td>{calculateAge(employee.birthDate)}</td>
                                <td>{calculateYearsInCompany(employee.dateHired)}</td>
                                <td>
                                    {userType === "1" ?
                                        (
                                            <>
                                                <Button variant="primary" className="me-1" onClick={() => {
                                                    setShowEmployeeModal(true);
                                                    setSelectedEmployee(employee);
                                                }}>
                                                    Edit
                                                </Button>
                                                <Button variant="danger" onClick={() => {
                                                    removeEmployee(employee.id);
                                                }}>
                                                    Delete
                                                </Button>
                                            </>
                                        ) :
                                        (
                                            <Button variant="primary" className="me-1" onClick={() => {
                                                setShowEmployeeModal(true);
                                                setSelectedEmployee(employee);
                                            }}>
                                                View
                                            </Button>
                                        )
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <PaginationComponent
                    currentPage={currentPage + 1}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        if (page !== 0) {
                            setCurrentPage(page - 1)
                        }
                    }}
                />
            </div>
            <EmployeeForm
                showModal={showEmployeeModal}
                viewOnly={userType === "2"}
                employee={selectedEmployee}
                onUpdate={() => {
                    refetch();
                }}
                onClose={() => {
                    setShowEmployeeModal(false);
                    setSelectedEmployee(null)
                }}
            />
        </>
    );
};

export default EmployeeList;
