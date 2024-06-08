import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { DateSchema } from "yup";
const token = localStorage.getItem("tkn");
export const getAllwishlist = createAsyncThunk(
  "wishlist/getAllwishlist",
  async function (tkn = localStorage.getItem("tkn")) {
    console.log("REDUX : ", token);
    return await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
      headers: { token: tkn },
    });
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async function (data) {
    const [id, tkn] = data;
    const loadingToast = toast.loading("Loading", { position: "top-center" });

    return await axios
      .delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${id}`, {
        headers: { token: tkn },
      })
      .then((res) => {
        toast.remove(loadingToast);
        toast.success("Successfully removed", {
          position: "top-center",
          duration: 1000,
        });
        getAllwishlist(tkn);

        return res;
      })
      .catch(() => {
        toast.remove(loadingToast);

        toast.error("Error !", { position: "top-center", duration: 1000 });
      });
  }
);

export const addToWishList = createAsyncThunk(
  "wishlist/addToWishList",
  async function (data) {
    const [id, token] = data;
    const loadingToast = toast.loading("Loading", { position: "top-center" });
    return await axios
      .post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        {
          productId: id,
        },
        {
          headers: {
            token,
          },
        }
      )
      .then((res) => {
        toast.remove(loadingToast);
        toast.success("Successfully added to wishlist", {
          position: "top-center",
          duration: 1000,
        });
        return res;
      })
      .catch(() => {
        toast.remove(loadingToast);

        toast.error("Error !", { position: "top-center", duration: 1000 });
        // y.wishListIsLoading = false;
      });
  }
);

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishListIsLoading: false,
    wishlistproducts: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    // get all wishlist
    builder.addCase(getAllwishlist.pending, function (state) {
      state.isLoading = true;
    });
    builder.addCase(getAllwishlist.fulfilled, function (state, action) {
      state.wishlistproducts = action.payload.data.data;
      state.isLoading = false;
    });
    builder.addCase(getAllwishlist.rejected, function (state, action) {
      console.log("error", action.error);
      state.isLoading = false;
    });
    // Remove From wishlist

    builder.addCase(removeFromWishlist.fulfilled, function (state, action) {});
  },
});

export const wishlistReducer = wishlistSlice.reducer;
