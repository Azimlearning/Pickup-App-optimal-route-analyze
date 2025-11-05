import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapboxMap({ route = [] }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      console.warn("VITE_MAPBOX_TOKEN is not set. Map will not initialize.");
      return;
    }

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: route.length ? [route[0].coord.lng, route[0].coord.lat] : [101.6869, 3.139],
        zoom: route.length ? 12 : 10,
      });
    }

    const map = mapRef.current;

    // Add markers
    route.forEach((pt, idx) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "50%";
      el.style.background = idx === 0 ? "#10b981" : "#1f2937";

      new mapboxgl.Marker(el)
        .setLngLat([pt.coord.lng, pt.coord.lat])
        .setPopup(new mapboxgl.Popup().setText(`${idx + 1}: ${pt.input}`))
        .addTo(map);
    });

    // Draw simple route line if there are more than 1 points
    if (route.length > 1) {
      const coords = route.map((p) => [p.coord.lng, p.coord.lat]);
      if (map.getSource("route")) {
        map.getSource("route").setData({
          type: "Feature",
          geometry: { type: "LineString", coordinates: coords },
        });
      } else {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: coords },
          },
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#3b82f6", "line-width": 4 },
        });
      }
      map.fitBounds(coords.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(coords[0], coords[0])), {
        padding: 50,
      });
    }

    // Cleanup when unmounting
    return () => {
      if (map && map.remove) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, [route]);

  return <div ref={mapContainer} style={{ width: "100%", height: "500px", borderRadius: 8 }} />;
}
