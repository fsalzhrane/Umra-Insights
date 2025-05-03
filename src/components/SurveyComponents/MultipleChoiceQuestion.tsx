
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";

interface Option {
  value: string;
  label: string;
}

interface MultipleChoiceQuestionProps {
  id: string;
  question: string;
  options: Option[];
  allowOther?: boolean;
  required?: boolean;
  onChange: (id: string, value: string, comment?: string) => void;
}

export const MultipleChoiceQuestion = ({
  id,
  question,
  options,
  allowOther = false,
  required = false,
  onChange,
}: MultipleChoiceQuestionProps) => {
  const { t } = useLanguage();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [otherValue, setOtherValue] = useState<string>("");

  const handleChange = (value: string) => {
    setSelectedValue(value);
    
    if (value !== "other") {
      onChange(id, value);
    } else {
      onChange(id, "other", otherValue);
    }
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherValue(e.target.value);
    if (selectedValue === "other") {
      onChange(id, "other", e.target.value);
    }
  };

  return (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex gap-1 mb-2">
        <div className="font-medium">{question}</div>
        {required && <span className="text-red-500">*</span>}
      </div>
      
      <RadioGroup value={selectedValue} onValueChange={handleChange} className="space-y-2 mt-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
            <Label htmlFor={`${id}-${option.value}`} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
        
        {allowOther && (
          <>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id={`${id}-other`} />
              <Label htmlFor={`${id}-other`} className="cursor-pointer">
                {t("survey.other")}
              </Label>
            </div>
            
            {selectedValue === "other" && (
              <Textarea
                value={otherValue}
                onChange={handleOtherChange}
                placeholder={t("survey.otherPlaceholder")}
                className="mt-2 min-h-20"
              />
            )}
          </>
        )}
      </RadioGroup>
    </div>
  );
};
