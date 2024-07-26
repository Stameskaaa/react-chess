import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  turn: 'White',
  deletedFigures: [],
  checkState: { state: false, side: undefined, index: undefined },
  gameEnded: { status: false, side: undefined },
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    changeTurn: (state, actions) => {
      state.turn = actions.payload;
    },
    addDeletedFigures: (state, actions) => {
      state.deletedFigures = [...state.deletedFigures, actions.payload];
    },
    changeCheckState: (state, actions) => {
      state.checkState = actions.payload;
    },
    setGameState: (state, actions) => {
      state.gameEnded = actions.payload;
    },
    clearGame: () => initialState,
  },
});

export const { changeTurn, addDeletedFigures, changeCheckState, setGameState, clearGame } =
  gameSlice.actions;

export default gameSlice.reducer;
