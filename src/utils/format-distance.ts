function formatDistance(inputInMeters: number, short = false): string {
  const meters = Math.round(inputInMeters);
  if (meters < 1000) {
    if (short) {
      return `${meters} m`;
    }
    return `${meters} meter${meters === 1 ? '' : 's'}`;
  }
  const km = Math.round(meters / 1000);
  return `${km}.${meters % 1000} km`;
}

export default formatDistance;
