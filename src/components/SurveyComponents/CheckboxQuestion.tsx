
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";

interface Option {
  value: string;
  label: string;
}

interface CheckboxQuestionProps {
  id: string;
  question: string;
  options: Option[];
  allowOther?: boolean;
  required?: boolean;
  onChange: (id: string, values: string[], comment?: string) => void;
}

export const CheckboxQuestion = ({
  id,
  question,
  options,
  allowOther = false,
  required = false,
  onChange,
}: CheckboxQuestionProps) => {
  const { t } = useLanguage();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [otherValue, setOtherValue] = useState<string>("");
  
  const handleCheckboxChange = (value: string, checked: boolean) => {
    let newSelectedValues: string[];
    
    if (checked) {
      newSelectedValues = [...selectedValues, value];
    } else {
      newSelectedValues = selectedValues.filter(v => v !== value);
    }
    
    setSelectedValues(newSelectedValues);
    
    // Handle "other" separately
    if (value !== "other" || !checked) {
      onChange(id, newSelectedValues, otherValue);
    }
  };
  
  const handleOtherChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherValue(e.target.value);
    
    // If "other" is selected, update the response with the new other value
    if (selectedValues.includes("other")) {
      onChange(id, selectedValues, e.target.value);
    }
  };

  return (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex gap-1 mb-2">
        <div className="font-medium">{question}</div>
        {required && <span className="text-red-500">*</span>}
      </div>
      
      <div className="space-y-2 mt-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox 
              id={`${id}-${option.value}`} 
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) => handleCheckboxChange(option.value, checked === true)}
            />
            <Label htmlFor={`${id}-${option.value}`} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
        
        {allowOther && (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`${id}-other`} 
                checked={selectedValues.includes("other")}
                onCheckedChange={(checked) => handleCheckboxChange("other", checked === true)}
              />
              <Label htmlFor={`${id}-other`} className="cursor-pointer">
                {t("survey.other")}
              </Label>
            </div>
            
            {selectedValues.includes("other") && (
              <Textarea
                value={otherValue}
                onChange={handleOtherChange}
                placeholder={t("survey.otherPlaceholder")}
                className="mt-2 min-h-20"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
