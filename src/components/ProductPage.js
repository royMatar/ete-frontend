import React, { useState, useEffect } from "react";
import {
    Box, Button, useDisclosure, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Table,
    Thead, Tbody, Tr, Th, Td, IconButton, Input, Select, FormControl, FormLabel, Flex,
    useToast
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function ProductPage() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [productDetails, setProductDetails] = useState({
        id: null, name: '', email: '', store: '', picture: null
    });
    const toast = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get("http://localhost:5000/product/list");
        setProducts(response.data);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/product/delete`, { data: { id } });
        fetchProducts();
        toast({
            title: "Product deleted.",
            description: "The product has been successfully deleted.",
            status: "info",
            duration: 5000,
            isClosable: true,
            position: "bottom-left"
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setProductDetails(prev => ({
            ...prev,
            picture: e.target.files[0]
        }));
    };

    const handleSave = async () => {
        const { id, name, email, store, picture } = productDetails;
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('store', store);
        formData.append('picture', picture);

        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/product/update`, { id, name, email, store, picture });
                toast({
                    title: "Product updated.",
                    description: "The product details have been successfully updated.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left"
                });
            } else {
                await axios.post(`http://localhost:5000/product/create`, { name, email, store, picture });
                toast({
                    title: "Product added.",
                    description: "A new product has been successfully added.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "There was an issue saving the product.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }

        fetchProducts();
        onClose();
        setIsEditing(false);
        setProductDetails({ id: null, name: '', email: '', store: '', picture: null });
    };

    const openEditModal = (product) => {
        setProductDetails(product);
        setIsEditing(true);
        onOpen();
    };
    return (
        <MotionBox
      initial={{ opacity: 0, x: 30 }} // Start with the box being transparent and slightly down
      animate={{ opacity: 1, x: 0 }} // Animate to fully opaque and move to original position
      transition={{ duration: 0.8 }} // Duration of the animation
    >
            <Flex justifyContent="space-between" alignItems="center" p={4}>
                <Button as={Link} to="/" colorScheme="teal">
                    Back
                </Button>
                <Button onClick={() => { setIsEditing(false); setProductDetails({ id: null, name: '', email: '', store: '', picture: null }); onOpen(); }} colorScheme="blue">
                    Add Product
                </Button>
            </Flex>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Full Name</Th>
                        <Th>Merchant Email</Th>
                        <Th>Store</Th>
                        <Th>Product Picture</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {products.map((product) => (
                        <Tr key={product.id}>
                            <Td>{product.name}</Td>
                            <Td>{product.email}</Td>
                            <Td>{product.store}</Td>
                            <Td><img src={product.picture} alt="Product" style={{ width: "50px" }} /></Td>
                            <Td>
                                <IconButton aria-label="Edit product" icon={<EditIcon />} onClick={() => openEditModal(product)} style={{ marginRight: "10px" }}/>
                                <IconButton aria-label="Delete product" icon={<DeleteIcon />} onClick={() => handleDelete(product.id)} colorScheme="red" />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {/* Modal for Adding/Editing Products */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isEditing ? 'Edit Product' : 'Add Product'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Full Name</FormLabel>
                            <Input name="name" value={productDetails.name} onChange={handleInputChange} placeholder="Enter product name" />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" name="email" value={productDetails.email} onChange={handleInputChange} placeholder="Enter merchant email" />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Store</FormLabel>
                            <Select name="store" value={productDetails.store} onChange={handleInputChange} placeholder="Select store">
                                <option value="Beirut">Beirut</option>
                                <option value="Batroun">Batroun</option>
                                <option value="Jbeil">Jbeil</option>
                            </Select>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Product Image</FormLabel>
                            <Input type="file" onChange={handleImageChange} accept="image/*" />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </MotionBox>
    );
}

export default ProductPage;
