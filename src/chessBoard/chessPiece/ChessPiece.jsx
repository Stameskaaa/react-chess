import React, { useEffect, useState } from 'react';
import './chess-piece.css';
export const ChessPiece = ({
  handleDropOver,
  cage,
  handleDragStart,
  handleDragEnd,
  handleDrop,
  index,
  activePiece,
  openPiece,
  translatePiece,
  closePiece,
  hideField,
}) => {
  const clickedActivatePiece = (piece, indexPiece) => {
    if (activePiece?.side === piece?.props.side) {
      if (activePiece?.indexFrom === index) {
        closePiece();
      } else {
        openPiece({
          indexFrom: indexPiece,
          pieceData: cage.props.data,
          pieceJSX: cage,
          side: piece.props.side,
        });
      }

      return;
    }

    if (activePiece && activePiece.index !== index) {
      translatePiece(indexPiece);
    } else {
      openPiece({
        indexFrom: indexPiece,
        pieceData: cage.props.data,
        pieceJSX: cage,
        side: piece.props.side,
      });
    }
  };

  const getFieldColor = (index) => {
    const row = Math.floor(index / 8);
    const column = index % 8;

    if ((row % 2 === 0 && column % 2 === 0) || (row % 2 !== 0 && column % 2 !== 0)) {
      return 'black';
    } else {
      return 'white';
    }
  };

  return (
    <>
      <div
        onClick={() => clickedActivatePiece(cage, index)}
        key={index}
        onDragOver={(e) => handleDropOver(e, index)}
        onDrop={(e) => handleDrop(e, index)}
        onDragEnd={(e) => handleDragEnd(e)}
        draggable={true}
        onDragStart={(e) =>
          handleDragStart(e, {
            indexFrom: index,
            pieceData: cage.props.data,
            pieceJSX: cage,
            side: cage.props.side,
          })
        }
        className={`piece_wrapper `}>
        {cage}
      </div>
      {hideField && index === activePiece?.indexFrom ? (
        <div
          style={{
            position: 'absolute',
            zIndex: '1',
            pointerEvents: 'none',
          }}
          data={`Empty`}
          className={`empty_square ${getFieldColor(index)}`}
        />
      ) : null}
    </>
  );
};
