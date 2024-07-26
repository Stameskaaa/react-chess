import React, { useEffect, useState } from 'react';
import './chess-cage.css';
import {
  FaChessRook,
  FaChessPawn,
  FaChessQueen,
  FaChessBishop,
  FaChessKnight,
} from 'react-icons/fa';
import { GiChessKing } from 'react-icons/gi';
import { ChessPiece } from '../chessPiece/ChessPiece';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDeletedFigures,
  changeCheckState,
  changeTurn,
  setGameState,
  clearGame,
} from '../../redux/slice';
import ModalComponent from '../../endGame/EndGame';

const kingFigure = {
  black: <FaChessQueen side="Black" data="Queen" className="chess_piece color_black_site " />,
  white: <FaChessQueen side="White" data="Queen" className="chess_piece color_white_site " />,
};

const startFieldArray = [
  // 1st row - White pieces
  <FaChessRook side="White" data="Castle" className="chess_piece color_white_site " />,
  <FaChessKnight side="White" data="Horse" className="chess_piece color_white_site " />,
  <FaChessBishop side="White" data="Bishop" className="chess_piece color_white_site " />,
  <FaChessQueen side="White" data="Queen" className="chess_piece color_white_site " />,
  <GiChessKing side="White" data="King" className="chess_piece color_white_site " />,
  <FaChessBishop side="White" data="Bishop" className="chess_piece color_white_site " />,
  <FaChessKnight side="White" data="Horse" className="chess_piece color_white_site " />,
  <FaChessRook side="White" data="Castle" className="chess_piece color_white_site " />,
  // 2nd row - White pawns
  ...Array(8)
    .fill(null)
    .map((_, index) => (
      <FaChessPawn side="White" data="Pawn" className="chess_piece color_white_site " />
    )),
  ...Array(32)
    .fill(null)
    .map((_, index) => <div data={`Empty`} className="empty_square" />),
  // 7th row - Black pawns
  ...Array(8)
    .fill(null)
    .map((_, index) => (
      <FaChessPawn side="Black" data="Pawn" className="chess_piece color_black_site " />
    )),
  // 8th row - Black pieces
  <FaChessRook side="Black" data="Castle" className="chess_piece  color_black_site  " />,
  <FaChessKnight side="Black" data="Horse" className="chess_piece  color_black_site  " />,
  <FaChessBishop side="Black" data="Bishop" className="chess_piece  color_black_site  " />,
  <FaChessQueen side="Black" data="Queen" className="chess_piece  color_black_site  " />,
  <GiChessKing side="Black" data="King" className="chess_piece  color_black_site  " />,
  <FaChessBishop side="Black" data="Bishop" className="chess_piece  color_black_site  " />,
  <FaChessKnight side="Black" data="Horse" className="chess_piece  color_black_site  " />,
  <FaChessRook side="Black" data="Castle" className="chess_piece  color_black_site  " />,
];

export const ChessCage = ({ chessBoardRef }) => {
  const [arrayOfPieces, setArrayOfPieces] = useState(startFieldArray);
  const [activePiece, setActivePiece] = useState(null);
  const [indexToTranslate, setIndexToTranslate] = useState(null);
  const [activeFieldsToMove, setActiveFieldsToMove] = useState([]);
  const [turn, setTurn] = useState('White');
  const [hideField, setHideField] = useState(false);
  const { checkState, gameEnded } = useSelector((state) => state.game);
  const [testFlag, setTestFlag] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chessBoardRef.current && !chessBoardRef.current.contains(event.target)) {
        closePiece();
      }
    };

    document.body.addEventListener('click', handleClickOutside);

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleDragStart = (e, activePieceObject) => {
    if (activePieceObject.pieceData !== 'Empty') {
      // e.dataTransfer.setDragImage(img, 0, 0);
      openPiece(activePieceObject);
      setHideField(true);
    } else {
      e.preventDefault();
    }
  };

  const showActiveFields = (activePiece, arrayOfPieces) => {
    const resultPossibleFields = []; //Итоговый массив допустимых ходов

    const checkPath = (index) => {
      const piece = arrayOfPieces[index];
      if (piece?.props?.side) {
        if (piece.props.side === activePiece.side) {
          return 'block';
        } else {
          resultPossibleFields.push(index);
          return 'capture';
        }
      }
      resultPossibleFields.push(index);
      return 'empty';
    }; //Проверка поля на наличие фигур

    const calculateHorseFields = (number) => {
      const row = Math.floor(number / 8);
      const column = number % 8;
      const resultArr = [];
      const knightMoves = [
        { row: row - 2, col: column - 1 },
        { row: row - 2, col: column + 1 },
        { row: row - 1, col: column - 2 },
        { row: row - 1, col: column + 2 },
        { row: row + 1, col: column - 2 },
        { row: row + 1, col: column + 2 },
        { row: row + 2, col: column - 1 },
        { row: row + 2, col: column + 1 },
      ];

      const validMoves = knightMoves.filter((move) => {
        return move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8;
      });

      validMoves.forEach((move) => {
        const position = move.row * 8 + move.col;
        resultArr.push(position);
      });
      return resultArr;
    };

    const calculateVerticalFields = (indexFrom, direction, steps = 7) => {
      const result = [];
      const step = direction === 'plus' ? 8 : -8;
      for (let i = 1; i <= steps; i++) {
        const newIndex = indexFrom + i * step;
        if (newIndex < 0 || newIndex >= 64) break;
        const status = checkPath(newIndex);
        if (status !== 'empty') break;
      }
      return result;
    };

    const calculateHorizontalFields = (indexFrom, steps = 7) => {
      const result = [];
      const rowStart = Math.floor(indexFrom / 8) * 8;
      const rowEnd = rowStart + 7;

      for (let i = 1; i <= steps; i++) {
        const leftMove = indexFrom - i;
        if (leftMove < rowStart) break;
        const status = checkPath(leftMove);
        if (status !== 'empty') break;
      }

      for (let i = 1; i <= steps; i++) {
        const rightMove = indexFrom + i;
        if (rightMove > rowEnd) break;
        const status = checkPath(rightMove);
        if (status !== 'empty') break;
      }
      return result;
    };

    const calculateDiagonalFields = (indexFrom, type, steps = 7) => {
      const result = [];
      const directions = {
        'up-left': -9,
        'up-right': -7,
        'down-left': 7,
        'down-right': 9,
      };
      const checkDiagonal = (step, index) => {
        for (let i = 1; i <= steps; i++) {
          const newIndex = indexFrom + i * step;
          if (
            newIndex < 0 ||
            newIndex >= 64 ||
            Math.abs(Math.floor(newIndex / 8) - Math.floor((indexFrom + (i - 1) * step) / 8)) !== 1
          )
            break;
          const status = checkPath(newIndex);
          if (status !== 'empty') break;
        }
      };
      if (type === 'one-around') {
        Object.values(directions).forEach((step) => {
          const newIndex = indexFrom + step;
          if (
            newIndex >= 0 &&
            newIndex < 64 &&
            Math.abs(Math.floor(newIndex / 8) - Math.floor(indexFrom / 8)) === 1
          ) {
            checkPath(newIndex);
          }
        });
      } else {
        Object.values(directions).forEach((step) => checkDiagonal(step, indexFrom));
      }
      return result;
    };

    switch (activePiece.pieceData) {
      case 'Pawn': {
        const direction = activePiece.side === 'White' ? 1 : -1;
        const initialRow = activePiece.side === 'White' ? 1 : 6;
        const nextRow = Math.floor(activePiece.indexFrom / 8) + direction;

        // Проверка на ход вперед
        const forwardIndex = activePiece.indexFrom + 8 * direction;
        if (arrayOfPieces[forwardIndex]?.props?.side === undefined) {
          resultPossibleFields.push(forwardIndex);
          if (Math.floor(activePiece.indexFrom / 8) === initialRow) {
            const doubleForwardIndex = activePiece.indexFrom + 16 * direction;
            if (arrayOfPieces[doubleForwardIndex]?.props?.side === undefined) {
              resultPossibleFields.push(doubleForwardIndex);
            }
          }
        }

        // Проверка на захват по диагонали
        const captureLeftIndex = activePiece.indexFrom + 7 * direction;
        const captureRightIndex = activePiece.indexFrom + 9 * direction;
        if (
          captureLeftIndex >= 0 &&
          captureLeftIndex < 64 &&
          Math.floor(captureLeftIndex / 8) === nextRow
        ) {
          if (
            arrayOfPieces[captureLeftIndex]?.props?.side !== undefined &&
            arrayOfPieces[captureLeftIndex]?.props?.side !== activePiece.side
          ) {
            resultPossibleFields.push(captureLeftIndex);
          }
        }
        if (
          captureRightIndex >= 0 &&
          captureRightIndex < 64 &&
          Math.floor(captureRightIndex / 8) === nextRow
        ) {
          if (
            arrayOfPieces[captureRightIndex]?.props?.side !== undefined &&
            arrayOfPieces[captureRightIndex]?.props?.side !== activePiece.side
          ) {
            resultPossibleFields.push(captureRightIndex);
          }
        }
        break;
      }
      case 'Castle': {
        resultPossibleFields.push(
          ...calculateVerticalFields(activePiece.indexFrom, 'plus'),
          ...calculateVerticalFields(activePiece.indexFrom, 'minus'),
        );
        resultPossibleFields.push(...calculateHorizontalFields(activePiece.indexFrom));
        break;
      }
      case 'Bishop': {
        resultPossibleFields.push(
          ...calculateDiagonalFields(activePiece.indexFrom, 'all-diagonals'),
        );
        break;
      }
      case 'Queen': {
        resultPossibleFields.push(
          ...calculateDiagonalFields(activePiece.indexFrom, 'all-diagonals'),
        );
        resultPossibleFields.push(
          ...calculateVerticalFields(activePiece.indexFrom, 'plus'),
          ...calculateVerticalFields(activePiece.indexFrom, 'minus'),
        );
        resultPossibleFields.push(...calculateHorizontalFields(activePiece.indexFrom));
        break;
      }
      case 'King': {
        resultPossibleFields.push(
          ...calculateVerticalFields(activePiece.indexFrom, 'plus', 1),
          ...calculateVerticalFields(activePiece.indexFrom, 'minus', 1),
        );
        resultPossibleFields.push(...calculateDiagonalFields(activePiece.indexFrom, 'one-around'));
        resultPossibleFields.push(...calculateHorizontalFields(activePiece.indexFrom, 1));
        break;
      }
      case 'Horse': {
        resultPossibleFields.push(...calculateHorseFields(activePiece.indexFrom));
        break;
      }
    }

    // Фильтрация результатов в зависимости от того, можно ли на них наступить
    const filteredFields = resultPossibleFields.filter((index) => {
      const piece = arrayOfPieces[index];
      if (piece?.props?.side) {
        if (piece.props.side === activePiece.side) {
          return false;
        } else {
          return true;
        }
      }
      return true;
    });

    return filteredFields;
  };

  const preventCheck = (activePiece, currentArray) => {
    let indexKing = currentArray.findIndex(
      (v) => v.props.data === 'King' && v.props.side === activePiece.side,
    );

    let enemyPieces = currentArray
      .map((figure, index) => {
        if (figure.props.data !== 'Empty' && figure.props?.side !== activePiece.side) {
          return {
            indexFrom: index,
            pieceData: figure.props.data,
            pieceJSX: figure,
            side: figure.props.side,
          };
        } else {
          return undefined;
        }
      })
      .filter((v) => v);

    let dangerousFigures = enemyPieces
      .map((enemyFigure) => {
        if (
          showActiveFields(enemyFigure, currentArray).filter((cage) => cage === indexKing).length >
          0
        ) {
          return enemyFigure;
        }
      })
      .filter((v) => v);
    return dangerousFigures;
  }; //предотвращение шаха

  const hideActiveFields = () => {
    setActiveFieldsToMove([]);
  };

  const closePiece = () => {
    hideActiveFields();
    setActivePiece(null);
  };

  const openPiece = (activePiece) => {
    if (activePiece.pieceData !== 'Empty') {
      setActivePiece(activePiece);
      setActiveFieldsToMove(showActiveFields(activePiece, arrayOfPieces));
    }
  };

  const handleDragEnd = (e) => {
    setHideField(false);
    if (indexToTranslate !== activePiece?.indexFrom) {
      translatePiece();
    }
  };

  const handleDrop = (e, data) => {
    e.preventDefault();
  };

  const handleDropOver = (e, index) => {
    e.preventDefault();
    if (index !== indexToTranslate) {
      setIndexToTranslate(index);
    }
  };

  const isKingInCheck = (board) => {
    const whiteKingPosition = board.findIndex(
      (piece) => piece.props.data === 'King' && piece.props.side === 'White',
    );
    const blackKingPosition = board.findIndex(
      (piece) => piece.props.data === 'King' && piece.props.side === 'Black',
    );

    const getPossibleMoves = (piece, index) => {
      return showActiveFields(
        { pieceData: piece.props.data, side: piece.props.side, indexFrom: index },
        board,
      );
    };

    const isWhiteKingInCheck = board
      .map((piece, index) => ({ piece, index }))
      .filter(({ piece }) => piece.props.side === 'Black' && piece.props.side !== undefined)
      .some(({ piece, index }) => {
        const possibleMoves = getPossibleMoves(piece, index);
        return possibleMoves.includes(whiteKingPosition);
      });

    if (isWhiteKingInCheck) return { side: 'White', index: whiteKingPosition };

    const isBlackKingInCheck = board
      .map((piece, index) => ({ piece, index }))
      .filter(({ piece }) => piece.props.side === 'White' && piece.props.side !== undefined)
      .some(({ piece, index }) => {
        const possibleMoves = getPossibleMoves(piece, index);
        return possibleMoves.includes(blackKingPosition);
      });

    if (isBlackKingInCheck) return { side: 'Black', index: blackKingPosition };

    return null;
  };

  const isCheckmate = (board, kingSide) => {
    const kingIndex = board.findIndex(
      (piece) => piece.props.data === 'King' && piece.props.side === kingSide,
    );

    const allPieces = board
      .map((piece, index) => ({ piece, index }))
      .filter(({ piece }) => piece.props.side === kingSide);

    for (let { piece, index } of allPieces) {
      const possibleMoves = showActiveFields(
        { pieceData: piece.props.data, side: piece.props.side, indexFrom: index },
        board,
      );

      for (let move of possibleMoves) {
        const newBoard = [...board];
        newBoard[index] = <div data={`Empty`} className="empty_square" />;
        newBoard[move] = piece;

        if (!isKingInCheck(newBoard, kingIndex)) {
          return { status: false };
        }
      }
    }

    return { status: true, side: kingSide };
  };

  const translatePiece = (handleClickIndex) => {
    const currentIndex = typeof handleClickIndex === 'number' ? handleClickIndex : indexToTranslate;
    if (
      typeof currentIndex === 'number' &&
      activePiece &&
      activeFieldsToMove.includes(currentIndex)
    ) {
      if (turn === activePiece?.side) {
        const changedArray = arrayOfPieces.map((piece, index) => {
          if (index === currentIndex) {
            // Проверяем, достигла ли пешка конца доски
            if (
              activePiece.pieceJSX.props.data === 'Pawn' &&
              ((activePiece.side === 'White' && currentIndex >= 56 && currentIndex <= 63) ||
                (activePiece.side === 'Black' && currentIndex >= 0 && currentIndex <= 7))
            ) {
              // Заменяем пешку на короля соответствующего цвета
              return activePiece.side === 'White' ? kingFigure.white : kingFigure.black;
            }
            return activePiece.pieceJSX; // Переместили выбранную фигуру
          }

          if (index === activePiece.indexFrom) {
            if (
              typeof arrayOfPieces[currentIndex].props?.side === 'string' &&
              arrayOfPieces[currentIndex].props?.side !== activePiece.side
            ) {
              return <div data={`Empty`} className="empty_square" />; // Удалили фигуру
            } else {
              return arrayOfPieces[currentIndex]; // Зачем то меняем местами
            }
          }

          return piece; // изменений не произошло
        });

        const checkSide = isKingInCheck(changedArray);

        if (preventCheck(activePiece, changedArray).length === 0) {
          setArrayOfPieces(changedArray);

          if (checkSide) {
            const mate = isCheckmate(changedArray, checkSide.side);
            if (mate.status) {
              dispatch(setGameState({ status: true, side: mate.side }));
            } else {
              dispatch(
                changeCheckState({ state: true, side: checkSide.side, index: checkSide.index }),
              );
            }
          } else {
            dispatch(changeCheckState({ state: false, side: undefined, index: undefined }));
          } //проверка на шах

          if (arrayOfPieces[currentIndex].props.data !== 'Empty') {
            dispatch(addDeletedFigures(arrayOfPieces[currentIndex].props));
          } // добавить удаленную фигуру

          if (turn === 'White') {
            setTurn('Black');
            dispatch(changeTurn('Black'));
          } else {
            setTurn('White');
            dispatch(changeTurn('White'));
          } // изменить информацию дополнительную информацию
        }
      }
    }

    closePiece();
    setIndexToTranslate(null);
  };

  const checkColorCage = (index) => {
    const changedIndex = ++index;
    if (Math.ceil(changedIndex / 8) % 2 === 0) {
      return changedIndex % 2 === 0 ? 'black' : 'white';
    } else {
      return changedIndex % 2 === 0 ? 'white' : 'black';
    }
  };

  const retryGame = () => {
    setArrayOfPieces(startFieldArray);
    dispatch(clearGame());
    setTestFlag(false);
  };

  return (
    <>
      {gameEnded.status ? (
        <ModalComponent
          closeModal={() => retryGame()}
          onRetry={() => retryGame()}
          message={`Победа ${gameEnded.side === 'White' ? 'Черных' : 'Белых'}`}
        />
      ) : null}
      {arrayOfPieces.map((cage, index) => (
        <div
          key={index}
          draggable={false}
          className={`chess_cage  ${checkColorCage(index)} ${
            activeFieldsToMove.includes(index) ? 'active_field' : null
          } ${checkState.index === index ? 'check' : null}    `}>
          {/* <div style={{ color: 'pink', pointerEvents: 'none' }}>{index}</div> */}
          <ChessPiece
            hideField={hideField}
            activeFieldsToMove={activeFieldsToMove}
            closePiece={closePiece}
            activePiece={activePiece}
            handleDropOver={handleDropOver}
            handleDrop={handleDrop}
            handleDragEnd={handleDragEnd}
            handleDragStart={handleDragStart}
            cage={cage}
            index={index}
            openPiece={openPiece}
            translatePiece={translatePiece}
            setIndexToTranslate={setIndexToTranslate}
          />
        </div>
      ))}
    </>
  );
};
