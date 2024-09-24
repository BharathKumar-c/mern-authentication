import {Check, X} from 'lucide-react';

export const PasswordCriteria = ({password}) => {
  const criteria = [
    {label: 'At least 6 characters', met: password.length >= 6},
    {label: 'Contains uppercase letter', met: /[A-Z]/.test(password)},
    {label: 'Contains lowercase letter', met: /[a-z]/.test(password)},
    {label: 'Contains a number', met: /\d/.test(password)},
    {label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password)},
  ];

  return (
    <div className="mt-4 space-y-1">
      {criteria.map((item, index) => (
        <div key={index} className="flex items-center text-xs">
          {item.met ? (
            <Check className="mr-2 text-green-500 size-4" />
          ) : (
            <X className="mr-2 text-gray-500 size-4" />
          )}
          <span className={item.met ? 'text-green-500' : 'text-gray-400'}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({password}) => {
  const getStrength = (psw) => {
    let strength = 0;
    if (psw.length >= 6) strength++;
    if (psw.match(/[a-z]/) && psw.match(/[A-Z]/)) strength++;
    if (psw.match(/\d/)) strength++;
    if (psw.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };
  const strength = getStrength(password);

  const getColor = (strength) => {
    if (strength === 0) return 'bg-red-500';
    if (strength === 1) return 'bg-red-400';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return 'Very Weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">Password Strength</span>
        <span className="ml-2 text-xs text-gray-400">
          {getStrengthText(strength)}
        </span>
      </div>
      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`w-1/4 h-1 rounded-full transition-colors duration-300 ${
              index < strength ? getColor(strength) : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
