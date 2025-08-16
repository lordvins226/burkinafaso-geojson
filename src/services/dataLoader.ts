import type {BurkinaFeatureCollection, LayerType} from '../types/geojson';

export const loadGeoJsonData = async (layer: LayerType): Promise<BurkinaFeatureCollection> => {
  const response = await fetch(`/geojson/${layer}.geojson`);
  if (!response.ok) {
    throw new Error(`Failed to load ${layer} data`);
  }
  return response.json();
};