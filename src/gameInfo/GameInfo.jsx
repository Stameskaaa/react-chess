import './gameinfo.css';
import { useSelector } from 'react-redux';
import {
  FaChessRook,
  FaChessPawn,
  FaChessQueen,
  FaChessBishop,
  FaChessKnight,
} from 'react-icons/fa';
export const GameInfo = () => {
  const { turn, deletedFigures, checkState } = useSelector((state) => state.game);
  const getFigureComponent = (figure, side, index) => {
    const figureClass = side === 'White' ? 'mini_chess white' : 'mini_chess black';

    const figureComponents = {
      Castle: <FaChessRook data="Castle" key={index} side={side} className={figureClass} />,
      Horse: <FaChessKnight data="Horse" key={index} side={side} className={figureClass} />,
      Bishop: <FaChessBishop data="Bishop" key={index} side={side} className={figureClass} />,
      Queen: <FaChessQueen data="Queen" key={index} side={side} className={figureClass} />,
      Pawn: <FaChessPawn data="Pawn" key={index} side={side} className={figureClass} />,
    };

    return figureComponents[figure];
  };

  return (
    <>
      {deletedFigures.length > 0 ? (
        <div className="container_deleted_chess">
          {deletedFigures
            .toSorted((a, b) => {
              if (a.side === 'White' && b.side !== 'White') {
                return -1;
              } else if (a.side !== 'White' && b.side === 'White') {
                return 1;
              } else {
                return 0;
              }
            })
            .map((v, index) => {
              return getFigureComponent(v.data, v.side, index);
            })}
        </div>
      ) : null}
      <div className="container_turn">{turn === 'White' ? 'Ход белых' : 'Ход черных'}</div>
      {/* {checkState.state && (
        <div style={{ color: 'white' }}>Шах {checkState.side === 'Black' ? 'Черным' : 'Белым'}</div>
      )} */}
    </>
  );
};
