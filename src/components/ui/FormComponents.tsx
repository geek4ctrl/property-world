'use client';

import React, { useState, forwardRef } from 'react';

// Enhanced Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animate?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    animate = true,
    children,
    disabled,
    ...props 
  }, ref) => {

    const getVariantClasses = () => {
      const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-transparent focus:ring-blue-500 shadow-lg hover:shadow-xl',
        secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border-transparent focus:ring-gray-500 shadow-lg hover:shadow-xl',
        outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border-blue-600 hover:border-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent hover:border-gray-300 focus:ring-gray-500',
        danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-transparent focus:ring-red-500 shadow-lg hover:shadow-xl'
      };
      return variants[variant];
    };

    const getSizeClasses = () => {
      const sizes = {
        sm: 'px-4 py-2.5 text-sm',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base'
      };
      return sizes[size];
    };

    const baseClasses = `
      inline-flex items-center justify-center relative overflow-hidden
      font-semibold rounded-xl border transition-all duration-300 ease-out
      focus:outline-none focus:ring-4 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transform hover:scale-105 active:scale-95
      ${animate ? 'hover:-translate-y-0.5' : ''}
      ${getSizeClasses()}
      ${getVariantClasses()}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {leftIcon && !loading && (
          <span className="mr-2">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="ml-2">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Enhanced Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '', 
    label, 
    error, 
    leftIcon, 
    rightIcon, 
    containerClassName = '',
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const getLabelColor = () => {
      if (error) return 'text-red-700';
      if (isFocused) return 'text-blue-700';
      return 'text-gray-900';
    };

    const getIconColor = () => {
      if (error) return 'text-red-400';
      if (isFocused) return 'text-blue-400';
      return 'text-gray-400';
    };

    const inputClasses = `
      w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ease-out
      bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500
      focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none focus:bg-white
      hover:border-gray-800 hover:bg-white hover:shadow-md
      ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-black'}
      ${leftIcon ? 'pl-12' : ''}
      ${rightIcon ? 'pr-12' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className={`relative ${containerClassName}`}>
        {label && (
          <label className={`form-label block text-sm font-semibold mb-3 transition-colors duration-200 ${getLabelColor()}`}>
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={`transition-colors ${getIconColor()}`}>
                {leftIcon}
              </span>
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className={`transition-colors ${getIconColor()}`}>
                {rightIcon}
              </span>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Enhanced Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className = '', 
    label, 
    error, 
    options, 
    placeholder,
    containerClassName = '',
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const getLabelColor = () => {
      if (error) return 'text-red-700';
      if (isFocused) return 'text-blue-700';
      return 'text-gray-900';
    };

    const getIconColor = () => {
      if (error) return 'text-red-500';
      if (isFocused) return 'text-blue-600';
      return 'text-gray-600';
    };

    const selectClasses = `
      form-input w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ease-out
      focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none focus:bg-white
      hover:border-gray-800 hover:bg-white hover:shadow-md appearance-none bg-white text-gray-900 font-medium
      overflow-hidden text-ellipsis whitespace-nowrap
      ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-black'}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className={`relative ${containerClassName}`}>
        {label && (
          <label className={`form-label block text-sm font-semibold mb-3 transition-colors ${getLabelColor()}`}>
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={selectClasses}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className={`w-4 h-4 transition-colors ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Enhanced Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className = '', 
    label, 
    error, 
    containerClassName = '',
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const getLabelColor = () => {
      if (error) return 'text-red-700';
      if (isFocused) return 'text-blue-700';
      return 'text-gray-900';
    };

    const textareaClasses = `
      form-input w-full px-3 py-2 border rounded-lg
      focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none
      hover:border-gray-500 resize-vertical min-h-[80px] bg-white text-gray-900 placeholder-gray-500
      ${error ? 'border-red-600 focus:ring-red-600 focus:border-red-600' : 'border-gray-500'}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className={`relative ${containerClassName}`}>
        {label && (
          <label className={`form-label block text-sm font-semibold mb-3 transition-colors ${getLabelColor()}`}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={textareaClasses}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Enhanced Checkbox Component
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, description, error, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              className={`
                h-5 w-5 text-blue-700 border border-gray-600 rounded
                focus:ring-blue-600 focus:ring-2 focus:ring-offset-2 focus:outline-none
                hover:border-gray-700 transition-all-normal hover-scale bg-white
                ${error ? 'border-red-600 text-red-700' : ''}
                ${className}
              `.trim().replace(/\s+/g, ' ')}
              {...props}
            />
          </div>
          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label className={`font-medium transition-colors ${
                  error ? 'text-red-700' : 'text-gray-900'
                }`}>
                  {label}
                </label>
              )}
              {description && (
                <p className="text-gray-500">{description}</p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Loading Button Component
export function LoadingButton({ loading, children, ...props }: Readonly<ButtonProps>) {
  return (
    <Button loading={loading} {...props}>
      {children}
    </Button>
  );
}