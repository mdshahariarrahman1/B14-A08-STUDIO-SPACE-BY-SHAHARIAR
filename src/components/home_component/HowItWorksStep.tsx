import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type HowItWorksStepProps = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
};

const HowItWorksStep = ({
  number,
  title,
  description,
  icon: Icon,
  iconClassName,
}: HowItWorksStepProps) => (
  <Card className="rounded-[1.25rem] border-[#ebe6df] bg-white py-0 shadow-none transition duration-300 hover:-translate-y-1 hover:shadow-lg">
    <CardContent className="min-h-64 p-6 sm:min-h-66 sm:p-7">
      <div className="flex items-start justify-between">
        <span
          className={`grid size-12 place-items-center rounded-xl ${iconClassName}`}
        >
          <Icon className="size-5" strokeWidth={2.25} />
        </span>
        <span className="text-3xl font-semibold tracking-tight text-[#e9e3da]">
          {number}
        </span>
      </div>
      <h3 className="mt-7 text-lg font-semibold tracking-tight text-neutral-950">
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-[1.65] text-neutral-600">
        {description}
      </p>
    </CardContent>
  </Card>
);

export default HowItWorksStep;
