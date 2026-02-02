import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Neo-Brutalist Button ---
interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-electric-yellow hover:bg-yellow-400 text-stark-black',
    secondary: 'bg-white hover:bg-gray-100 text-stark-black',
    danger: 'bg-safety-orange hover:bg-orange-600 text-white',
  };
  
  const sizes = {
    sm: 'px-3 py-1 text-sm border-2',
    md: 'px-6 py-3 text-base border-4',
    lg: 'px-8 py-4 text-xl border-4',
  };

  return (
    <button
      className={cn(
        'font-bold uppercase tracking-wider transition-all duration-75',
        'border-stark-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Neo-Brutalist Card ---
interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({ className, title, children, ...props }) => {
  return (
    <div 
      className={cn(
        'bg-white border-4 border-stark-black shadow-neo p-6',
        className
      )} 
      {...props}
    >
      {title && (
        <h3 className="font-sans font-bold text-2xl mb-4 uppercase border-b-4 border-stark-black pb-2 inline-block">
          {title}
        </h3>
      )}
      <div className="font-mono text-sm">
        {children}
      </div>
    </div>
  );
};

// --- Neo-Brutalist Input ---
interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const NeoInput: React.FC<NeoInputProps> = ({ className, label, id, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="font-bold uppercase text-sm">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'bg-off-white border-4 border-stark-black p-3 font-mono focus:outline-none focus:bg-electric-yellow transition-colors',
          className
        )}
        {...props}
      />
    </div>
  );
};
