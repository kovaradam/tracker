export function getCursorPosition(
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
): [x: number, y: number] {
  const { clientX, clientY, currentTarget } = event;
  const { left, top } = currentTarget.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;

  return [x, y];
}
