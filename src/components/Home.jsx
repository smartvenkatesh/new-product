import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import axios from 'axios';


const Home = () => {

    const [count, setCount] = useState(0);
    const [productsList, setProductsList] = useState([])

    const [productName, setProductName] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [productPrice, setProductPrice] = useState("")

    const [toggle, setToggle] = useState("home")
    const [editProductId, setEditProductId] = useState(null)

    const handleToggleAddProduct = () => {
        setToggle("add")
    };


    const navigate = useNavigate()

    const location = useLocation()

    const click = () => {
        setCount(count + 1);       // 🔥 increment
        toast.success(count + 1);  // 🔥 show updated value
    }

    useEffect(() => {
        const token = localStorage.getItem("token:")
        if (!token) {
            navigate("/login")
        }
        getProducts()
    }, [])

    const handleEdit = (product) => {
        setEditProductId(product._id)
        setProductName(product.productName)
        setProductDescription(product.productDescription)
        setProductPrice(product.productPrice)

        setToggle("edit")
    }
    const getProducts = async () => {
        const res = await axios.get("http://localhost:5000/form/getProducts")
        setProductsList(res.data)
        console.log("getProducts", res.data);
    }

    const handleUpdateProduct = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/form/updateItem/${editProductId}`,
                { productName, productDescription, productPrice }
            )
            console.log("res", res.data);
            setToggle("home")
            if (res.status === 200) {
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
            getProducts()
        } catch (error) {
            toast.error("Update Failed")
        }
    }

    const handleAddProducts = async () => {
        const res = await axios.post("http://localhost:5000/form/createItems", {
            productName, productDescription, productPrice
        })
        setProductName("")
        setProductDescription("")
        setProductPrice("")
        setToggle("home")
        getProducts()
        if (res.status === 201) {
            toast.success(res.data.message)
        } else (
            toast.error(res.status.message)
        )
    }

    const handleCancel = () => {
        setProductName("")
        setProductDescription("")
        setProductPrice("")
        setToggle("home")
    }

    const handleDelete = async (id) => {
        const res = await axios.delete(`http://localhost:5000/form/deleteProduct/${id}`)
        toast.success(res.data.message)
        getProducts()
    }

    const handleLogout = () => {
        localStorage.removeItem("token:")
        navigate("/login")
    }
    return (
        <div>
            <div>
                <Navbar bg="dark" data-bs-theme="dark">
                    <Container>
                        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link onClick={handleToggleAddProduct}>Add Products</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </div>
            <h1>Home Page</h1>
            <button onClick={click} className='btn btn-danger'>click</button>
            <button onClick={handleLogout} className='btn btn-warning'>logout</button>

            {toggle === "add" && (<div className='add-product'>
                <h1>Add Products</h1>
                <div className='input'>
                    <input type="text" placeholder='Enter Product Name' value={productName}
                        onChange={(e) => setProductName(e.target.value)} /><br />
                    <input type="text" placeholder='Enter Product Description' value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)} /><br />
                    <input type="text" placeholder='Enter Product Price' value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)} /><br />

                    <button className='btn btn-primary' onClick={handleAddProducts}>Add</button>
                    <button className='btn btn-danger' onClick={handleCancel}>Cancel</button>
                </div>
            </div>)
            }

            {toggle === "edit" && (
                <div className='edit-product'>
                    <h1>Edit Product</h1>
                    <div className='input'>
                        <input type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        /><br />

                        <input type="text"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                        /><br />

                        <input type="text"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                        /><br />

                        <button className='btn btn-success' onClick={handleUpdateProduct}>
                            Update
                        </button>
                        <button className='btn btn-danger' onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}

            {toggle === "home" && (
                <div className='productList'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product Name</th>
                                <th>Product Description</th>
                                <th>Product Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsList.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.productDescription}</td>
                                    <td>{product.productPrice}</td>
                                    <td>
                                        <button className='btn btn-warning me-2'
                                            onClick={() => handleEdit(product)}>Edit</button>
                                        <button className='btn btn-danger'
                                            onClick={() => handleDelete(product._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>)}
        </div>
    )
}

export default Home;
