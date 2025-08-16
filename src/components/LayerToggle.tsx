import type { LayerType } from '../types/geojson';

interface LayerToggleProps {
  selectedLayer: LayerType;
  onLayerChange: (layer: LayerType) => void;
}

const LayerToggle = ({ selectedLayer, onLayerChange }: LayerToggleProps) => {
  const layers: { value: LayerType; label: string; icon: string }[] = [
    { value: 'regions', label: 'Régions', icon: 'R' },
    { value: 'provinces', label: 'Provinces', icon: 'P' },
    { value: 'communes', label: 'Communes', icon: 'C' }
  ];

  return (
    <div className="fixed top-16 right-4 md:absolute md:top-4 z-[1000]">
      <div className="bg-white rounded-2xl shadow-xl p-1 flex flex-col md:flex-row gap-1">
        {layers.map((layer) => (
          <button
            key={layer.value}
            onClick={() => onLayerChange(layer.value)}
            className={`px-3 py-3 md:px-4 md:py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium min-w-[120px] md:min-w-0 ${
              selectedLayer === layer.value
                ? 'bg-gradient-to-r from-burkina-green to-green-600 text-white shadow-lg'
                : 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200'
            }`}
          >
            <span className={`w-6 h-6 md:w-5 md:h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              selectedLayer === layer.value ? 'bg-white/20' : 'bg-gray-200'
            }`}>{layer.icon}</span>
            <span className="text-base md:text-sm">{layer.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayerToggle;