// screens/MapScreen.js - Map view with live bus tracking
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { BusDataContext } from '../context/BusDataContext';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const { 
    routes,
    stops,
    vehicles,
    selectedBuilding,
    selectedRoute,
    calculateETA
  } = useContext(BusDataContext);
  
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [region, setRegion] = useState({
    latitude: 38.9543,  // Default to KU campus
    longitude: -95.2558,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0121,
  });
  
  // Get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      // If we have a user location, adjust the map region
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0222,
        longitudeDelta: 0.0121,
      });
    })();
  }, []);
  
  // Create route path if selectedRoute changes
  useEffect(() => {
    if (selectedRoute && stops) {
      // In a real app, we would get the actual path coordinates for the route
      // For now, we'll create a simple path connecting all stops on the route
      const routeStops = stops.filter(stop => {
        // This would use the actual route-stop relation data
        // Placeholder logic for demo
        return true;
      });
      
      if (routeStops.length > 0) {
        const coords = routeStops.map(stop => ({
          latitude: stop.latitude,
          longitude: stop.longitude
        }));
        
        setRouteCoordinates(coords);
        
        // Center map on the route
        const avgLat = coords.reduce((sum, coord) => sum + coord.latitude, 0) / coords.length;
        const avgLng = coords.reduce((sum, coord) => sum + coord.longitude, 0) / coords.length;
        
        setRegion({
          latitude: avgLat,
          longitude: avgLng,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0121,
        });
      }
    }
  }, [selectedRoute, stops]);

  // Center on selected building when it changes
  useEffect(() => {
    if (selectedBuilding && selectedBuilding.nearbyStops.length > 0 && stops) {
      const relevantStop = stops.find(s => s.stop_id === selectedBuilding.nearbyStops[0]);
      
      if (relevantStop) {
        setRegion({
          latitude: relevantStop.latitude,
          longitude: relevantStop.longitude,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0061, // Zoom in a bit more for building view
        });
      }
    }
  }, [selectedBuilding, stops]);
  
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Bus Route Path */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#0051ba"
            strokeWidth={4}
          />
        )}
        
        {/* Bus Stops */}
        {stops.map(stop => (
          <Marker
            key={stop.stop_id}
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude
            }}
            pinColor="#e8000d"  // KU red
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{stop.name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        
        {/* Buses */}
        {vehicles.map(vehicle => (
          <Marker
            key={vehicle.vehicle_id}
            coordinate={{
              latitude: vehicle.latitude,
              longitude: vehicle.longitude
            }}
          >
            <View style={styles.busMarker}>
              <FontAwesome5 name="bus" size={20} color="white" />
            </View>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>Bus #{vehicle.vehicle_id}</Text>
                <Text>Route: {routes.find(r => r.route_id === vehicle.route_id)?.name || 'Unknown'}</Text>
                {userLocation && (
                  <Text>ETA: {calculateETA(vehicle.vehicle_id, userLocation)}</Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
        
        {/* Selected Building */}
        {selectedBuilding && selectedBuilding.nearbyStops.length > 0 && (
          <Marker
            coordinate={{
              latitude: stops.find(s => s.stop_id === selectedBuilding.nearbyStops[0])?.latitude || 38.9543,
              longitude: stops.find(s => s.stop_id === selectedBuilding.nearbyStops[0])?.longitude || -95.2558
            }}
            pinColor="#ffc82e"  // KU gold
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{selectedBuilding.name}</Text>
                <Text>Your destination</Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>
      
      {/* Route Info Panel */}
      {selectedRoute && (
        <View style={styles.routeInfoPanel}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeName}>
              {routes.find(r => r.route_id === selectedRoute.route_id)?.name || 'Selected Route'}
            </Text>
            {userLocation && vehicles.length > 0 && (
              <Text style={styles.eta}>
                ETA: {calculateETA(vehicles[0].vehicle_id, userLocation)}
              </Text>
            )}
          </View>
          <Text style={styles.destinationText}>
            Destination: {selectedBuilding?.name || 'Not selected'}
          </Text>
          
          {/* Added: Nearby stops for the selected building */}
          {selectedBuilding && selectedBuilding.nearbyStops.length > 0 && (
            <View style={styles.nearbyStopsContainer}>
              <Text style={styles.nearbyStopsLabel}>Nearby Stops:</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.stopsScrollView}
              >
                {selectedBuilding.nearbyStops.map(stopId => {
                  const stop = stops.find(s => s.stop_id === stopId);
                  return stop ? (
                    <View key={stopId} style={styles.stopBadge}>
                      <Text style={styles.stopBadgeText}>{stop.name}</Text>
                    </View>
                  ) : null;
                })}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  busMarker: {
    backgroundColor: '#0051ba',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  callout: {
    width: 160,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  routeInfoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0051ba',
  },
  eta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e8000d',
  },
  destinationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  nearbyStopsContainer: {
    marginTop: 8,
  },
  nearbyStopsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  stopsScrollView: {
    flexDirection: 'row',
  },
  stopBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  stopBadgeText: {
    fontSize: 12,
    color: '#333',
  },
});

export default MapScreen;