export function formatTime(timeInSeconds: number): string {
  const seconds = Math.round(timeInSeconds) % 60;
  const minutes = Math.round(timeInSeconds / 60) % 60;
  const hours = Math.round(timeInSeconds / 3600);

  function padValue(input: number): string {
    return `${input}`.padStart(2, '0');
  }

  return `${padValue(hours)}:${padValue(minutes)}:${padValue(seconds)}`;
}
