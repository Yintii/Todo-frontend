import React, { useState } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { passwordStrength } from 'check-password-strength'

import JWT from 'jsonwebtoken'
import env from "react-dotenv";

export const Register = () => {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [cPassword, setCPassword] = useState('')
    const [ourPasswordStrength, setOurPasswordStrength] = useState(0);
    const [passwordMatch, setPasswordMatch] = useState(false)
    const [progressColor, setProgressColor] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        setPasswordMatch(e.target.value === cPassword)
        let strength = passwordStrength(e.target.value);
        switch (strength.id) {
            case 0:
                setOurPasswordStrength(25)
                setProgressColor('danger')
                break;
            case 1:
                setOurPasswordStrength(50)
                setProgressColor('warning')
                break;
            case 2:
                setOurPasswordStrength(75)
                setProgressColor('warning')
                break;
            case 3:
                setOurPasswordStrength(100)
                setProgressColor('success')
                break;

        }

    }

    const handleCPasswordChange = (e) => {
        setCPassword(e.target.value)
        setPasswordMatch(e.target.value === password)

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let response = await fetch('http://localhost:5001/api/v1/todos/register', {
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
            navigate('/login')

        } catch (error) {
            console.error(`Unable to Register: `, error)
        }
    }

    const PasswordMatchIndicator = () => {
        if (password.length > 0 || cPassword.length > 0) {
            return (
                <div className='bg-light w-25 text-center my-1 rounded mx-auto'>
                    {!passwordMatch
                        ? <p className='text-danger'>Not matching...</p>
                        : <p className='text-success'>Passwords match!</p>
                    }
                </div>
            )
        }
    }


    return (
        <Container className='p-5'>
            <Row>
                <Col sm={12}>
                    <h1>Register</h1>
                    <p>MERN with JWT authentication</p>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Form className="w-75 mx-auto my-5" onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" placeholder="Username" onChange={handleUsernameChange} minLength="5" required />
                            <Form.Label className='mt-4'>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={handlePasswordChange} required />
                            <div className="text-white mt-3">Password Strength:</div>
                            <div className="progress">
                                <div id="password-strength" className={`progress-bar bg-${progressColor}`} role="progressbar" style={{ width: `${ourPasswordStrength}%` }} aria-valuenow={ourPasswordStrength} aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <Form.Label className='mt-4'>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" onChange={handleCPasswordChange} required />
                            <PasswordMatchIndicator />
                        </Form.Group>
                        <Button disabled={!passwordMatch} variant="success" type="submit" className="my-5 w-100">
                            Sign up
                        </Button>
                    </Form >
                </Col>
            </Row>
        </Container >
    )
}