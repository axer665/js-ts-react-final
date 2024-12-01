import {fetchCategories} from '../asyncThunkCreator'
import {createReducer, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { ICategory, ICategoryState } from './interfaces';
import { TRootState } from '../../store';

const initialState: ICategoryState = {
  categories: [],
  selected: { id: 0 },
  error: null,
  isLoading: false,
}

createReducer(initialState, (builder) => {
  builder.addCase(fetchCategories.pending.type, () => {})
      .addCase(fetchCategories.fulfilled.type, () => {})
      .addCase(fetchCategories.rejected.type, () => {})
});

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelected(state: ICategoryState, action: PayloadAction<number>) {
      state.selected.id = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending.type, (
        state: ICategoryState
    ) => {
      state.isLoading = true;
      state.error = null;
      state.categories = [];
    })
        .addCase(fetchCategories.fulfilled.type, (
            state: ICategoryState,
            action: PayloadAction<ICategory[]>
        ) => {
          state.isLoading = false;
          state.error = null;
          state.categories = [{ id: 0, title: 'Все' }, ...action.payload];
        })
        .addCase(fetchCategories.rejected.type, (
            state: ICategoryState,
            action
        ) => {
          state.categories = [];
          state.isLoading = false;
          state.error = action.error;
        })
  }
});

export const selectCategories = (state: TRootState) => state.categories.categories;
export const selectCategoriesError = (state: TRootState) => state.categories.error;
export const selectCategoriesLoading = (state: TRootState) => state.categories.isLoading;
export const selectCategoriesSelected = (state: TRootState) => state.categories.selected;
export const { setSelected } = categorySlice.actions
export const categoryReducer = categorySlice.reducer;
