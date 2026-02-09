import type { ChangeEvent } from 'react';

type PhoneInputProps = {
  codeValue: string;
  numberValue: string;
  onCodeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNumberChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export const PhoneInput = ({
  codeValue,
  numberValue,
  onCodeChange,
  onNumberChange,
  error,
}: PhoneInputProps) => (
  <fieldset className="flex flex-col gap-1.5">
    <legend className="text-sm font-medium text-slate-900">Phone Number</legend>
    <div
      className={`flex border rounded-lg overflow-hidden transition-all duration-150 focus-within:ring-[3px] ${
        error
          ? 'border-red-600 focus-within:ring-red-600/10'
          : 'border-slate-200 focus-within:border-primary focus-within:ring-primary/10'
      }`}
    >
      <input
        type="text"
        value={codeValue}
        onChange={onCodeChange}
        placeholder="+1"
        aria-label="Country code"
        className="w-[70px] px-3 py-2.5 text-sm text-center border-r border-slate-200 bg-slate-50 text-slate-900 focus:outline-none placeholder:text-slate-400"
      />
      <input
        type="text"
        value={numberValue}
        onChange={onNumberChange}
        placeholder="1234567890"
        aria-label="Phone number"
        className="flex-1 px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none placeholder:text-slate-400"
      />
    </div>
    <div
      className={`overflow-hidden transition-all duration-250 ${
        error ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <span className="text-sm text-red-600">{error}</span>
    </div>
  </fieldset>
);
