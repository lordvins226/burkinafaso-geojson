import type { BurkinaFeature, BurkinaFeatureCollection } from '../types/geojson';

export const calculatePolygonArea = (coordinates: number[][]): number => {
  const lngs = coordinates.map(coord => coord[0]);
  const lats = coordinates.map(coord => coord[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  return (maxLng - minLng) * (maxLat - minLat);
};

export const simplifyPolygon = (coordinates: number[][], tolerance: number = 0.001): number[][] => {
  if (coordinates.length <= 100) return coordinates;
  
  const douglasPeucker = (points: number[][], epsilon: number): number[][] => {
    if (points.length <= 2) return points;
    
    let dmax = 0;
    let index = 0;
    const start = points[0];
    const end = points[points.length - 1];
    
    for (let i = 1; i < points.length - 1; i++) {
      const d = perpendicularDistance(points[i], start, end);
      if (d > dmax) {
        index = i;
        dmax = d;
      }
    }
    
    if (dmax > epsilon) {
      const recResults1 = douglasPeucker(points.slice(0, index + 1), epsilon);
      const recResults2 = douglasPeucker(points.slice(index), epsilon);
      
      return [...recResults1.slice(0, -1), ...recResults2];
    } else {
      return [start, end];
    }
  };
  
  const simplified = douglasPeucker(coordinates, tolerance);
  
  if (simplified[0][0] !== simplified[simplified.length - 1][0] || 
      simplified[0][1] !== simplified[simplified.length - 1][1]) {
    simplified.push(simplified[0]);
  }
  
  return simplified;
};

const perpendicularDistance = (point: number[], lineStart: number[], lineEnd: number[]): number => {
  const [x0, y0] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;
  
  const A = x0 - x1;
  const B = y0 - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) return Math.sqrt(A * A + B * B);
  
  const param = dot / lenSq;
  
  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  
  const dx = x0 - xx;
  const dy = y0 - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

export const processGeoData = (geoData: BurkinaFeatureCollection, selectedLayer: string): BurkinaFeatureCollection => {
  const processedFeatures = geoData.features.map(feature => {
    const coordinates = feature.geometry.coordinates[0];
    const pointCount = coordinates.length;
    const area = calculatePolygonArea(coordinates);
    
    let processedCoordinates = coordinates;
    
    if (selectedLayer === 'provinces' && pointCount > 1500) {
      processedCoordinates = simplifyPolygon(coordinates, 0.001);
    } else if (selectedLayer === 'communes' && pointCount > 800) {
      processedCoordinates = simplifyPolygon(coordinates, 0.0005);
    }
    
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: [processedCoordinates]
      },
      properties: {
        ...feature.properties,
        _area: area,
        _originalPointCount: pointCount,
        _simplifiedPointCount: processedCoordinates.length
      }
    };
  });
  
  return {
    ...geoData,
    features: processedFeatures
  };
};

export const isSmallCommune = (feature: BurkinaFeature): boolean => {
  const area = (feature.properties as any)._area;
  return area !== undefined && area < 0.05;
};