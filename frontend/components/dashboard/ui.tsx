import Link from 'next/link';
import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-200 ${
        hover
          ? 'hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.06),0_12px_24px_rgba(0,0,0,0.08)]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-[#525252] sm:text-base">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({
  children,
  type = 'button',
  disabled,
  onClick,
  className = '',
}: {
  children: ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  href,
  type = 'button',
  onClick,
  className = '',
}: {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  className?: string;
}) {
  const classes = `inline-flex h-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-5 text-sm font-medium text-[#111111] transition-colors hover:bg-[#F3F4F6] ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function Input({
  label,
  id,
  error,
  required,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[#111111]"
      >
        {label}
        {required && <span className="text-[#EF4444]"> *</span>}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-10 w-full rounded-xl border bg-white px-4 text-sm text-[#111111] placeholder:text-[#737373] transition-shadow outline-none ${
          error
            ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
            : 'border-[#E5E7EB] focus:border-[#111111] focus:ring-2 focus:ring-black/5'
        }`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-[#EF4444]">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  id,
  error,
  children,
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[#111111]"
      >
        {label}
      </label>
      <select
        id={id}
        className={`h-10 w-full cursor-pointer rounded-xl border bg-white px-4 text-sm text-[#111111] transition-shadow outline-none ${
          error
            ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
            : 'border-[#E5E7EB] focus:border-[#111111] focus:ring-2 focus:ring-black/5'
        }`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1.5 text-xs text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  id,
  error,
  required,
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[#111111]"
      >
        {label}
        {required && <span className="text-[#EF4444]"> *</span>}
      </label>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        className={`min-h-[100px] w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-[#737373] transition-shadow outline-none ${
          error
            ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
            : 'border-[#E5E7EB] focus:border-[#111111] focus:ring-2 focus:ring-black/5'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}
