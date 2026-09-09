import { Star } from 'lucide-react';

type StarRatingProps = {
  rating: number;
  size?: number;
  showNumber?: boolean;
  reviewCount?: number;
};

export default function StarRating({
  rating,
  size = 16,
  showNumber = false,
  reviewCount,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            style={{
              width: size,
              height: size,
              color:  star <= Math.round(rating) ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)',
              fill:   star <= Math.round(rating) ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)',
            }}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-medium" style={{ color: 'var(--color-mist)' }}>
          {rating > 0 ? rating.toFixed(1) : 'New'}
          {reviewCount !== undefined && reviewCount > 0 && (
            <span className="ml-1 opacity-70">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}
