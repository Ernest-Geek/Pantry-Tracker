'use client';
import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { collection, getDocs, doc, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/app/Firebase";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [Pantry1, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry1 = async () => {
    const snapshot = query(collection(db, 'Pantry1'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, count: doc.data().count });
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry1();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(db, 'Pantry1'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry1();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(db, 'Pantry1'), item.name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry1();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPantry = Pantry1.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={2}
        sx={{
          background: 'linear-gradient(to right, #a8c0ff, #3f2b96)', // Gradient background
          padding: 2
        }}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={handleOpen}>
          Add
        </Button>
        <TextField
          id="search"
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          sx={{
            width: '80%', // Adjust width to fit better
            maxWidth: 400,
            marginBottom: 2,
            borderRadius: 1,
            backgroundColor: '#ffffff', // Make background white for better visibility
            boxShadow: 1, // Optional: Add a subtle shadow
          }}
        />
        <Box border="1px solid #333" borderRadius={2} overflow="hidden">
          <Box
            borderBottom={'1px solid #333'}
            width="800px"
            minHeight="100px"
            bgcolor="#ADD8E6"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h2" color="#333" textAlign="center">
              Pantry Items
            </Typography>
          </Box>
          <Stack
            width="800px"
            maxHeight="300px"
            spacing={2}
            overflow="auto"
            padding={2}
          >
            {filteredPantry.map((item) => (
              <Box
                key={item.name}
                width="100%"
                minHeight="60px"
                display="flex"
                justifyContent={"space-between"}
                alignItems="center"
                bgcolor="#f0f0f0"
                paddingX={3}
                borderRadius={2}
                boxShadow={1}
              >
                <Typography variant="h4" color="#333" textAlign={"center"}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </Typography>

                <Typography variant="h5" color="#333" textAlign={"center"}>
                  Quantity: {item.count}
                </Typography>
                <Button variant="contained" color="secondary" onClick={() => removeItem(item)}>
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
