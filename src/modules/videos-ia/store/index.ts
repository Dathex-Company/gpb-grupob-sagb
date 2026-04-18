import { VideoPromptAsset, VideoRecipe } from '../types';

export interface VideosIaStoreSnapshot {
  promptAssets: VideoPromptAsset[];
  recipes: VideoRecipe[];
  selectedProvider: 'gemini-veo' | 'sora' | 'kling';
}

const initialSnapshot: VideosIaStoreSnapshot = {
  promptAssets: [],
  recipes: [],
  selectedProvider: 'gemini-veo'
};

let inMemorySnapshot: VideosIaStoreSnapshot = initialSnapshot;

export const getVideosIaSnapshot = (): VideosIaStoreSnapshot => inMemorySnapshot;

export const setVideosIaSnapshot = (snapshot: VideosIaStoreSnapshot) => {
  inMemorySnapshot = snapshot;
};
