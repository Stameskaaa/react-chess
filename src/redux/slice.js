import { createSlice } from '@reduxjs/toolkit';

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    turn: 'White',
    deletedFigures: [],
    checkState: { state: false, side: undefined },
    gameEnded: false,
  },
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
  },
});

export const { changeTurn, addDeletedFigures, changeCheckState, setGameState } = gameSlice.actions;

export default gameSlice.reducer;
