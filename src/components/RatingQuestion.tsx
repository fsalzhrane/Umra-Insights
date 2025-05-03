
import { useState } from "react";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";

interface RatingQuestionProps {
  id: string;
  question: string;
  onChange: (id: string, rating: number, comment: string) => void;
}

export const RatingQuestion = ({ id, question, onChange }: RatingQuestionProps) => {
  const { t } = useLanguage();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleRatingChange = (value: number) => {
    setRating(value);
    onChange(id, value, comment);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    onChange(id, rating, e.target.value);
  };

  const isCommentRequired = rating <= 2 && rating > 0;

  return (
    <div className="py-4 border-b last:border-b-0">
      <div className="mb-2 font-medium">{question}</div>
      <div className="flex items-center mb-3">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className="p-1 focus:outline-none"
            onClick={() => handleRatingChange(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star
              size={28}
              className={`transition-colors ${
                (hoverRating ? value <= hoverRating : value <= rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-4 text-sm text-gray-500">
          {rating === 1
            ? "Poor"
            : rating === 2
            ? "Fair"
            : rating === 3
            ? "Good"
            : rating === 4
            ? "Very Good"
            : rating === 5
            ? "Excellent"
            : "Select rating"}
        </span>
      </div>

      {isCommentRequired && (
        <div className="mt-3">
          <Textarea
            placeholder={t("survey.comment.required")}
            className="min-h-20 border-umrah-purple-light focus:border-umrah-purple"
            value={comment}
            onChange={handleCommentChange}
          />
        </div>
      )}
    </div>
  );
};
