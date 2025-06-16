
import React from 'react';
import { usePasswordContext } from '@/context/PasswordContext';
import { calculatePasswordStrength, getPasswordStrengthFeedback } from '@/utils/password-generator';
import { decrypt } from '@/utils/encryption';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const PasswordAnalysisPage = () => {
  const { passwords } = usePasswordContext();
  
  // Calculate overall stats
  const totalPasswords = passwords.length;
  const passwordStrengths = passwords.map(p => {
    try {
      const decryptedPassword = decrypt(p.password);
      return calculatePasswordStrength(decryptedPassword);
    } catch (error) {
      console.error('Failed to decrypt password for analysis', error);
      return 0;
    }
  });
  
  const averageStrength = passwordStrengths.length 
    ? passwordStrengths.reduce((sum, strength) => sum + strength, 0) / passwordStrengths.length 
    : 0;
  
  const weakPasswords = passwordStrengths.filter(s => s < 40).length;
  const strongPasswords = passwordStrengths.filter(s => s >= 80).length;
  const duplicatePasswords = 0; // This would require more complex analysis
  
  const { label: overallLabel, color: overallColor } = getPasswordStrengthFeedback(averageStrength);
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Password Health</h1>
      <p className="text-muted-foreground mb-6">
        Analyze the strength of your passwords and identify security risks.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center mb-2">
            <Shield className="mr-2 h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Overall Health</h3>
          </div>
          <div className="mt-2">
            <Progress value={averageStrength} className={overallColor} />
            <p className="mt-1 text-sm">{overallLabel} ({Math.round(averageStrength)}%)</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Issues Found</h3>
          </div>
          <p className="text-2xl font-bold">{weakPasswords}</p>
          <p className="text-sm text-muted-foreground">Weak passwords</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <h3 className="font-medium">Strong Security</h3>
          </div>
          <p className="text-2xl font-bold">{strongPasswords}</p>
          <p className="text-sm text-muted-foreground">Strong passwords</p>
        </Card>
      </div>
      
      <h2 className="text-xl font-medium mb-4">Password Strength Breakdown</h2>
      {passwords.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          No passwords to analyze. Add passwords to see their strength analysis.
        </p>
      ) : (
        <div className="space-y-3">
          {passwords.map(password => {
            const decryptedPassword = decrypt(password.password);
            const strength = calculatePasswordStrength(decryptedPassword);
            const { label, color } = getPasswordStrengthFeedback(strength);
            
            return (
              <Card key={password.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      {password.site.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium">{password.site}</h3>
                      <p className="text-sm text-muted-foreground">{password.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{label}</p>
                    <Progress value={strength} className={`w-24 ${color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PasswordAnalysisPage;
