// context/BusDataContext.js - Central data store for bus information
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { API_URL, WS_URL } from '../config';

export const BusDataContext = createContext();

export const BusDataProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Socket for real-time vehicle updates
  const [socket, setSocket] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch routes
        const routesResponse = await fetch(`${API_URL}/api/routes/`);
        const routesData = await routesResponse.json();
        setRoutes(routesData);
        
        // Fetch stops
        const stopsResponse = await fetch(`${API_URL}/api/stops/`);
        const stopsData = await stopsResponse.json();
        setStops(stopsData);
        
        // Initialize buildings data
        // Mapping of stops to nearby buildings
        const buildingsData = [
          { 
            id: 1, 
            name: "Kansas Union / Memorial Union", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Memorial") || 
              stop.name.includes("Kansas") || 
              stop.name.includes("Union")).map(stop => stop.stop_id),
            image: require('../assets/buildings/kansas_union.jpg')
          },
          { 
            id: 2, 
            name: "Budig Hall", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Budig") || 
              stop.name.includes("Jayhawk Blvd")).map(stop => stop.stop_id),
            image: require('../assets/buildings/budig_hall.jpg')
          },
          { 
            id: 3, 
            name: "Wescoe Hall", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Wescoe") || 
              stop.name.includes("Jayhawk Blvd") ||
              stop.name.includes("Malott")).map(stop => stop.stop_id),
            image: require('../assets/buildings/wescoe_hall.jpg')
          },
          { 
            id: 4, 
            name: "Allen Fieldhouse", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Allen") || 
              stop.name.includes("Fieldhouse") ||
              stop.name.includes("15th")).map(stop => stop.stop_id),
            image: require('../assets/buildings/allen_fieldhouse.jpg')
          },
          { 
            id: 5, 
            name: "Daisy Hill Residence Halls", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Daisy") || 
              stop.name.includes("Templin") ||
              stop.name.includes("Lewis")).map(stop => stop.stop_id),
            image: require('../assets/buildings/daisy_hill.jpg')
          },
          { 
            id: 6, 
            name: "Engineering Complex", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Engineering") || 
              stop.name.includes("Learned") ||
              stop.name.includes("Eaton")).map(stop => stop.stop_id),
            image: require('../assets/buildings/engineering_complex.jpg')
          },
          { 
            id: 7, 
            name: "Spencer Museum of Art", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Spencer") || 
              stop.name.includes("Museum")).map(stop => stop.stop_id),
            image: require('../assets/buildings/spencer_museum.jpg')
          },
          { 
            id: 8, 
            name: "Haworth Hall", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Haworth") || 
              stop.name.includes("Science")).map(stop => stop.stop_id),
            image: require('../assets/buildings/haworth_hall.jpg')
          },
          { 
            id: 9, 
            name: "Lied Center", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Lied")).map(stop => stop.stop_id),
            image: require('../assets/buildings/lied_center.jpg')
          },
          { 
            id: 10, 
            name: "School of Pharmacy", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Pharmacy")).map(stop => stop.stop_id),
            image: require('../assets/buildings/pharmacy.jpg')
          },
          { 
            id: 11, 
            name: "Recreation Center", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Recreation") || 
              stop.name.includes("Ambler")).map(stop => stop.stop_id),
            image: require('../assets/buildings/recreation_center.jpg')
          },
          { 
            id: 12, 
            name: "Burge Union", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Burge") || 
              stop.name.includes("19th")).map(stop => stop.stop_id),
            image: require('../assets/buildings/burge_union.jpg')
          },
          { 
            id: 13, 
            name: "Strong Hall", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Strong") || 
              stop.name.includes("Memorial Union")).map(stop => stop.stop_id),
            image: require('../assets/buildings/strong_hall.jpg')
          },
          { 
            id: 14, 
            name: "Watson Library", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Watson") || 
              stop.name.includes("Memorial Union")).map(stop => stop.stop_id),
            image: require('../assets/buildings/watson_library.jpg')
          },
          { 
            id: 15, 
            name: "Anschutz Library", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Anschutz") || 
              stop.name.includes("Budig")).map(stop => stop.stop_id),
            image: require('../assets/buildings/anschutz_library.jpg')
          },
          { 
            id: 16, 
            name: "Lippincott Hall", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Lippincott") || 
              stop.name.includes("Spencer")).map(stop => stop.stop_id),
            image: require('../assets/buildings/lippincott_hall.jpg')
          },
          { 
            id: 17, 
            name: "GSP/Corbin Halls", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("GSP") || 
              stop.name.includes("Corbin")).map(stop => stop.stop_id),
            image: require('../assets/buildings/gsp_corbin.jpg')
          },
          { 
            id: 18, 
            name: "Integrated Science Building", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Science") || 
              stop.name.includes("Haworth")).map(stop => stop.stop_id),
            image: require('../assets/buildings/integrated_science.jpg')
          },
          { 
            id: 19, 
            name: "Malott Hall", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Malott")).map(stop => stop.stop_id),
            image: require('../assets/buildings/malott_hall.jpg')
          },
          { 
            id: 20, 
            name: "Hall Center for Humanities", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Hall Center") || 
              stop.name.includes("Lied")).map(stop => stop.stop_id),
            image: require('../assets/buildings/hall_center.jpg')
          },
          { 
            id: 21, 
            name: "DeBruce Center", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("DeBruce") || 
              stop.name.includes("15th")).map(stop => stop.stop_id),
            image: require('../assets/buildings/debruce_center.jpg')
          },
          { 
            id: 22, 
            name: "Fraser Hall", 
            nearbyStops: stopsData.filter(stop => 
              stop.name.includes("Fraser") || 
              stop.name.includes("Kansas Union")).map(stop => stop.stop_id),
            image: require('../assets/buildings/fraser_hall.jpg')
          }
        ];
        
        setBuildings(buildingsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load bus data. Please check your connection.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
    };
    
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setVehicles(data);
    };
    
    ws.onerror = (e) => {
      console.error('WebSocket error:', e);
      setError('Real-time updates unavailable. Please restart the app.');
    };
    
    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };
    
    setSocket(ws);
    
    // Cleanup function
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Find the best bus route for a selected building
  const findBestRoute = useCallback((buildingId) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return null;
    
    const relevantStops = building.nearbyStops;
    if (!relevantStops.length) return null;
    
    // Find all routes that pass through these stops
    const relevantRoutes = routes.filter(route => {
      // This would need to be enhanced with actual route-stop mapping data
      // For now, we're making a simplified assumption based on what we have
      return true; // Placeholder - would check if route serves any of the relevant stops
    });
    
    return relevantRoutes.length > 0 ? relevantRoutes[0] : null;
  }, [buildings, routes]);

  // Calculate ETA based on vehicle location and user location
  const calculateETA = useCallback((vehicleId, userLocation) => {
    const vehicle = vehicles.find(v => v.vehicle_id === vehicleId);
    if (!vehicle || !userLocation) return "Unknown";
    
    // This would be a complex calculation involving route pathing,
    // current traffic, vehicle speed, etc.
    // For simplicity, we'll use a placeholder calculation
    
    // Calculate straight-line distance (very simplified)
    const distance = Math.sqrt(
      Math.pow(vehicle.latitude - userLocation.latitude, 2) + 
      Math.pow(vehicle.longitude - userLocation.longitude, 2)
    );
    
    // Convert to minutes (very rough estimate)
    // 0.01 in coordinates is roughly 1.11 km at the equator
    // Assuming bus speed of 20 km/h on average
    const estimatedMinutes = Math.round((distance / 0.01) * 1.11 / 20 * 60);
    
    return `${estimatedMinutes} minutes`;
  }, [vehicles]);

  return (
    <BusDataContext.Provider value={{
      routes,
      stops,
      vehicles,
      buildings,
      loading,
      error,
      selectedBuilding,
      setSelectedBuilding,
      selectedRoute,
      setSelectedRoute,
      findBestRoute,
      calculateETA
    }}>
      {children}
    </BusDataContext.Provider>
  );
};