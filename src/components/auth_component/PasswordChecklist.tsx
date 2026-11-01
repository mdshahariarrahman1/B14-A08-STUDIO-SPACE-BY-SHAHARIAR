import { cn } from "@/lib/utils";

export type PasswordCheck = {
  label: string;
  met: boolean;
};

export function buildPasswordChecks(password: string): PasswordCheck[] {
  return [
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "At least 6 characters", met: password.length >= 6 },
  ];
}

const PasswordChecklist = ({ checks }: { checks: PasswordCheck[] }) => {
  return (
    <ul className="space-y-2.5">
      {checks.map((check) => (
        <li
          key={check.label}
          className="flex items-center gap-2.5 text-sm text-[#6B6459]"
        >
          <span
            aria-hidden="true"
            className={cn(
              "grid size-4 shrink-0 place-items-center rounded-full border transition-colors duration-200",
              check.met
                ? "border-[#F0A63C] bg-[#F0A63C]"
                : "border-neutral-400 bg-transparent",
            )}
          >
            {check.met ? (
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : null}
          </span>
          <span className="sr-only">{check.met ? "Met: " : "Not met: "}</span>
          {check.label}
        </li>
      ))}
    </ul>
  );
};

export default PasswordChecklist;
