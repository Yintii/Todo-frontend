import React, { useEffect, useState } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import JWT from 'jsonwebtoken'
import env from "react-dotenv";

export const Login = ({ setUserName, setUserID }) => {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let response = await fetch('http://localhost:5001/api/v1/todos/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })

            let data = await response.json()

            localStorage.setItem("user", data.user)
            navigate('/')

        } catch (error) {
            console.error(`Unable to login: `, error)
        }
    }



    return (
        <Container className='p-5'>
            <Row>
                <Col sm={12} className="text-center">
                    <h1>Todos App</h1>
                    <p>MERN with JWT authentication</p>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Form className="w-50 mx-auto my-5" onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" placeholder="Username" onChange={handleUsernameChange} required />
                            <Form.Label className='mt-4'>Password</Form.Label>
                            <Form.Control type="password" placeholder="GoodPassword1@4!" onChange={handlePasswordChange} required />
                        </Form.Group>
                        <Button variant='dark' type="submit" className="mt-5 w-100">
                            Log in
                        </Button>
                    </Form >
                </Col>
                <p className='text-white text-center'>Don't have an account yet? <Link className="text-white" to={'/register'}>Sign up here</Link> </p>
            </Row>
        </Container>
    )
}