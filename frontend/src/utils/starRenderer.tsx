export function renderStars(rating: number) {
  const maxStars = 5;
  const filledStars = Math.round(rating);
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <span key={i} className={i <= filledStars ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    );
  }
  return <span>{stars}</span>;
}