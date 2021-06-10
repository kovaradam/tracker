function formatDistance(inputInMeters: number): string {
  const meters = Math.round(inputInMeters);
  if (meters < 1000) {
    return `${meters} meter${meters === 1 ? '' : 's'}`;
  }
  const km = Math.round(meters / 1000);
  return `${km}.${meters % 1000} km`;
}

export default formatDistance;
