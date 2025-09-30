/* eslint-disable array-callback-return */
/* eslint-disable prettier/prettier */
import { Star, StarHalf } from "lucide-react";

type StarsProps = {
  rate: number;
};
export function StarsReview({ rate }: StarsProps) {
  const roundedRate = Math.round(rate * 2) / 2;
  const fullStars = Math.floor(roundedRate);
  const hasHalfStar = roundedRate % 1 !== 0;
  const totalStars = 5;

  return (
    <div className="flex min-h-4 items-start">
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: totalStars }).map((_, i) => {
            const index = i + 1;

            if (index <= fullStars) {
              return <Star key={i} size={15} color="#F9B023" fill="#F9B023" />;
            } else if (index === fullStars + 1 && hasHalfStar) {
              return (
                <StarHalf key={i} size={15} color="#F9B023" fill="#F9B023" />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default StarsReview;
