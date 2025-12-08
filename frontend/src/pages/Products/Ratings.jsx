import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value = 0, text, color }) => {
  // Make sure value is always a valid number
  const ratingValue = Number(value);
  if (isNaN(ratingValue)) return null; // skip rendering if invalid

  // Clamp between 0 and 5
  const clampedValue = Math.min(Math.max(ratingValue, 0), 5);

  const fullStars = Math.floor(clampedValue);
  const hasHalfStar = clampedValue - fullStars >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="flex items-center">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} className={`text-${color} ml-1`} />
      ))}

      {/* Half star */}
      {hasHalfStar && <FaStarHalfAlt className={`text-${color} ml-1`} />}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} className={`text-${color} ml-1`} />
      ))}

      {/* Optional rating text */}
      {text && <span className={`ml-2 text-${color}`}>{text}</span>}
    </div>
  );
};

Ratings.defaultProps = {
  color: "yellow-500",
};

export default Ratings;
