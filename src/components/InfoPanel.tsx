import type { BurkinaFeature } from '../types/geojson';
import { getFeatureName, getFeatureCode, getParentName } from '../utils/dataUtils';

interface InfoPanelProps {
  feature: BurkinaFeature | null;
  onClose: () => void;
  selectedLayer?: 'regions' | 'provinces' | 'communes';
}

const InfoPanel = ({ feature, onClose, selectedLayer = 'regions' }: InfoPanelProps) => {
  if (!feature) return null;

  const { properties } = feature;

  return (
    <div className="absolute bottom-4 left-4 right-4 md:right-auto z-[1000] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-sm mx-auto md:mx-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {getFeatureName(feature, selectedLayer)}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{getParentName(feature, selectedLayer)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-600 font-medium">Code administratif</span>
            <span className="text-sm font-bold text-burkina-green">{getFeatureCode(feature, selectedLayer)}</span>
          </div>
          
          {properties.Shape_Area && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600 font-medium">Surface</span>
              <span className="text-sm font-bold text-gray-800">{properties.Shape_Area.toFixed(3)} km²</span>
            </div>
          )}
          
          {properties.validOn && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600 font-medium">Date validation</span>
              <span className="text-sm font-bold text-gray-800">
                {new Date(properties.validOn).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-burkina-green to-green-600 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Identifiant: {feature.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;