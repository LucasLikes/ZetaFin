import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from './FormInput';
import { Button } from './Button';
import { GoogleButton } from './GoogleButton';

interface SignUpFormProps {
  onSubmit: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  onGoogleSignUp: () => Promise<void>;
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

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onGoogleSignUp,
  isLoading = false,
  serverError,
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string;
    confirmPassword?: string;
  }>({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
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
      await onSubmit(name, email, password, confirmPassword);
    } catch {
      // Error handled by parent component
    }
  };

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    try {
      await onGoogleSignUp();
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Crie sua conta
        </h1>
        <p className="text-gray-500">
          Comece a controlar suas finanças
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
        {/* Form Fields */}
        <div className="space-y-5">
          <FormInput
            ref={nameRef}
            label="Nome completo"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (isSubmitted) setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
            icon={<UserIcon />}
            disabled={isLoading || googleLoading}
          />

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
            autoComplete="new-password"
            disabled={isLoading || googleLoading}
          />

          <FormInput
            ref={confirmPasswordRef}
            label="Confirmar senha"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (isSubmitted) setErrors({ ...errors, confirmPassword: '' });
            }}
            error={errors.confirmPassword}
            icon={<LockIcon />}
            actions={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
              </button>
            }
            autoComplete="new-password"
            disabled={isLoading || googleLoading}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading || googleLoading}
          className="w-full"
        >
          {isLoading ? 'Criando conta...' : 'Criar conta'}
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

        {/* Google Sign Up Button */}
        <GoogleButton
          onClick={handleGoogleClick}
          isLoading={googleLoading}
          disabled={isLoading || googleLoading}
        >
          Criar com Google
        </GoogleButton>
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        Já tem conta?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="font-medium text-green-600 hover:text-green-700 transition-colors"
          style={{ color: '#7FE5A8' }}
        >
          Entrar
        </button>
      </p>
    </form>
  );
};
