import React, { useState, useRef } from 'react';
import { FormInput } from './FormInput';
import { Button } from './Button';
import { GoogleButton } from './GoogleButton';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  isLoading?: boolean;
  serverError?: string | null;
}

const EyeOpenIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onGoogleLogin,
  isLoading = false,
  serverError,
}) => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Digite um email válido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(email, password);
    } catch {
      // Error handled by parent component
    }
  };

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    try {
      await onGoogleLogin();
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Acesse sua conta
        </h1>
        <p className="text-gray-500">
          Gerencie suas finanças com inteligência
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

      {/* Form Card - Complete */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
        {/* Form Fields */}
        <div className="space-y-5">
          <FormInput
            ref={emailRef}
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (isSubmitted) setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            icon={<EmailIcon />}
            autoComplete="email"
            disabled={isLoading || googleLoading}
          />

          <FormInput
            ref={passwordRef}
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (isSubmitted) setErrors({ ...errors, password: '' });
            }}
            error={errors.password}
            icon={<LockIcon />}
            actions={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
              </button>
            }
            autoComplete="current-password"
            disabled={isLoading || googleLoading}
          />
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <a
            href="#forgot-password"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
            style={{ '--text-hover': '#7FE5A8' } as React.CSSProperties}
          >
            Esqueci minha senha
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading || googleLoading}
          className="w-full"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400">ou</span>
          </div>
        </div>

        {/* Google Login Button Inside Card */}
        <GoogleButton
          onClick={handleGoogleClick}
          isLoading={googleLoading}
          disabled={isLoading || googleLoading}
        />
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600">
        Ainda não tem conta?{' '}
        <a
          href="#sign-up"
          className="font-medium text-green-600 hover:text-green-700 transition-colors"
          style={{ color: '#7FE5A8' }}
        >
          Cadastre-se
        </a>
      </p>
    </form>
  );
};
