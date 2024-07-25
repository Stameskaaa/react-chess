import React, { useRef } from 'react';
import './chess-board.css';
import { ChessCage } from './chessCage/ChessCage';
export const ChessBoard = () => {
  const chessBoardRef = useRef(null);

  return (
    <div ref={chessBoardRef} className="chess_board">
      <ChessCage chessBoardRef={chessBoardRef} />
    </div>
  );
};
