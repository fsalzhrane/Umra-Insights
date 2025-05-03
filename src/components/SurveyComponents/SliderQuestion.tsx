
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";

interface SliderQuestionProps {
  id: string;
  question: string;
  min?: number;
  max?: number;
  step?: number;
  labels?: string[];
  required?: boolean;
  commentRequired?: boolean;
  onChange: (id: string, value: number, comment?: string) => void;
}

export const SliderQuestion = ({
  id,
  question,
  min = 0,
  max = 10,
  step = 1,
  labels,
  required = false,
  commentRequired = false,
  onChange,
}: SliderQuestionProps) => {
  const { t } = useLanguage();
  const [value, setValue] = useState<number[]>([5]);
  const [comment, setComment] = useState<string>("");
  const midpoint = Math.floor((max - min) / 2) + min;

  const handleSliderChange = (newValue: number[]) => {
    setValue(newValue);
    onChange(id, newValue[0], comment);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    onChange(id, value[0], e.target.value);
  };

  return (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex gap-1 mb-2">
        <div className="font-medium">{question}</div>
        {required && <span className="text-red-500">*</span>}
      </div>
      
      <div className="pt-6 pb-2">
        <Slider 
          value={value}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          {labels ? (
            labels.map((label, index) => (
              <span key={index} className="text-center">
                {label}
              </span>
            ))
          ) : (
            <>
              <span>{min}</span>
              <span>{midpoint}</span>
              <span>{max}</span>
            </>
          )}
        </div>
        
        <div className="text-center mt-2 font-medium">
          Selected: {value[0]}
        </div>
      </div>
      
      {(commentRequired || value[0] <= Math.floor(max * 0.3)) && (
        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">
            {t("survey.pleaseExplain")}
          </label>
          <Textarea
            placeholder={t("survey.comment.required")}
            value={comment}
            onChange={handleCommentChange}
            className="min-h-20"
          />
        </div>
      )}
    </div>
  );
};
