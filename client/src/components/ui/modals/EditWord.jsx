'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import { useeditWord } from '@/hooks/words';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90vw', sm: 600 },
  maxWidth: '95vw',
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
};

export default function EditWord({ word, children }) {
  const [open, setOpen] = useState(false);
  const editWordMutation = useeditWord();

  const [newWord, setNewWord] = useState({
    english: '',
    uzbek: '',
    example: '',
    exampleUz: '',
    learned: 0,
  });

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setNewWord({ english: '', uzbek: '', example: '', exampleUz: '', learned: 0 });
    setOpen(false);
  };

  const editWord = (e) => {
    e.preventDefault();
    if (!newWord.english.trim() || !newWord.uzbek.trim()) {
      alert('English and Uzbek fields are required!');
      return;
    }
    editWordMutation.mutate({ id: word.id, newWord });
    handleClose();
  };

  useEffect(() => {
    if (open && word) {
      setNewWord({
        english: word.english || '',
        uzbek: word.uzbek || '',
        example: word.example || '',
        exampleUz: word.exampleUz || '',
        learned: word.learned || 0,
      });
    }
  }, [open, word]);

  return (
    <div>
      <button
        onClick={handleOpen}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all"
      >
        {children}
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-word-modal-title"
        className="flex items-center justify-center"
      >
        <Box sx={style}>
          <Typography
            id="add-word-modal-title"
            variant="h5"
            component="h2"
            gutterBottom
            className="text-gray-800 font-bold mb-6"
          >
            Edit Word
          </Typography>

          {/* Form */}
          <form
            onSubmit={editWord}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mt-4"
          >
            <div>
              <input
                type="text"
                placeholder="English word"
                value={newWord.english}
                onChange={(e) =>
                  setNewWord({ ...newWord, english: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Uzbek translation"
                value={newWord.uzbek}
                onChange={(e) =>
                  setNewWord({ ...newWord, uzbek: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Example sentence (EN)"
                value={newWord.example}
                onChange={(e) =>
                  setNewWord({ ...newWord, example: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Example translation (UZ)"
                value={newWord.exampleUz}
                onChange={(e) =>
                  setNewWord({ ...newWord, exampleUz: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex flex-col md:flex-row justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 w-full md:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 w-full md:w-auto"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}