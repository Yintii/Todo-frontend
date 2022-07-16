import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Logout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        localStorage.removeItem("user")
        navigate("/login")
    }, [])
    return (<h1>Bye!</h1>)
}
