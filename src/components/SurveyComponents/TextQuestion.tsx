
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface TextQuestionProps {
  id: string;
  question: string;
  multiline?: boolean;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  onChange: (id: string, value: string) => void;
}

export const TextQuestion = ({
  id,
  question,
  multiline = false,
  placeholder = "",
  required = false,
  maxLength,
  onChange,
}: TextQuestionProps) => {
  const [value, setValue] = useState<string>("");
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(id, newValue);
  };

  return (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex gap-1 mb-2">
        <div className="font-medium">{question}</div>
        {required && <span className="text-red-500">*</span>}
      </div>
      
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className="min-h-[120px]"
        />
      ) : (
        <Input
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}
      
      {maxLength && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};
