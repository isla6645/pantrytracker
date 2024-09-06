"use client";
import { useState, useEffect } from "react";
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { firestore } from './firebase'; 

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#F5F5DC', // Light beige color like the image
  border: '2px solid #654321', // Brown border color
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [week, setWeek] = useState('');
  const [year, setYear] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
        inventoryList.push({
            name: doc.id,
            ...doc.data(),
        });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm)
    );
    setFilteredInventory(filtered);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box 
      width="100vw"
      height="100vh" 
      display="flex" 
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      bgcolor="#F0F2F5"
      p={3}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        mb={2}
      >
        <TextField 
          label="Date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          sx={{ width: '20%' }} 
        />
        <TextField 
          label="Month" 
          value={month} 
          onChange={(e) => setMonth(e.target.value)} 
          sx={{ width: '20%' }} 
        />
        <TextField 
          label="Week" 
          value={week} 
          onChange={(e) => setWeek(e.target.value)} 
          sx={{ width: '20%' }} 
        />
        <TextField 
          label="Year" 
          value={year} 
          onChange={(e) => setYear(e.target.value)} 
          sx={{ width: '20%' }} 
        />
      </Box>

      <Typography variant="h4" color="#000000" mb={2}>
        Pantry Inventory
      </Typography>

      <Box 
        border='1px solid #654321'
        width='100%'
        maxWidth='800px'
        borderRadius="8px"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
        bgcolor="#FFFFFF"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          padding="10px"
          bgcolor="#F5F5DC" // Light beige background
          borderBottom="1px solid #654321" // Brown border
        >
          <Typography variant="h6" width="20%" textAlign="center">
            Item
          </Typography>
          <Typography variant="h6" width="20%" textAlign="center">
            Quantity
          </Typography>
          <Typography variant="h6" width="20%" textAlign="center">
            Expiration Date
          </Typography>
          <Typography variant="h6" width="40%" textAlign="center">
            Actions
          </Typography>
        </Box>

        <Stack width="100%" spacing={1} p={2}>
          {filteredInventory.map(({name, quantity}) => (
            <Box
              key={name}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#FFFFFF"
              padding="10px"
              borderRadius="4px"
              borderBottom="1px solid #DDDDDD"
            >
              <Typography variant={'body1'} color={'#333333'} textAlign={'center'} width="20%">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography variant={'body1'} color={'#333333'} textAlign={'center'} width="20%">
                {quantity}
              </Typography>

              <Typography variant={'body1'} color={'#333333'} textAlign={'center'} width="20%">
                N/A
              </Typography>

              <Stack direction="row" spacing={2} width="40%" justifyContent="center">
                <Button 
                  variant="contained" 
                  onClick={() => addItem(name)} 
                  sx={{
                    backgroundColor: '#0066CC',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#005BB5',
                    },
                  }}
                >
                  Add
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => removeItem(name)} 
                  sx={{
                    backgroundColor: '#FF3333',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#CC0000'
                    },
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" color="#333333">Add Item</Typography>
          <TextField
            variant='outlined'
            label="Item Name"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '2px solid #654321', // Brown border color
            }}
          />
          <Button 
            variant="contained" 
            onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();   
            }}
            sx={{
              backgroundColor: '#654321', // Brown background color
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: '#FFFFFF',
                color: '#654321',
              },
            }}
          >
            Add
          </Button>    
        </Box>
      </Modal>

      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          marginTop: '20px',
          backgroundColor: '#654321', // Brown background color
          color: '#FFFFFF',
          borderRadius: '8px',
          padding: '10px 20px',
          '&:hover': {
            backgroundColor: '#FFFFFF',
            color: '#654321',
          },
        }}
      >
        Add New Item
      </Button>
    </Box>
  );
}
