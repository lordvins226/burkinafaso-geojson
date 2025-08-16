import type { BurkinaFeature, LayerType } from '../types/geojson';

export const getFeatureName = (feature: BurkinaFeature, layer: LayerType): string => {
  const { properties } = feature;
  
  switch (layer) {
    case 'regions':
      return properties.admin1Name || properties.NAME_1 || 'Sans nom';
    case 'provinces':
      return properties.NAME_2 || properties.admin1Name || 'Sans nom';
    case 'communes':
      return properties.NAME_3 || properties.admin1Name || 'Sans nom';
    default:
      return 'Sans nom';
  }
};

export const getFeatureCode = (feature: BurkinaFeature, layer: LayerType): string => {
  const { properties } = feature;
  
  switch (layer) {
    case 'regions':
      return properties.admin1Pcod || properties.GID_1 || '';
    case 'provinces':
      return properties.GID_2 || properties.admin1Pcod || '';
    case 'communes':
      return properties.GID_3 || properties.admin1Pcod || '';
    default:
      return '';
  }
};

export const getParentName = (feature: BurkinaFeature, layer: LayerType): string => {
  const { properties } = feature;
  
  switch (layer) {
    case 'regions':
      return properties.admin0Name || properties.COUNTRY || 'Burkina Faso';
    case 'provinces':
      return properties.NAME_1 || properties.admin1Name || '';
    case 'communes':
      return properties.NAME_2 || '';
    default:
      return '';
  }
};