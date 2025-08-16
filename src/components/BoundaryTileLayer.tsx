import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-boundary-canvas';

interface BoundaryTileLayerProps {
  boundaryData: any;
  url: string;
  attribution: string;
}

const BoundaryTileLayer = ({ boundaryData, url, attribution }: BoundaryTileLayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!boundaryData || !map) return;

    try {
      const boundaryCanvas = (L.TileLayer as any).boundaryCanvas(url, {
        boundary: boundaryData,
        attribution: attribution,
        trackAttribution: false
      });

      map.addLayer(boundaryCanvas);

      return () => {
        map.removeLayer(boundaryCanvas);
      };
    } catch (error) {
      console.warn('Boundary canvas failed, using standard tile layer:', error);
      
      const standardTileLayer = L.tileLayer(url, {
        attribution: attribution
      });
      
      map.addLayer(standardTileLayer);

      return () => {
        map.removeLayer(standardTileLayer);
      };
    }
  }, [map, boundaryData, url, attribution]);

  return null;
};

export default BoundaryTileLayer;