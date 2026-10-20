import { configureStore } from "@reduxjs/toolkit";

// Veri Modeli
export interface Yazi {
  id: number;
  baslik: string;
  yazar: string;
  yorum_sayisi: number;
  puan: number;
  url: string;
}

export interface StateYapisi {
  data: Yazi[];
  isLoading: boolean;
  isError: boolean;
}

const baslangicDurumu: StateYapisi = {
  data: [
    {
      id: 1,
      baslik: "Web Teknolojileri ve Programlama",
      yazar: "Asım Sinan Yüksel",
      yorum_sayisi: 5,
      puan: 5,
      url: "https://sdu.edu.tr",
    },
    {
      id: 2,
      baslik: "React ile Modern Web",
      yazar: "Sinan Yüksel",
      yorum_sayisi: 12,
      puan: 4.8,
      url: "https://react.dev",
    },
  ],
  isLoading: false,
  isError: false,
};

// Slayt 84 ve 105: Reducer Tanımı
export const yazilarReducer = (state = baslangicDurumu, action: any): StateYapisi => {
  switch (action.type) {
    case "POSTS_FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "POSTS_FETCH_SUCCESS":
      return { ...state, isLoading: false, isError: false, data: action.payload };
    case "POSTS_FETCH_FAILURE":
      return { ...state, isLoading: false, isError: true };
    case "REMOVE_POST":
      return {
        ...state,
        data: state.data.filter((yazi) => action.payload.id !== yazi.id),
      };
    default:
      return state;
  }
};

// Slayt 105: configureStore ile store'u dışa aktarıyoruz
export const store = configureStore({
  reducer: yazilarReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;