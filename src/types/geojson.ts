export interface BurkinaFeatureProperties {
  OBJECTID?: number;
  admin0Name?: string;
  admin1Name?: string;
  admin1Pcod?: string;
  admin0Pcod?: string;
  date?: string;
  validOn?: string;
  validTo?: string;
  Shape_Leng?: number;
  Shape_Area?: number;
  
  FID?: number;
  GID_0?: string;
  GID_1?: string;
  GID_2?: string;
  GID_3?: string;
  COUNTRY?: string;
  NAME_1?: string;
  NAME_2?: string;
  NAME_3?: string;
  NL_NAME_1?: string;
  NL_NAME_2?: string;
  NL_NAME_3?: string;
  TYPE_3?: string;
  ENGTYPE_3?: string;
  HASC_3?: string;
}

export interface BurkinaFeature {
  type: 'Feature';
  id: number;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  properties: BurkinaFeatureProperties;
}

export interface BurkinaFeatureCollection {
  type: 'FeatureCollection';
  features: BurkinaFeature[];
}

export type LayerType = 'regions' | 'provinces' | 'communes';