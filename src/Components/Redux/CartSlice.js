import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
const token = localStorage.getItem("tkn");

export const addToCart = createAsyncThunk("cart/addToCart", async (data) => {
  const [id, tkn] = data;
  const loadingToast = toast.loading("Loading", { position: "top-center" });
  return await axios
    .post(
      "https://ecommerce.routemisr.com/api/v1/cart",
      {
        productId: id,
      },
      {
        headers: {
          token: tkn,
        },
      }
    )
    .then((res) => {
      console.log("add to cart token", tkn);
      toast.remove(loadingToast);
      toast.success("Successfully added to cart", {
        position: "top-center",
        duration: 1000,
      });
      return res;
    })
    .catch((err) => {
      console.log("error ", err.response.data.message);
      toast.remove(loadingToast);
      toast.error("Error", {
        position: "top-center",
        duration: 1000,
      });
    });
});

export const getCart = createAsyncThunk(
  "cart/getCart",
  async function (tkn = localStorage.getItem("tkn")) {
    return await axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
      headers: { token: tkn },
    });
  }
);

export const removeCart = createAsyncThunk(
  "cart/removeCart",
  async function (tkn) {
    const loadingToast = toast.loading("loading", { position: "top-center" });
    return await axios
      .delete("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: { token: tkn },
      })
      .then(() => {
        toast.remove(loadingToast);
      });
  }
);

export const changeQuantityOfProdduct = createAsyncThunk(
  "cart/changeQuantityOfProduct",
  async (idAndCount) => {
    const [id, count, number, tkn] = idAndCount;
    const loadingToast = toast.loading("loading", { position: "top-center" });
    return await axios
      .put(
        `https://ecommerce.routemisr.com/api/v1/cart/${id}`,
        {
          count: count + number,
        },
        {
          headers: { token: tkn },
        }
      )
      .then((res) => {
        toast.remove(loadingToast);
        return res;
      })
      .catch((err) => {
        toast.remove(loadingToast);
      });
  }
);

export const removeProduct = createAsyncThunk(
  "cart/removeProduct",
  async (data) => {
    const [id, tkn] = data;
    const loadingToast = toast.loading("loading", { position: "top-center" });
    return await axios
      .delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {
        headers: { token: tkn },
      })
      .then(() => {
        toast.remove(loadingToast);
        toast.success("Successfully Changed", {
          position: "top-center",
          duration: 1500,
        });
        getCart();
      });
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartProducts: null,
    totalPrice: null,
    cartItems: null,
    isLoading: false,
    isError: false,
    cartId: null,
    cartOwner: null,
  },
  reducers: {
    setCartItems: (x, action) => {
      x.cartItems = action;
    },
  },
  extraReducers: (builder) => {
    // Bulider for addToCart
    builder.addCase(addToCart.pending, (state) => {
      state.isError = false;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isError = false;
      state.cartItems = action.payload?.data.numOfCartItems;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isError = true;
    });
    // Builder for getCart
    builder.addCase(getCart.pending, (state) => {
      state.isError = false;

      state.isLoading = true;
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.cartProducts = action.payload?.data.data.products;
      state.totalPrice = action.payload?.data.data.totalCartPrice;
      state.cartItems = action.payload?.data.numOfCartItems;
      state.cartId = action.payload?.data.data._id;
      state.cartOwner = action.payload.data.data.cartOwner;
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(getCart.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });
    // Builder for increase quantity of products
    builder.addCase(changeQuantityOfProdduct.pending, (state) => {
      state.isError = false;
    });
    builder.addCase(changeQuantityOfProdduct.fulfilled, (state, action) => {
      state.cartProducts = action.payload?.data.data.products;
      state.totalPrice = action.payload?.data.data.totalCartPrice;
      state.cartItems = action.payload?.data.numOfCartItems;
      state.isError = false;
    });
    builder.addCase(changeQuantityOfProdduct.rejected, (state, action) => {
      // state.isError = true;
      state.isError = true;
    });
    // Builder for delete product from cart
    builder.addCase(removeProduct.pending, (state) => {
      state.isError = false;
    });
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      state.isError = false;
    });
    builder.addCase(removeProduct.rejected, (state, action) => {
      state.isError = true;
    });
    // Builder for delete cart
    builder.addCase(removeCart.pending, (state) => {
      state.isError = false;
    });
    builder.addCase(removeCart.fulfilled, (state, action) => {
      state.isError = false;

      state.cartProducts = null;
      state.totalPrice = 0;
      state.cartItems = action.payload?.data.numOfCartItems;
    });
    builder.addCase(removeCart.rejected, (state, action) => {
      state.isError = true;
    });
  },
});
export const { setCartItems } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
