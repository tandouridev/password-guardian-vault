
// Generate secure passwords with various options
export const generatePassword = ({
  length = 16,
  includeUppercase = true,
  includeLowercase = true,
  includeNumbers = true,
  includeSymbols = true,
}: {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
}): string => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = '';
  if (includeLowercase) chars += lowercaseChars;
  if (includeUppercase) chars += uppercaseChars;
  if (includeNumbers) chars += numberChars;
  if (includeSymbols) chars += symbolChars;

  // Default to lowercase + numbers if nothing selected
  if (chars === '') chars = lowercaseChars + numberChars;

  let password = '';
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }

  return password;
};

// Calculate password strength
export const calculatePasswordStrength = (password: string): number => {
  // Return a score from 0 (weak) to 100 (strong)
  if (!password) return 0;
  
  let score = 0;
  
  // Length check (max 40 points)
  score += Math.min(password.length * 4, 40);
  
  // Character variety checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  
  // Add points for character variety (15 points each)
  if (hasUppercase) score += 15;
  if (hasLowercase) score += 15;
  if (hasNumbers) score += 15;
  if (hasSymbols) score += 15;
  
  return Math.min(score, 100);
};

// Get feedback based on password strength score
export const getPasswordStrengthFeedback = (score: number): {
  label: string;
  color: string;
} => {
  if (score >= 80) {
    return { label: 'Strong', color: 'bg-green-500' };
  } else if (score >= 60) {
    return { label: 'Good', color: 'bg-blue-500' };
  } else if (score >= 40) {
    return { label: 'Fair', color: 'bg-yellow-500' };
  } else if (score >= 20) {
    return { label: 'Weak', color: 'bg-orange-500' };
  } else {
    return { label: 'Very Weak', color: 'bg-red-500' };
  }
};
