import React, { useCallback, useEffect, useReducer, useRef } from 'react';

import { styled } from '@linaria/react';

import { canvasColor } from '../../style';
import useForwardedRef from '../../utils/use-forwarded-ref';
import { getCanvasCursorPosition, getPinchCenter, getPinchRadius } from './utils';

export type DrawCallback = (context: CanvasRenderingContext2D, zoom: number) => void;

type Props = {
  className: string;
  width: number;
  height: number;
  draw: DrawCallback[];
};

type CanvasRef = HTMLCanvasElement | null;

type ZoomState = [zoom: number, x: number, y: number];

function zoomReducer(prev: ZoomState, newValue: ZoomState): ZoomState {
  const [prevZoom] = prev;
  const [zoomUpdate, x, y] = newValue;
  const newZoom = prevZoom + zoomUpdate;
  const isReset = newZoom <= 1;
  if (isReset) {
    return [1, 0, 0];
  }
  return [newZoom, x, y];
}

type PanState = [startX?: number, startY?: number, endX?: number, endY?: number];

const defaultPan = [undefined, undefined, undefined, undefined] as PanState;

const getTouchDiff = (state: PanState): [dx: number, dy: number] => {
  const [startX, startY, endX, endY] = state;
  const dx = Number(endX) - Number(startX);
  const dy = Number(endY) - Number(startY);
  return [!isNaN(dx) ? dx : 0, !isNaN(dy) ? dy : 0];
};

const Canvas = React.forwardRef<CanvasRef, Props>((props, forwardedRef) => {
  const [zoomState, updateZoom] = useReducer(zoomReducer, [1, 0, 0]);
  const [didUpdate, forceUpdate] = useReducer((p) => !p, false);
  const panState = useRef({ coords: defaultPan, isActive: false, prevDiff: [0, 0] });
  const pinchState = useRef({ radius: 0 });
  const canvasElement = useForwardedRef<CanvasRef>(forwardedRef);

  const getCurrentPanBound = useCallback((): [number, number] => {
    const [zoom] = zoomState;
    const { width, height } = props;
    const getBoundSize = (dimension: number): number => (dimension / 2) * (zoom - 1);
    return [getBoundSize(width), getBoundSize(height)];
  }, [props, zoomState]);

  const getCurrentPan = useCallback((newCoords: PanState): [number, number] => {
    const [panX, panY] = getTouchDiff(newCoords);
    const [prevPanX, prevPanY] = panState.current.prevDiff;
    return [panX + prevPanX, panY + prevPanY];
  }, []);

  const updatePan = useCallback(
    (newValue: PanState | null): void => {
      const prev = panState.current.coords;
      const [zoom] = zoomState;
      if (newValue === null || zoom === 1) {
        panState.current.coords = defaultPan;
        return;
      }
      const newCoords = prev.map((prevValue, index) => {
        return newValue[index] ?? prevValue;
      }) as PanState;

      const [boundX, boundY] = getCurrentPanBound();
      const [newPanX, newPanY] = getCurrentPan(newCoords);
      if (Math.abs(newPanX) >= boundX) {
        newCoords[2] = prev[2];
      }
      if (Math.abs(newPanY) >= boundY) {
        newCoords[3] = prev[3];
      }
      panState.current.coords = newCoords;
      forceUpdate();
    },
    [forceUpdate, panState, zoomState, getCurrentPanBound, getCurrentPan],
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLCanvasElement>) => {
      const { clientX, clientY, currentTarget } = event;

      const [x, y] = getCanvasCursorPosition(clientX, clientY, currentTarget, props);
      const zoom = -event.deltaY / 1000;
      updateZoom([zoom, x, y]);
    },
    [updateZoom, props],
  );

  const handlePinch = useCallback(
    (event: TouchEvent) => {
      const [x, y] = getPinchCenter(event, props);
      const { radius: prevRadius } = pinchState.current;
      const newRadius = getPinchRadius(event);
      const zoomDirection = prevRadius < newRadius ? 1 : -1;
      const zoomUpdate = +(prevRadius !== newRadius) * zoomDirection * 0.1;
      pinchState.current.radius = newRadius;
      updateZoom([zoomUpdate, x, y]);
    },
    [updateZoom, props],
  );

  // Append wheel listener
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

  // Apply transforms and draw
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

    context.clearRect(-zoom, -zoom, width * zoom, height * zoom);
    context.fillStyle = canvasColor;
    context.fillRect(-zoom, -zoom, width * zoom, height * zoom);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(ptx, pty);
    context.scale(zoom, zoom);
    context.translate(-ptx, -pty);
    if (zoom === 1) {
      updatePan(null);
      panState.current.prevDiff = [0, 0];
    }
    const [panX, panY] = getCurrentPan(panState.current.coords);

    context.translate(panX, panY);
    draw.forEach((draw) => draw(context, zoom));
  }, [canvasElement, zoomState, props, panState, didUpdate, updatePan, getCurrentPan]);

  // Append touch listener
  useEffect(() => {
    if (!canvasElement.current) {
      return;
    }
    const currentElement = canvasElement.current;

    function onTouchStart(event: TouchEvent): void {
      panState.current.isActive = true;
      event.preventDefault();
      const { touches } = event;
      switch (touches.length) {
        case 1:
          const touch = touches[0];
          const { clientX, clientY } = touch;
          updatePan([clientX, clientY]);
          break;
        case 2:
          handlePinch(event);
          break;
      }
    }

    function onTouchMove(event: TouchEvent): void {
      const { changedTouches } = event;
      switch (changedTouches.length) {
        case 1:
          const touch = changedTouches[0];
          const { clientX, clientY } = touch;
          updatePan([undefined, undefined, clientX, clientY]);
          break;
        case 2:
          handlePinch(event);
          break;
      }
    }

    function onTouchEnd(event: TouchEvent): void {
      const { changedTouches } = event;
      switch (changedTouches.length) {
        case 1:
          panState.current.isActive = false;
          panState.current.prevDiff = getCurrentPan(panState.current.coords);
          updatePan(null);
          break;
        case 2:
          break;
      }
    }

    currentElement.addEventListener('touchstart', onTouchStart);
    currentElement.addEventListener('touchmove', onTouchMove);
    currentElement.addEventListener('touchend', onTouchEnd);

    return (): void => {
      currentElement.removeEventListener('touchstart', onTouchStart);
      currentElement.removeEventListener('touchmove', onTouchMove);
      currentElement.removeEventListener('touchend', onTouchEnd);
    };
  }, [canvasElement, updatePan, getCurrentPan, handlePinch]);

  return <S.Canvas {...props} ref={canvasElement} onWheel={handleWheel} />;
});

export default Canvas;

const S = {
  Canvas: styled.canvas`
    touch-action: none;
  `,
};
