export function getElementCursorPosition(
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
): [x: number, y: number] {
  const { clientX, clientY, currentTarget } = event;
  const { left, top } = currentTarget.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;

  return [x, y];
}

export function getCanvasCursorPosition(
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  canvasAttribs: { width: number; height: number },
): [x: number, y: number] {
  const [x, y] = getElementCursorPosition(event);
  const { width, height } = canvasAttribs;

  const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
  const [domWidth, domHeight] = [right - left, bottom - top];

  return [(x / domWidth) * width, (y / domHeight) * height];
}
