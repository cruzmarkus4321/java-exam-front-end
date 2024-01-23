// src/graphql.js
import { gql } from "@apollo/client";


export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        userType
      }
      status
      message
    }
  }
`;

export const GET_EMPLOYEES = gql`
query getEmployees($page: Int!, $size: Int!) {
  getEmployees(page: $page, size: $size) {
    employees {
          id
          firstName
          middleName
          lastName
          birthDate
          gender
          maritalStatus
          position
          dateHired
          contacts {
              id
              value
              isPrimary
          }
          addresses {
              id
              address1
              address2
              isPrimary
          }
          createdAt
          updatedAt
          deletedAt
          isDeleted
      }
      totalCount
      totalPages
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation addEmployee(
    $employee: EmployeeInput!
  ) {
    addEmployee(employee: $employee) {
      id
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation updateEmployee(
    $id: ID!
    $employee: EmployeeInput!
  ) {
    updateEmployee(id: $id, employee: $employee) {
      id
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;
