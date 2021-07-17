import { styled } from '@linaria/react';

export const pathColors = ['#ffc0cb', '#0078a8', '#9a3f50', '#ffffa8', '#6b9a6b'];

export const canvasColor = '#fdfff5';

export const Overlay = styled.div`
  width: 100vw;
  height: 100vh !important;
  position: absolute;
  background-color: #27252555;
  top: 0;
  left: 0;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  animation: show 200ms;

  @keyframes show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  } ;
`;
