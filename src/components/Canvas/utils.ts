const { sqrt, pow } = Math;

function getElementCursorPosition(
  clientX: number,
  clientY: number,
  currentTarget: HTMLElement,
): [x: number, y: number] {
  const { left, top } = currentTarget.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;

  return [x, y];
}

export function getCanvasCursorPosition(
  clientX: number,
  clientY: number,
  currentTarget: HTMLElement,
  canvasAttribs: { width: number; height: number },
): [x: number, y: number] {
  const [x, y] = getElementCursorPosition(clientX, clientY, currentTarget);
  const { width, height } = canvasAttribs;

  const { left, right, top, bottom } = currentTarget.getBoundingClientRect();
  const [domWidth, domHeight] = [right - left, bottom - top];

  return [(x / domWidth) * width, (y / domHeight) * height];
}

export function getPinchCenter(
  event: TouchEvent,
  canvasAttribs: { width: number; height: number },
): [x: number, y: number] {
  function getCanvasPosition(
    clientX: number,
    clientY: number,
  ): ReturnType<typeof getCanvasCursorPosition> {
    return getCanvasCursorPosition(
      clientX,
      clientY,
      currentTarget as HTMLElement,
      canvasAttribs,
    );
  }
  const {
    touches: [a, b],
    currentTarget,
  } = event;

  const [touchA, touchB] = [
    getCanvasPosition(a.clientX, a.clientY),
    getCanvasPosition(b.clientX, b.clientY),
  ];

  return [(touchA[0] + touchB[0]) / 2, (touchA[1] + touchB[1]) / 2];
}

export function getPinchRadius(event: TouchEvent): number {
  const {
    touches: [a, b],
  } = event;
  return sqrt(pow(b.clientX - a.clientX, 2) + pow(b.clientY - a.clientY, 2));
}
