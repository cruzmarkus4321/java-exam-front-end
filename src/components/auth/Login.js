import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from "../../graphql";
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import TextInput from '../shared/TextInput';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        navigate("/employees");
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: ({ login }) => {
            if (!!login.token && login.status === "success") {
                localStorage.setItem('token', login.token);
                localStorage.setItem('user', JSON.stringify(login.user));
                navigate('/employees');
                setLoginError("");
            } else {
                setLoginError("Invalid credentials. Please try again.");
            }
        },
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await login({ variables: { username, password } });
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: '35rem' }}>
                <Card.Header>Login</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleLogin}>
                        <TextInput
                            controlId="formUsername"
                            label="Username"
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            //error={validationError && validationError.firstName}
                        />
                        <TextInput
                            controlId="formPassword"
                            label="Password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            //error={validationError && validationError.firstName}
                        />
                        {!!loginError && (
                            <Form.Text className="text-danger mt-2">Invalid credentials. Please try again.</Form.Text>
                        )}
                        <div className="d-flex justify-content-center mt-4">
                            <Button variant="primary" type="submit" disabled={loading}>
                                LOGIN
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
