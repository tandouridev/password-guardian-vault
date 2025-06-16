
import React from 'react';
import { Card } from '@/components/ui/card';
import { usePasswordContext } from '@/context/PasswordContext';
import { calculatePasswordStrength, getPasswordStrengthFeedback } from '@/utils/password-generator';
import { decrypt } from '@/utils/encryption';
import { AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CheckupPage = () => {
  const { passwords } = usePasswordContext();
  const navigate = useNavigate();
  
  // Decrypt passwords for strength checking
  const decryptedPasswords = passwords.map(p => ({
    ...p,
    password: decrypt(p.password)
  }));
  
  // Find weak passwords (score < 40)
  const weakPasswords = decryptedPasswords
    .filter(p => calculatePasswordStrength(p.password) < 40)
    .sort((a, b) => calculatePasswordStrength(a.password) - calculatePasswordStrength(b.password));
  
  // Find duplicate passwords
  const passwordMap = new Map();
  const duplicatePasswords = decryptedPasswords.filter(p => {
    if (passwordMap.has(p.password)) {
      return true;
    }
    passwordMap.set(p.password, true);
    return false;
  });
  
  const isAllGood = weakPasswords.length === 0 && duplicatePasswords.length === 0;
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Password Checkup</h1>
      
      {isAllGood && (
        <Card className="p-6 mb-6 bg-green-50 border-green-200">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-2 rounded-full">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-green-800">All your passwords look good</h2>
              <p className="text-green-700 mt-1">
                Your passwords are strong and unique. Keep up the good work!
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {weakPasswords.length > 0 && (
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-4">Weak passwords detected</h2>
              <p className="text-muted-foreground mb-4">
                These passwords are vulnerable to being guessed or cracked. Consider updating them to stronger ones.
              </p>
              
              <div className="space-y-3">
                {weakPasswords.slice(0, 5).map(password => {
                  const strength = calculatePasswordStrength(password.password);
                  const feedback = getPasswordStrengthFeedback(strength);
                  
                  return (
                    <div 
                      key={password.id}
                      className="p-3 bg-slate-50 rounded-md border flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{password.site}</div>
                        <div className="text-sm text-muted-foreground">{feedback.label} password</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/password/${password.id}`)}
                      >
                        Review
                      </Button>
                    </div>
                  );
                })}
                
                {weakPasswords.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    +{weakPasswords.length - 5} more weak passwords
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {duplicatePasswords.length > 0 && (
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-4">Duplicate passwords detected</h2>
              <p className="text-muted-foreground mb-4">
                Using the same password for multiple sites is risky. If one site is compromised, all your accounts could be at risk.
              </p>
              
              <div className="space-y-3">
                {duplicatePasswords.slice(0, 5).map(password => (
                  <div 
                    key={password.id}
                    className="p-3 bg-slate-50 rounded-md border flex justify-between items-center"
                  >
                    <div className="font-medium">{password.site}</div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/password/${password.id}`)}
                    >
                      Review
                    </Button>
                  </div>
                ))}
                
                {duplicatePasswords.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    +{duplicatePasswords.length - 5} more duplicate passwords
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CheckupPage;
