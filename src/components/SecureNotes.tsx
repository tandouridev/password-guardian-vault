
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { encrypt, decrypt } from '@/utils/encryption';
import { SecureNote } from '@/types/password';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Edit, Trash2 } from 'lucide-react';

// This would be part of a context in a real implementation
const STORAGE_KEY = "secure-notes-vault";

const SecureNotes = () => {
  const [notes, setNotes] = useState<SecureNote[]>(() => {
    const storedNotes = localStorage.getItem(STORAGE_KEY);
    return storedNotes ? JSON.parse(storedNotes) : [];
  });
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<SecureNote | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Personal');
  
  // Save notes to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);
  
  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast.error('Please provide both a title and content for your note');
      return;
    }
    
    const newNote: SecureNote = {
      id: uuidv4(),
      title: noteTitle,
      content: encrypt(noteContent), // Encrypt the content
      category: noteCategory,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setNotes(prevNotes => [...prevNotes, newNote]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Secure note created successfully');
  };
  
  const handleEditNote = () => {
    if (!currentNote || !noteTitle.trim() || !noteContent.trim()) {
      toast.error('Please provide both a title and content for your note');
      return;
    }
    
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === currentNote.id 
        ? {
            ...note,
            title: noteTitle,
            content: encrypt(noteContent),
            category: noteCategory,
            updatedAt: Date.now()
          }
        : note
    ));
    
    setIsEditDialogOpen(false);
    resetForm();
    toast.success('Secure note updated successfully');
  };
  
  const handleDeleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    toast.success('Secure note deleted successfully');
  };
  
  const openEditDialog = (note: SecureNote) => {
    setCurrentNote(note);
    setNoteTitle(note.title);
    setNoteContent(decrypt(note.content));
    setNoteCategory(note.category);
    setIsEditDialogOpen(true);
  };
  
  const resetForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('Personal');
    setCurrentNote(null);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Secure Notes</h2>
          <p className="text-muted-foreground mt-1">
            Store sensitive information securely with end-to-end encryption.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>
      
      {notes.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          No secure notes yet. Click 'Add Note' to create your first note.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map(note => (
            <Card key={note.id} className="p-4">
              <h3 className="font-medium">{note.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">
                {note.category} · Last updated {new Date(note.updatedAt).toLocaleDateString()}
              </p>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(note)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteNote(note.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Note Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Secure Note 1</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
              <Input 
                id="title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
              <Input 
                id="category"
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                placeholder="Category"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
              <Textarea 
                id="content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Secure note content"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Note Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Secure Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium mb-1">Title</label>
              <Input 
                id="edit-title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title"
              />
            </div>
            <div>
              <label htmlFor="edit-category" className="block text-sm font-medium mb-1">Category</label>
              <Input 
                id="edit-category"
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                placeholder="Category"
              />
            </div>
            <div>
              <label htmlFor="edit-content" className="block text-sm font-medium mb-1">Content</label>
              <Textarea 
                id="edit-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Secure note content"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditNote}>
              Update Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecureNotes;
