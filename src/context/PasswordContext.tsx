
import React, { createContext, useState, useContext, useEffect } from "react";
import { PasswordEntry, PasswordImportData } from "../types/password";
import { encrypt, decrypt } from "../utils/encryption";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface PasswordContextType {
  passwords: PasswordEntry[];
  addPassword: (password: Omit<PasswordEntry, "id" | "createdAt" | "updatedAt">) => string;
  updatePassword: (id: string, password: Partial<PasswordEntry>) => void;
  deletePassword: (id: string) => void;
  getPassword: (id: string) => PasswordEntry | undefined;
  searchPasswords: (query: string) => PasswordEntry[];
  importPasswords: (data: PasswordImportData[]) => void;
  exportPasswords: () => PasswordImportData[];
  clearAllPasswords: () => void;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

export const usePasswordContext = () => {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error("usePasswordContext must be used within a PasswordContextProvider");
  }
  return context;
};

const STORAGE_KEY = "password-guardian-vault";

const PasswordContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  
  // Load passwords from localStorage on initial load
  useEffect(() => {
    const storedPasswords = localStorage.getItem(STORAGE_KEY);
    if (storedPasswords) {
      try {
        setPasswords(JSON.parse(storedPasswords));
      } catch (error) {
        console.error("Failed to parse stored passwords", error);
      }
    }
  }, []);

  // Save passwords to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
  }, [passwords]);

  const addPassword = (passwordData: Omit<PasswordEntry, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    const id = uuidv4();
    
    // Encrypt the password before storing
    const encryptedPassword = encrypt(passwordData.password);
    
    const newPassword: PasswordEntry = {
      ...passwordData,
      id,
      password: encryptedPassword,
      createdAt: now,
      updatedAt: now,
    };
    
    setPasswords(prevPasswords => [...prevPasswords, newPassword]);
    toast.success("Password saved successfully");
    return id;
  };

  const updatePassword = (id: string, passwordData: Partial<PasswordEntry>) => {
    setPasswords(prevPasswords => 
      prevPasswords.map(password => 
        password.id === id
          ? {
              ...password,
              ...passwordData,
              // If the password field is being updated, encrypt it
              ...(passwordData.password ? { password: encrypt(passwordData.password) } : {}),
              updatedAt: Date.now(),
            }
          : password
      )
    );
    toast.success("Password updated successfully");
  };

  const deletePassword = (id: string) => {
    setPasswords(prevPasswords => prevPasswords.filter(password => password.id !== id));
    toast.success("Password deleted successfully");
  };

  const getPassword = (id: string) => {
    const password = passwords.find(p => p.id === id);
    if (!password) return undefined;
    
    // Decrypt the password before returning
    return {
      ...password,
      password: decrypt(password.password),
    };
  };

  const searchPasswords = (query: string) => {
    if (!query) return passwords;
    
    const lowerQuery = query.toLowerCase();
    return passwords.filter(
      p => 
        p.site.toLowerCase().includes(lowerQuery) ||
        p.username.toLowerCase().includes(lowerQuery) ||
        p.category?.toLowerCase().includes(lowerQuery) ||
        p.note?.toLowerCase().includes(lowerQuery) ||
        p.url?.toLowerCase().includes(lowerQuery)
    );
  };

  const importPasswords = (data: PasswordImportData[]) => {
    const now = Date.now();
    const newPasswords = data.map(item => ({
      id: uuidv4(),
      site: item.site,
      username: item.username,
      password: encrypt(item.password),
      category: item.category || "General",
      note: item.note,
      url: item.url,
      createdAt: now,
      updatedAt: now,
    }));
    
    setPasswords(prevPasswords => [...prevPasswords, ...newPasswords]);
    toast.success(`Imported ${data.length} passwords successfully`);
  };

  const exportPasswords = () => {
    return passwords.map(p => ({
      site: p.site,
      username: p.username,
      password: decrypt(p.password),
      category: p.category,
      note: p.note,
      url: p.url,
    }));
  };

  const clearAllPasswords = () => {
    setPasswords([]);
    toast.success("All passwords have been deleted");
  };

  return (
    <PasswordContext.Provider
      value={{
        passwords,
        addPassword,
        updatePassword,
        deletePassword,
        getPassword,
        searchPasswords,
        importPasswords,
        exportPasswords,
        clearAllPasswords,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
};

export default PasswordContextProvider;
