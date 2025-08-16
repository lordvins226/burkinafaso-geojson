import { useState } from 'react';
import Map from './components/Map';
import LayerToggle from './components/LayerToggle';
import InfoPanel from './components/InfoPanel';
import Sidebar from './components/Sidebar';
import type { BurkinaFeature, LayerType } from './types/geojson';

function App() {
  const [selectedLayer, setSelectedLayer] = useState<LayerType>('regions');
  const [selectedFeature, setSelectedFeature] = useState<BurkinaFeature | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLayerChange = (layer: LayerType) => {
    setSelectedLayer(layer);
    setSelectedFeature(null);
  };

  return (
    <div className="w-screen h-screen flex bg-gray-100 overflow-hidden">
      <Sidebar 
        selectedLayer={selectedLayer}
        onFeatureSelect={setSelectedFeature}
        selectedFeature={selectedFeature}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpen={() => setSidebarOpen(true)}
      />
      
      <div className="flex-1 relative bg-gradient-to-br from-gray-50 to-gray-100 md:ml-0">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-[1000] md:hidden bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-all"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <Map 
          selectedLayer={selectedLayer}
          onFeatureClick={setSelectedFeature}
          selectedFeature={selectedFeature}
        />
        
        <LayerToggle 
          selectedLayer={selectedLayer}
          onLayerChange={handleLayerChange}
        />
        
        <InfoPanel 
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
          selectedLayer={selectedLayer}
        />
      </div>
    </div>
  );
}

export default App;