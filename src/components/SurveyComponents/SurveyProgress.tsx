
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguage";

interface SurveyProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const SurveyProgress = ({
  currentStep,
  totalSteps,
  className = "",
}: SurveyProgressProps) => {
  const { t } = useLanguage();
  const percentage = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className={`mb-6 ${className}`}>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <div>{t("survey.progress")}</div>
        <div>{percentage}%</div>
      </div>
    </div>
  );
};
