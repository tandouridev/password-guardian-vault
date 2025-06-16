
export interface PasswordEntry {
  id: string;
  site: string;
  username: string;
  password: string; // This will be stored encrypted
  category: string;
  note?: string;
  createdAt: number;
  updatedAt: number;
  url?: string;
  favicon?: string;
  expiresAt?: number; // For password expiration
  history?: PasswordHistoryEntry[]; // For password history
  shared?: SharedWith[]; // For password sharing
  breachDetected?: boolean; // For breach detection
  lastBreachCheck?: number; // Timestamp of last breach check
}

export interface PasswordHistoryEntry {
  password: string; // Encrypted previous password
  changedAt: number; // Timestamp when password was changed
}

export interface SharedWith {
  email: string;
  accessLevel: 'view' | 'edit'; // view-only or edit permissions
  sharedAt: number;
}

export interface PasswordImportData {
  site: string;
  username: string;
  password: string;
  category?: string;
  note?: string;
  url?: string;
}

export type PasswordCategory = {
  id: string;
  name: string;
  color?: string;
  icon?: string;
};

export interface SecureNote {
  id: string;
  title: string;
  content: string; // This will be stored encrypted
  category: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}
