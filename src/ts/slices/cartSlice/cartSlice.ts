import {createReducer, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { TRootState } from '../../store';
import { ICartItem, ICartState } from './interfaces';
import {fetchOrder} from '../asyncThunkCreator/index'
import {IProductPageState} from "../productPageSlice/interfaces.ts";

const initCartStateData = (): ICartState => {
  return localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart') as string)
    : { items: [] }
}

const initialState: ICartState = {
  items: initCartStateData().items,
  loading: false,
  error: null,
  orderState: false,
}

createReducer(initialState, (builder) => {
  builder.addCase(fetchOrder.pending.type, () => {})
      .addCase(fetchOrder.fulfilled.type, () => {})
      .addCase(fetchOrder.rejected.type, () => {})
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart(state: ICartState, action: PayloadAction<ICartItem>) {
      const index = state.items.findIndex(
        (el) => el.id === action.payload.id && el.size === action.payload.size
      )
      if (index !== -1) {
        state.items[index].quantity += action.payload.quantity;
        state.items[index].total += action.payload.total;
      } else {
        state.items = [...state.items, action.payload];
      }
    },
    removeProductFromCart(state: ICartState, action: PayloadAction<number>) {
      state.items.splice(action.payload, 1);
    },
    resetOrder(state: ICartState) {
      state.orderState = false;
    },
    updateCart(state: ICartState) {
      return state;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrder.pending.type, (state: IProductPageState) => {
      state.isLoading = true;
      state.error = null;
      state.item = null;
    })
    builder.addCase(fetchOrder.fulfilled.type, (
        state: ICartState,
        action: PayloadAction<number>
    ) => {
      if (action.payload === 204) {
        state.loading = false;
        state.items = [];
        state.orderState = true;
      }
    })
    builder.addCase(fetchOrder.rejected.type, (
        state: ICartState,
        action
    ) => {
      state.error = action.error;
      state.loading = false;
      state.orderState = false;
    })
  }
});

export const { addProductToCart, removeProductFromCart, updateCart, resetOrder } = cartSlice.actions;
export const selectCartItems = (state: TRootState) => state.cart.items;
export const selectOrederState = (state: TRootState) => state.cart.orderState;
export const selectOrderLoading = (state: TRootState) => state.cart.loading;
export const selectOrderError = (state: TRootState) => state.cart.error;
export const cartReducer = cartSlice.reducer;
