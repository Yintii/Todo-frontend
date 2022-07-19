import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import JWT from 'jsonwebtoken'
import env from 'react-dotenv'

export const Home = () => {

    const [todo, setTodo] = useState('')
    const [todos, setTodoList] = useState([])

    const jsonWebToken = localStorage.getItem("user");
    const user = JWT.verify(jsonWebToken, env.SECRET);

    const navigate = useNavigate()


    const markComplete = async (id) => {
        try {
            await fetch('http://localhost:5001/api/v1/todos/complete', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id
                })
            })
            await getTodos()
        } catch (error) {
            console.log("Error with update post request", error.message)
        }
    }

    const deleteTodo = async (id) => {
        try {
            await fetch('http://localhost:5001/api/v1/todos/delete', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id
                })
            })
            await getTodos()
        } catch (error) {
            console.log("Error with delete post request", error.message)
        }
    }

    const getTodos = async () => {
        let data = await fetch(`http://localhost:5001/api/v1/todos/?user_id=${user.user_id}`)
            .then(response => response.json())
            .then(data => data.todosList);

        let sortedData = data.sort((a, b) => (a.complete > b.complete) ? 1 : -1);
        console.log(sortedData)
        setTodoList(data)
    }



    const handleChange = (e) => {
        setTodo(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:5001/api/v1/todos/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task: todo,
                    complete: false,
                    user_id: user.user_id
                })
            })
            setTodo('');
            await getTodos()
        } catch (error) {
            console.log("There was an error adding the todo to the database: ", error.message)
        }

    }

    const handleLogout = () => {
        let answer = window.confirm("Ready to log out?");
        if (answer) {
            setTodoList([])
            navigate("/logout")
        }
        return
    }



    useEffect(() => {
        getTodos()
    }, [])


    return (
        <Container>
            <Row id="input-area">
                <Col sm={12}>
                    <div className='d-flex justify-content-between align-items-center p-5'>
                        <h1>{user.username}'s Todo List</h1>
                        <Button id="logout" variant='danger' onClick={() => handleLogout()}>Logout</Button>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='mb-5'>
                            <Form.Label>
                                Todo
                            </Form.Label>
                            <div className='d-flex align-items-center'>
                                <Form.Control value={todo} name="todo" onChange={handleChange} required />
                                <Button type='submit' className='btn btn-success w-25 mx-2'>Log Todo</Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row id="todos-area">
                <Col sm={12} className="text-black">
                    {todos.map(todo => {
                        if (todo.complete) {
                            return (
                                <div
                                    key={todo._id}
                                    id={todo._id}
                                    className='todo-complete d-flex justify-content-between m-3 p-3 rounded align-items-center'
                                >
                                    <div className='todo-body'>{todo.task}</div>
                                    <Button
                                        variant="danger"
                                        onClick={() => deleteTodo(todo._id)}>
                                        Delete
                                    </Button>
                                </div>
                            )
                        }

                        if (!todo.complete) {
                            return (
                                <div
                                    key={todo._id}
                                    id={todo._id}
                                    className='todo d-flex justify-content-between m-3 p-3 rounded align-items-center'
                                >
                                    <div className='todo-body'>{todo.task}</div>
                                    <div>
                                        <Button
                                            onClick={() => markComplete(todo._id)}
                                            className="mx-2"
                                            variant="success">
                                            Complete
                                        </Button>
                                        <Button
                                            onClick={() => deleteTodo(todo._id)}
                                            variant='danger'>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </Col>
            </Row>
        </Container>
    )
}
