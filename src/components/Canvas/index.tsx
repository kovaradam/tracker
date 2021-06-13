import React, { useCallback, useEffect, useReducer, useRef } from 'react';

import useForwardedRef from '../../utils/use-forwarded-ref';
import { getCursorPosition } from './utils';

type Props = {
  className: string;
  width: number;
  height: number;
  draw: ((context: CanvasRenderingContext2D) => void)[];
};

type CanvasRef = HTMLCanvasElement | null;

type ZoomState = [zoom: number, x: number, y: number];

function zoomReducer(prev: ZoomState, newValue: ZoomState): ZoomState {
  const [prevZoom] = prev;
  const [zoomUpdate, x, y] = newValue;
  const newZoom = prevZoom + zoomUpdate;
  const isReset = newZoom < 1;
  if (isReset) {
    return [1, 0, 0];
  }
  return [newZoom, x, y];
}

type PanState = [startX?: number, startY?: number, endX?: number, endY?: number];

const defaultPan = [undefined, undefined, undefined, undefined] as PanState;
const getDiff = (state: PanState): [dx: number, dy: number] => {
  const [startX, startY, endX, endY] = state;
  const dx = Number(endX) - Number(startX);
  const dy = Number(endY) - Number(startY);
  return [dx, dy];
};

const Canvas = React.forwardRef<CanvasRef, Props>((props, forwardedRef) => {
  const [zoomState, updateZoom] = useReducer(zoomReducer, [1, 0, 0]);
  const [didUpdate, forceUpdate] = useReducer((p) => !p, false);
  const panState = useRef(defaultPan);
  const canvasElement = useForwardedRef<CanvasRef>(forwardedRef);

  const updatePan = useCallback(
    (newValue: PanState | null): void => {
      const prev = panState.current;
      const [zoom] = zoomState;
      if (newValue === null || zoom === 1) {
        panState.current = defaultPan;
        return;
      }
      panState.current = prev.map((prevValue, index) => {
        return newValue[index] ?? prevValue;
      }) as PanState;
      forceUpdate();
    },
    [forceUpdate, panState, zoomState],
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLCanvasElement>) => {
      const [x, y] = getCursorPosition(event);
      const zoom = -event.deltaY / 1000;
      updateZoom([zoom, x, y]);
    },
    [updateZoom],
  );

  useEffect(() => {
    if (!canvasElement?.current) {
      return;
    }
    function listener(event: Event): void {
      if (event.target === canvasElement.current) {
        event.preventDefault();
      }
    }
    const parent = canvasElement.current.parentElement;
    parent?.addEventListener('wheel', listener);
    return (): void => parent?.removeEventListener('wheel', listener);
  }, [canvasElement]);

  useEffect(() => {
    if (!canvasElement.current) {
      return;
    }
    const context = canvasElement.current.getContext('2d');
    if (!context) {
      return;
    }
    const { width, height, draw } = props;
    const [zoom, ptx, pty] = zoomState;
    context.clearRect(0, 0, width, height);
    context.translate(ptx, pty);
    context.setTransform(zoom, 0, 0, zoom, 0, 0);
    context.translate(-ptx, -pty);
    if (zoom === 1) {
      updatePan(null);
    }
    const [panX, panY] = getDiff(panState.current);
    context.translate(panX, panY);
    draw.forEach((draw) => draw(context));
  }, [canvasElement, zoomState, props, panState, didUpdate, updatePan]);

  useEffect(() => {
    if (!canvasElement.current) {
      return;
    }
    const currentElement = canvasElement.current;
    function onTouchStart(event: TouchEvent): void {
      event.preventDefault();
      const { changedTouches } = event;
      if (changedTouches.length === 1) {
        const touch = changedTouches[0];
        const { clientX, clientY } = touch;
        updatePan([clientX, clientY]);
      }
    }
    function onTouchMove(event: TouchEvent): void {
      const { changedTouches } = event;
      if (changedTouches.length === 1) {
        const touch = changedTouches[0];
        const { clientX, clientY } = touch;
        updatePan([undefined, undefined, clientX, clientY]);
      }
    }
    function onTouchEnd(): void {
      //   updatePan(null);
    }
    currentElement.ontouchstart = onTouchStart;
    currentElement.ontouchmove = onTouchMove;
    currentElement.ontouchend = onTouchEnd;
    return (): void => {
      currentElement.ontouchstart = null;
      currentElement.ontouchmove = null;
      currentElement.ontouchend = null;
    };
  }, [canvasElement, updatePan]);

  return <canvas {...props} ref={canvasElement} onWheel={handleWheel} />;
});

export default Canvas;
