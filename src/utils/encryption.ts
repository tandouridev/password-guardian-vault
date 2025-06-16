
import CryptoJS from 'crypto-js';

// Encryption key derived from master password (in a real app, this would be handled more securely)
const DEFAULT_KEY = 'password-guardian-vault-default-key';
let encryptionKey = DEFAULT_KEY;

export const setEncryptionKey = (masterPassword: string) => {
  encryptionKey = masterPassword || DEFAULT_KEY;
};

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, encryptionKey).toString();
};

export const decrypt = (ciphertext: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Failed to decrypt:', error);
    return '';
  }
};
