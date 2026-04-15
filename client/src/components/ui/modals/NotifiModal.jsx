'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useState } from 'react';
import { useDeleteLesson } from '@/hooks/lessons';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
  textAlign: "center"
};

export default function NotifiModal({ children, text = 'Matn berilmagan', lessonid }) {
  const deleteLessonMutation = useDeleteLesson(); // delete lessons
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = (id) => {
    deleteLessonMutation.mutate({ id })
    handleClose()
  };


  return (
    <div>
      <button onClick={handleOpen}>{children}</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="warning-modal">
        <Box sx={style}>
          <WarningAmberIcon sx={{ fontSize: 60, color: "orange", mb: 2 }} />

          <Typography id="warning-modal" variant="h6" gutterBottom>
            {text}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button onClick={handleClose} variant="outlined" color="inherit">
              Bekor qilish
            </Button>
            <Button onClick={() => handleDelete(lessonid)} variant="contained" color="error">
              Roziman
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
