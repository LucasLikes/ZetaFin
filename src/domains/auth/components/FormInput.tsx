import React, { forwardRef } from 'react';

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  hint?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      icon,
      actions,
      hint,
      id,
      className,
      'aria-invalid': ariaInvalid,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '_');
    const errorId = `${inputId}_error`;
    const hintId = `${inputId}_hint`;

    const describedBy = [
      error ? errorId : null,
      hint ? hintId : null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-800"
          >
            {label}
          </label>
          {actions}
        </div>

        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={ariaInvalid || !!error}
            aria-describedby={describedBy || ariaDescribedBy}
            className={`
              w-full px-4 transition-all duration-200
              ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3
              border rounded-lg text-gray-900 placeholder-gray-400
              bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
              ${
                error
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-200 hover:border-gray-300 focus:ring-green-500'
              }
              ${className || ''}
            `}
            style={{
              ...(error && {
                borderColor: '#F44336',
                '--tw-ring-color': '#F44336',
              } as React.CSSProperties),
              ...(!error && {
                '--tw-ring-color': '#7FE5A8',
              } as React.CSSProperties),
            }}
            {...props}
          />
        </div>

        {error && (
          <p id={errorId} className="text-sm text-red-500 font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="text-xs text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
