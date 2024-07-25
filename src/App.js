import './App.css';
import { ChessBoard } from './chessBoard/ChessBoard';
import { GameInfo } from './gameInfo/GameInfo';

function App() {
  return (
    <div className="App">
      <GameInfo />
      <ChessBoard />
    </div>
  );
}

export default App;
