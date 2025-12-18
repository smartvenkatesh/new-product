import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const location = useLocation()

    useEffect(() => {
        const token = localStorage.getItem("token:")
        if (token) {
            navigate("/home")
        }
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("http://localhost:5000/form/login", {
                email, password
            })
            console.log("login successful", res);
            localStorage.setItem("token:", res.data.token)
            console.log('location', location);
            toast.success("Login Successfully!");
            navigate("/home", { state: res.data })
        } catch (err) {
            console.log("Error:", err);
        }
    }

    return (
        <div className='login'>
            <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <button type="submit" className='btn btn-primary'>
                    Submit
                </button>
                <a href="/">create new account</a>
            </Form>
        </div>
    )
}

export default Login