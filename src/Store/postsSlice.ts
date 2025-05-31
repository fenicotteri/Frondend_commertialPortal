import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../types';

interface PostsState {
  allPosts: Post[];
  favouriteIds: number[];
}

const initialState: PostsState = {
  allPosts: [],
  favouriteIds: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.allPosts = action.payload;
    },
    setFavourites(state, action: PayloadAction<number[]>) {
      state.favouriteIds = action.payload;
    },
    toggleFavourite(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.favouriteIds.includes(id)) {
        state.favouriteIds = state.favouriteIds.filter(favId => favId !== id);
      } else {
        state.favouriteIds.push(id);
      }
    },
  },
});

export const { setPosts, setFavourites, toggleFavourite } = postsSlice.actions;
export default postsSlice.reducer;
