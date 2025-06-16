
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePasswordContext } from '@/context/PasswordContext';
import PasswordsList from '@/components/PasswordsList';
import AddPasswordDialog from '@/components/AddPasswordDialog';
import { useLocation } from 'react-router-dom';

const PasswordsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { passwords, searchPasswords } = usePasswordContext();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';
  
  const filteredPasswords = searchQuery 
    ? searchPasswords(searchQuery)
    : passwords;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Passwords</h1>
          <p className="text-muted-foreground mt-1">
            Create, save, and manage your passwords so you can easily sign in to sites and apps.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Add
        </Button>
      </div>

      <PasswordsList 
        passwords={filteredPasswords} 
        emptyMessage={
          searchQuery 
            ? "No passwords match your search" 
            : "No passwords yet. Click 'Add' to create your first password entry."
        }
      />

      <AddPasswordDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default PasswordsPage;
