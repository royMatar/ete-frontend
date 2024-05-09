import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Routes, Route, Link } from "react-router-dom";

const MotionBox = motion(Box);

function HomePage() {
  return (
    // Set the Box to be a full-screen container with display flex
    <>
    <MotionBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
      initial={{ opacity: 0, y: 30 }} // Start with the box being transparent and slightly down
      animate={{ opacity: 1, y: 0 }} // Animate to fully opaque and move to original position
      transition={{ duration: 0.8 }} // Duration of the animation
    >
      <Text fontSize="50px">Welcome to ETE Product Management System!</Text>
      <Box>
      {/* <Button as={Link} to="/" colorScheme="teal">
    Home
  </Button> */}
  <Button as={Link} to="/products" colorScheme="teal" ml={2}>
    Products
  </Button>
      </Box>
      
    </MotionBox>
    
  </>
  );
}

export default HomePage;
