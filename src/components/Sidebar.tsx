import { useState, useEffect, useMemo } from 'react';
import type { BurkinaFeatureCollection, BurkinaFeature, LayerType } from '../types/geojson';
import { loadGeoJsonData } from '../services/dataLoader';
import { getFeatureName, getFeatureCode } from '../utils/dataUtils';

interface SidebarProps {
  selectedLayer: LayerType;
  onFeatureSelect: (feature: BurkinaFeature) => void;
  selectedFeature: BurkinaFeature | null;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const Sidebar = ({ selectedLayer, onFeatureSelect, selectedFeature, isOpen: externalIsOpen, onClose, onOpen }: SidebarProps) => {
  const [geoData, setGeoData] = useState<BurkinaFeatureCollection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const handleClose = onClose || (() => setInternalIsOpen(false));
  const handleOpen = () => setInternalIsOpen(true);

  const downloadGeoJSON = () => {
    if (!geoData) return;
    
    const originalData = {
      type: 'FeatureCollection',
      features: geoData.features.map(feature => ({
        type: feature.type,
        id: feature.id,
        geometry: feature.geometry,
        properties: {
          ...feature.properties,
          _area: undefined,
          _originalPointCount: undefined,
          _simplifiedPointCount: undefined
        }
      }))
    };
    
    const dataStr = JSON.stringify(originalData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `burkina-faso-${selectedLayer}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setLoading(true);
    loadGeoJsonData(selectedLayer)
      .then(data => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, [selectedLayer]);

  const filteredFeatures = useMemo(() => {
    if (!geoData) return [];
    return geoData.features.filter(feature => {
      const name = getFeatureName(feature, selectedLayer);
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [geoData, searchTerm, selectedLayer]);

  const getLayerLabel = () => {
    switch(selectedLayer) {
      case 'regions': return 'Régions';
      case 'provinces': return 'Provinces';
      case 'communes': return 'Communes';
    }
  };

  const getLayerIcon = () => {
    switch(selectedLayer) {
      case 'regions': return 'R';
      case 'provinces': return 'P';
      case 'communes': return 'C';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          if (onOpen) {
            onOpen();
          } else {
            handleOpen();
          }
        }}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-[1000] bg-white shadow-xl rounded-r-xl p-3 hover:bg-gray-50 transition-all hover:pl-4 group hidden md:block"
      >
        <svg className="w-5 h-5 text-gray-600 group-hover:text-burkina-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[999] md:hidden"
          onClick={handleClose}
        />
      )}
      <div className={`h-full bg-white shadow-2xl flex flex-col relative z-[1000] transition-transform duration-300 md:relative md:translate-x-0 md:w-80 ${
        isOpen 
          ? 'fixed inset-y-0 left-0 w-80 translate-x-0' 
          : 'fixed inset-y-0 left-0 w-80 -translate-x-full md:translate-x-0'
      }`}>
      <div className="bg-gradient-to-br from-burkina-green to-green-700 text-white p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">🇧🇫</span>
              Burkina Faso
            </h1>
            <p className="text-green-100 text-sm mt-1">Carte Administrative Interactive</p>
          </div>
          <button
            onClick={handleClose}
            className="text-green-100 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-lg font-medium bg-white/10 rounded-lg px-3 py-2">
          <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">{getLayerIcon()}</span>
          <span>{getLayerLabel()}</span>
          <span className="ml-auto bg-white/20 px-2 py-0.5 rounded text-sm">
            {geoData?.features.length || 0}
          </span>
        </div>
        
        
        <button
          onClick={() => downloadGeoJSON()}
          className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Télécharger .geojson
        </button>
      </div>

      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="relative">
          <input
            type="text"
            placeholder={`Rechercher dans les ${getLayerLabel().toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burkina-green/50 focus:border-burkina-green transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="animate-spin w-10 h-10 border-4 border-burkina-green/30 border-t-burkina-green rounded-full"></div>
            <p className="text-gray-500 mt-4">Chargement...</p>
          </div>
        ) : filteredFeatures.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-center">Aucun résultat pour<br/>"{searchTerm}"</p>
          </div>
        ) : (
          <div className="p-3 space-y-1">
            {filteredFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() => onFeatureSelect(feature)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                  selectedFeature?.id === feature.id
                    ? 'bg-gradient-to-r from-burkina-green to-green-600 text-white shadow-lg scale-[1.02]'
                    : 'hover:bg-gray-50 hover:shadow-md text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{getFeatureName(feature, selectedLayer)}</div>
                    <div className="text-xs opacity-60 mt-0.5">Code: {getFeatureCode(feature, selectedLayer)}</div>
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${selectedFeature?.id === feature.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {searchTerm && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            {filteredFeatures.length} résultat{filteredFeatures.length > 1 ? 's' : ''} trouvé{filteredFeatures.length > 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Sidebar;