
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PasswordEntry } from '@/types/password';
import { Card } from './ui/card';

interface PasswordsListProps {
  passwords: PasswordEntry[];
  emptyMessage?: string;
}

const PasswordsList = ({ passwords, emptyMessage = "No passwords found" }: PasswordsListProps) => {
  const navigate = useNavigate();

  if (passwords.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const getIconForSite = (site: string) => {
    // This would ideally fetch favicons, but for now we'll use a simple approach
    return (
      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
        {site.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {passwords.map((password) => (
        <Card 
          key={password.id}
          onClick={() => navigate(`/password/${password.id}`)}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {getIconForSite(password.site)}
            <span>{password.site}</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Card>
      ))}
    </div>
  );
};

export default PasswordsList;
