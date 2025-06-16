
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePasswordContext } from '@/context/PasswordContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Download, Upload, Trash2 } from 'lucide-react';

const SettingsPage = () => {
  const { exportPasswords, importPasswords, clearAllPasswords } = usePasswordContext();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleExport = () => {
    try {
      const data = exportPasswords();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'passwords_export.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Passwords exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export passwords');
    }
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (Array.isArray(data)) {
          importPasswords(data);
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        console.error('Import failed:', error);
        toast.error('Failed to import passwords');
      }
    };
    reader.readAsText(file);
    
    // Clear the input to allow selecting the same file again
    event.target.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Import passwords</h2>
          <p className="text-muted-foreground mb-4">
            To import passwords to Password Manager select a JSON file.
          </p>
          <div>
            <Button asChild>
              <label>
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={handleImport}
                />
                <Upload className="mr-2 h-4 w-4" /> Select file
              </label>
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Export passwords</h2>
          <p className="text-muted-foreground mb-4">
            After you're done using the downloaded file, delete it so that others who use this device can't see your passwords.
          </p>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Download file
          </Button>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Delete all Password Manager data</h2>
          <p className="text-muted-foreground mb-4">
            Passwords, passkeys, and other data will be permanently deleted from Password Manager
          </p>
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete data
          </Button>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Password Data</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete all your saved passwords and data? 
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                clearAllPasswords();
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
