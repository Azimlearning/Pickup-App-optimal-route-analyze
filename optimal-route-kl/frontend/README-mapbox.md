```md
Mapbox integration

1. Install the Mapbox dependency in optimal-route-kl/frontend:
   cd optimal-route-kl/frontend
   npm install mapbox-gl

2. Set your Mapbox token:
   - Add VITE_MAPBOX_TOKEN=your_token to .env.local
   - Never commit your real token.

3. Components:
   - src/components/MapboxMap.jsx is a lightweight map component that renders markers and a line for the route.

4. Notes:
   - The Mapbox GL JS library requires CSS. If using with Vite, import the CSS in your root style:
     import 'mapbox-gl/dist/mapbox-gl.css';
```