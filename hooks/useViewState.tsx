import create from "zustand";
import { FlyToInterpolator } from "deck.gl";

const jumpSetting = {
  transitionDuration: "auto",
  transitionInterpolator: new FlyToInterpolator(),
  transitionEasing: (x) =>
    x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2, //easeInOutQuad
};

const defaultViewState = {
  longitude: 139.7673068,
  latitude: 35.6809591,
  bearing: 0,
  zoom: 15,
  minZoom: 0, //遠景
  maxZoom: 17.499, //近景 地理院地図（ラスター）は17.5未満が最大
  maxPitch: 85,
};

const useViewState = create((set) => ({
  ...defaultViewState,
  ...jumpSetting,

  setViewState: (newViewState) =>
    set((viewState) => ({
      ...viewState,
      ...newViewState,
    })),
  jump: (position) =>
    set((viewState) => ({
      ...viewState,
      longitude: position[0],
      latitude: position[1],
    })),
}));

export default useViewState;
