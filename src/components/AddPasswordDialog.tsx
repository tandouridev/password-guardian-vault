
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { usePasswordContext } from '@/context/PasswordContext';
import { generatePassword, calculatePasswordStrength, getPasswordStrengthFeedback } from '@/utils/password-generator';

interface AddPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPasswordDialog = ({ open, onOpenChange }: AddPasswordDialogProps) => {
  const { addPassword } = usePasswordContext();
  const [formData, setFormData] = useState({
    site: '',
    url: '',
    username: '',
    password: '',
    category: 'General',
    note: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const passwordStrength = calculatePasswordStrength(formData.password);
  const strengthFeedback = getPasswordStrengthFeedback(passwordStrength);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.site && formData.password) {
      addPassword(formData);
      onOpenChange(false);
      resetForm();
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword({});
    setFormData((prev) => ({ ...prev, password: newPassword }));
  };

  const resetForm = () => {
    setFormData({
      site: '',
      url: '',
      username: '',
      password: '',
      category: 'General',
      note: '',
    });
    setShowPassword(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new password</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Input 
              id="site" 
              name="site"
              placeholder="example.com" 
              value={formData.site}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              name="username"
              placeholder="your.email@example.com" 
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="pr-16"
                required
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={handleGeneratePassword}
                >
                  <RefreshCw size={16} />
                </Button>
              </div>
            </div>
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strengthFeedback.color} transition-all`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Password strength: {strengthFeedback.label}
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea 
              id="note" 
              name="note"
              placeholder="Add any additional notes" 
              value={formData.note}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <DialogFooter className="sm:justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPasswordDialog;
