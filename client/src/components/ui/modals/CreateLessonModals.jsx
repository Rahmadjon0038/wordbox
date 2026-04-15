'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useAddLesson } from '@/hooks/lessons';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

export default function CreateLessonModal({ children }) {
  const lessonMutation = useAddLesson()
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setTitle('');
    setOpen(false);
  };

  const addLesson = () => {
    if (!title.trim()) return;



    const lessondata = { title, words: 0, learned: 0 }
    lessonMutation.mutate({
      lessondata, onSuccess: (data) => {
        handleClose();
      }
    })
  };

  return (
    <div>
      <button onClick={handleOpen}>{children}</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-lesson-modal-title"
        aria-describedby="add-lesson-modal-description"
      >
        <Box sx={style}>
          <Typography id="add-lesson-modal-title" variant="h6" component="h2" gutterBottom>
            Yangi dars qo‘shish
          </Typography>

          <TextField
            label="Dars nomi"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>
              Bekor qilish
            </Button>
            <Button variant="contained" onClick={addLesson}>
              Qo‘shish
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
