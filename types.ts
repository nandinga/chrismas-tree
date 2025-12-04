export interface TreeConfig {
  particleCount: number;
  particleSize: number;
  treeHeight: number;
  baseRadius: number;
  spinSpeed: number;
}

export interface TreeState {
  imageColors: Float32Array | null;
  useImage: boolean;
}