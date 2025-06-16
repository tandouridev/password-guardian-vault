
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Clipboard, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePasswordContext } from '@/context/PasswordContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

const PasswordDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPassword, deletePassword } = usePasswordContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const passwordEntry = id ? getPassword(id) : undefined;
  
  if (!passwordEntry) {
    return (
      <div className="text-center py-8">
        <h1 className="text-xl font-bold mb-4">Password not found</h1>
        <Button onClick={() => navigate('/')}>Back to Passwords</Button>
      </div>
    );
  }

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDelete = () => {
    if (id) {
      deletePassword(id);
      setIsDeleteDialogOpen(false);
      navigate('/');
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {passwordEntry.site}
          </h1>
        </div>
        
        <Card className="p-6 space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
            <div className="flex justify-between items-center">
              <p className="text-lg">{passwordEntry.username}</p>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleCopyToClipboard(passwordEntry.username, "Username")}
                className="h-8 w-8"
              >
                <Clipboard size={16} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">Password</h3>
            <div className="flex justify-between items-center">
              <p className="text-lg font-mono">
                {showPassword ? passwordEntry.password : '•'.repeat(passwordEntry.password.length)}
              </p>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-8 w-8"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleCopyToClipboard(passwordEntry.password, "Password")}
                  className="h-8 w-8"
                >
                  <Clipboard size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          {passwordEntry.note && (
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium text-muted-foreground">Note</h3>
              <p className="text-base">{passwordEntry.note}</p>
            </div>
          )}
          
          <div className="pt-4 flex justify-between">
            <Button 
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
            <Button variant="default">Edit</Button>
          </div>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Password Entry</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the password for "{passwordEntry.site}"? 
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PasswordDetailPage;
