import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './Button';

interface EmailVerificationFormProps {
  onSubmit: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
  isResending?: boolean;
  serverError?: string | null;
  email?: string;
}

export const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  onSubmit,
  onResend,
  isLoading = false,
  isResending = false,
  serverError,
  email = 'seu@email.com',
}) => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer para reenviar código
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleCodeChange = (index: number, value: string) => {
    // Apenas números
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus próximo campo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace no campo vazio volta para o anterior
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setCode(newCode as any);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');

    if (fullCode.length !== 6) {
      return;
    }

    try {
      await onSubmit(fullCode);
    } catch {
      // Error handled by parent
    }
  };

  const handleResend = async () => {
    try {
      await onResend();
      setResendCountdown(60);
      setCode(['', '', '', '', '', '']);
    } catch {
      // Error handled by parent
    }
  };

  const fullCode = code.join('');

  return (
    <form onSubmit={handleVerify} className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Confirme seu email
        </h1>
        <p className="text-gray-500">
          Enviamos um código para{' '}
          <span className="font-medium text-gray-700">{email}</span>
        </p>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 animate-slideDown">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-medium text-red-900">{serverError}</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
        {/* Code Inputs */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-4">
            Digite o código de 6 dígitos
          </label>
          <div className="grid grid-cols-6 gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                className="w-full aspect-square text-center text-2xl font-bold bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="0"
                inputMode="numeric"
                style={{
                  color: '#1A1A1A',
                }}
              />
            ))}
          </div>
        </div>

        {/* Verify Button */}
        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading || fullCode.length !== 6}
          className="w-full"
        >
          {isLoading ? 'Verificando...' : 'Verificar código'}
        </Button>

        {/* Resend Code */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            Não recebeu o código?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || resendCountdown > 0}
            className="text-sm font-medium text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            style={{
              color: resendCountdown > 0 ? '#9CA3AF' : '#7FE5A8'
            }}
          >
            {resendCountdown > 0 ? `Reenviar em ${resendCountdown}s` : 'Reenviar código'}
          </button>
        </div>
      </div>

      {/* Back to Login */}
      <p className="text-center text-sm text-gray-600">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="font-medium text-green-600 hover:text-green-700 transition-colors"
          style={{ color: '#7FE5A8' }}
        >
          Voltar para login
        </button>
      </p>
    </form>
  );
};
