# Burkina Faso Administrative Map

Interactive web application for visualizing administrative boundaries of Burkina Faso. Built with React, TypeScript, Tailwind CSS, and Leaflet.

## Features

- **Interactive Map**: Explore 13 regions, 45 provinces, and 351 communes
- **Hover Tooltips**: View entity names on mouseover
- **Responsive Design**: Mobile-optimized with drawer navigation
- **Search Functionality**: Find specific regions, provinces, or communes
- **Data Export**: Download GeoJSON files for each administrative level
- **Boundary Restriction**: Map display limited to Burkina Faso territory only

## Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Mapping**: Leaflet + react-leaflet
- **Build Tool**: Vite
- **Territory Restriction**: leaflet-boundary-canvas

## Data Processing

- **Geometry Simplification**: Douglas-Peucker algorithm for complex polygons (>1500 points)
- **Adaptive Rendering**: Small communes display as points at low zoom levels
- **Performance Optimization**: Canvas renderer for numerous polygons

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd burkinafaso-geojson
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### Build for Production

```bash
npm run build
npm run preview
```

## Data Structure

The application uses three administrative levels:

- **Regions (13)**: Highest administrative division
- **Provinces (45)**: Secondary administrative division  
- **Communes (351)**: Local administrative division

All data is stored in GeoJSON format with the following properties:
- Administrative names (NAME_1, NAME_2, NAME_3)
- Geographic identifiers (GID_1, GID_2, GID_3)
- Coordinate system: WGS84 decimal degrees

## Performance Considerations

- Large GeoJSON files (communes: 5MB, provinces: 2.4MB)
- Polygon simplification for complex geometries
- Zoom-based feature filtering
- Canvas rendering for optimal performance