import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-boundary-canvas';
import type { BurkinaFeatureCollection, BurkinaFeature, LayerType } from '../types/geojson';
import { loadGeoJsonData } from '../services/dataLoader';
import { processGeoData, isSmallCommune } from '../utils/geometryUtils';
import { getFeatureName } from '../utils/dataUtils';
import BoundaryTileLayer from './BoundaryTileLayer';
import L from 'leaflet';

interface MapProps {
  selectedLayer: LayerType;
  onFeatureClick: (feature: BurkinaFeature) => void;
  selectedFeature: BurkinaFeature | null;
}

const MapBounds = ({ geoData }: { geoData: BurkinaFeatureCollection | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (geoData && geoData.features.length > 0) {
      const geoJsonLayer = L.geoJSON(geoData);
      const bounds = geoJsonLayer.getBounds();
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 7 });
    }
  }, [geoData, map]);
  
  return null;
};

const Map = ({ selectedLayer, onFeatureClick, selectedFeature }: MapProps) => {
  const [geoData, setGeoData] = useState<BurkinaFeatureCollection | null>(null);
  const [originalData, setOriginalData] = useState<BurkinaFeatureCollection | null>(null);
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(6.5);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const loadData = async () => {
      try {
        const data = await loadGeoJsonData(selectedLayer);
        setOriginalData(data);
        const processed = processGeoData(data, selectedLayer);
        setGeoData(processed);
        
        if (!boundaryData) {
          const regionsData = await loadGeoJsonData('regions');
          setBoundaryData(regionsData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedLayer, boundaryData]);

  const style = (feature?: BurkinaFeature) => {
    const baseStyle = {
      fillColor: '#009639',
      weight: 0.2,
      opacity: 1,
      color: '#003311',
      fillOpacity: 0.6,
      smoothFactor: 1.5
    };

    if (selectedLayer === 'communes' && feature && isSmallCommune(feature)) {
      return {
        ...baseStyle,
        weight: 0,
        fillOpacity: 0.8,
        radius: 3
      };
    }

    switch(selectedLayer) {
      case 'regions':
        return { ...baseStyle, weight: 0.8, fillOpacity: 0.5, color: '#005522' };
      case 'provinces':
        return { ...baseStyle, weight: 0.4, color: '#003311', smoothFactor: 2 };
      case 'communes':
        return { ...baseStyle, weight: 0.2, fillOpacity: 0.7, color: '#002211' };
      default:
        return baseStyle;
    }
  };

  const highlightFeature = (e: L.LeafletMouseEvent) => {
    const layer = e.target;
    layer.setStyle({
      weight: 3,
      color: '#FCD116',
      fillOpacity: 0.6
    });
    layer.bringToFront();
  };

  const resetHighlight = (e: L.LeafletMouseEvent) => {
    const layer = e.target;
    layer.setStyle(style());
  };

  const onEachFeature = (feature: BurkinaFeature, layer: L.Layer) => {
    const featureName = getFeatureName(feature, selectedLayer);
    
    layer.bindTooltip(featureName, {
      permanent: false,
      direction: 'auto',
      className: 'custom-tooltip',
      offset: [0, -10]
    });
    
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: () => onFeatureClick(feature)
    });
  };

  const pointToLayer = (feature: BurkinaFeature, latlng: L.LatLng) => {
    if (selectedLayer === 'communes' && isSmallCommune(feature) && currentZoom < 8) {
      const marker = L.circleMarker(latlng, {
        radius: 4,
        fillColor: '#009639',
        color: '#003311',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
      
      const featureName = getFeatureName(feature, selectedLayer);
      marker.bindTooltip(featureName, {
        permanent: false,
        direction: 'auto',
        className: 'custom-tooltip',
        offset: [0, -10]
      });
      
      marker.on('click', () => onFeatureClick(feature));
      
      return marker;
    }
    return null;
  };

  useEffect(() => {
    if (geoJsonRef.current && selectedFeature) {
      geoJsonRef.current.eachLayer((layer: any) => {
        if (layer.feature.id === selectedFeature.id) {
          layer.setStyle({
            weight: 3,
            color: '#FCD116',
            fillOpacity: 0.6
          });
        } else {
          layer.setStyle(style());
        }
      });
    }
  }, [selectedFeature]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80">
          <div className="animate-spin w-8 h-8 border-4 border-burkina-green border-t-transparent rounded-full"></div>
        </div>
      )}
      <MapContainer
        center={[12.2383, -1.5616]}
        zoom={selectedLayer === 'communes' ? 7.5 : 6.5}
        className="w-full h-full"
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        minZoom={selectedLayer === 'communes' ? 7 : 6}
        maxZoom={selectedLayer === 'regions' ? 8 : 10}
        maxBounds={[[8.5, -6.5], [15.5, 3.0]]}
        maxBoundsViscosity={1.0}
        preferCanvas={true}
        whenReady={(map) => {
          map.target.on('zoomend', () => {
            setCurrentZoom(map.target.getZoom());
          });
        }}
      >
        {boundaryData ? (
          <BoundaryTileLayer
            boundaryData={boundaryData}
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          />
        )}
        {geoData && (
          <>
            <MapBounds geoData={geoData} />
            <GeoJSON
              ref={geoJsonRef as any}
              key={`${selectedLayer}-${currentZoom}`}
              data={geoData}
              style={style}
              onEachFeature={onEachFeature}
              pointToLayer={pointToLayer}
              renderer={L.canvas()}
              filter={(feature) => {
                if (selectedLayer === 'communes' && isSmallCommune(feature) && currentZoom < 8) {
                  return false;
                }
                return true;
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;