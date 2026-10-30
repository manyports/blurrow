import { Input } from "@/components/ui/Input";

function SearchIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" d="m21 21-4.35-4.35" />
    </svg>
  );
}

export default function InputWithIcon() {
  return (
    <div className="w-full max-w-xs">
      <Input label="search" placeholder="search posts…" iconLeft={<SearchIcon />} fullWidth />
    </div>
  );
}
