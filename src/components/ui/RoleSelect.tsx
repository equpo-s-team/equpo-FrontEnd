import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoleOption {
  value: string;
  label: string;
  color: string;
  bg: string;
}

interface RoleSelectProps {
  value: string;
  onChange: (value: string) => void;
  roles: RoleOption[];
  disabled?: boolean;
  className?: string;
}

export function RoleSelect({ value, onChange, roles, disabled, className }: RoleSelectProps) {
  const current = roles.find((r) => r.value === value);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={`h-auto border-grey-150 rounded-xl text-xs font-body text-grey-700 bg-white hover:border-grey-300 focus:ring-0 focus:ring-offset-0 px-2 py-1 ${className ?? ''}`}
      >
        {current ? (
          <span
            className="inline-flex items-center gap-1.5 font-semibold"
            style={{ color: current.color }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: current.color }}
            />
            {current.label}
          </span>
        ) : (
          <SelectValue placeholder="Rol" />
        )}
      </SelectTrigger>
      <SelectContent className="rounded-xl border-grey-150 font-body text-xs min-w-[120px]">
        {roles.map((role) => (
          <SelectItem
            key={role.value}
            value={role.value}
            className="rounded-lg cursor-pointer focus:bg-secondary"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: role.color }} />
              <span style={{ color: role.color }} className="font-semibold">
                {role.label}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
