import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, TextField } from '@mui/material';
import { collection, getDocs, doc, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const PantryList = () => {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPantry = async () => {
    const snapshot = query(collection(db, 'Pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = docs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPantry(pantryList);
  };

  useEffect(() => {
    fetchPantry();
  }, []);

  const addItem = async () => {
    const docRef = doc(collection(db, 'Pantry'), itemName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    fetchPantry();
    setItemName('');
  };

  const removeItem = async (id) => {
    const docRef = doc(collection(db, 'Pantry'), id);
    await deleteDoc(docRef);
    fetchPantry();
  };

  const filteredPantry = pantry.filter(item =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="New Item"
        variant="outlined"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" onClick={addItem}>Add Item</Button>
      <Box sx={{ marginTop: 2 }}>
        <Stack spacing={2}>
          {filteredPantry.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                border: '1px solid #ddd',
                borderRadius: 1,
                backgroundColor: '#f9f9f9'
              }}
            >
              <Typography variant="body1">{item.id}</Typography>
              <Typography variant="body1">Quantity: {item.count}</Typography>
              <Button variant="outlined" color="error" onClick={() => removeItem(item.id)}>Remove</Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default PantryList;
