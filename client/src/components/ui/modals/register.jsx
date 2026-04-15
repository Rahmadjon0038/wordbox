'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useRegister } from '@/hooks/auth';
import { useMediaQuery } from 'react-responsive';

export default function Register({ children }) {
  const isMobile = useMediaQuery({ maxWidth: 600 });
   const style = isMobile
     ? {
         position: 'absolute',
         top: '50%',
         left: '50%',
         transform: 'translate(-50%, -50%)',
         width: '95vw',
         maxWidth: 400,
         bgcolor: 'background.paper',
         borderRadius: '12px',
         boxShadow: 24,
         p: 2,
       }
     : {
         position: 'absolute',
         top: '50%',
         left: '50%',
         transform: 'translate(-50%, -50%)',
         width: 400,
         bgcolor: 'background.paper',
         borderRadius: '12px',
         boxShadow: 24,
         p: 4,
       };
  const registerMutation = useRegister();  // api hoks
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setOpen(false);
  };

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      console.log("⚠️ Barcha maydonlarni to‘ldirish kerak!");
      return;
    }

    registerMutation.mutate({ name, email, password })



  };

  return (
    <div>
      <button onClick={handleOpen}>{children}</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
      >
        <Box sx={style}>
          <Typography id="register-modal-title" variant="h6" component="h2" gutterBottom>
            Ro‘yxatdan o‘tish
          </Typography>

          <TextField
            label="Ism"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Parol"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>
              Bekor qilish
            </Button>
            <Button variant="contained" onClick={handleRegister}>
              Ro‘yxatdan o‘tish
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
