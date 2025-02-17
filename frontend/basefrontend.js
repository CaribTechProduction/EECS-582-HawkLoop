import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';

// KU Color Palette
const KU_COLORS = {
  blue: '#0051ba',
  red: '#e8000d',
  yellow: '#FFC72C',
  white: '#FFFFFF',
  black: '#000000',
};

// Mock data (to be replaced with API calls)
const locations = [
  {
    id: 1,
    name: 'Bailey Hall',
    image: require('./assets/bailey_hall.jpg'),
    coordinates: { latitude: 38.9581, longitude: -95.2441 },
    buses: ['Route 27', 'Route 38'],
  },
  {
    id: 2,
    name: 'Strong Hall',
    image: require('./assets/strong_hall.jpg'),
    coordinates: { latitude: 38.9548, longitude: -95.2446 },
    buses: ['Route 11', 'Route 27'],
  },
  // Add more locations
];

const BusRouteTracker = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('map');
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);

  // Mock bus data
  const [buses] = useState([
    {
      id: 1,
      route: 'Route 27',
      arrivalTime: '8 min',
      coordinates: { latitude: 38.956, longitude: -95.245 },
    },
  ]);

  const handleLocationPress = (location) => {
    setSelectedLocation(location);
    bottomSheetRef.current.expand();
    mapRef.current.animateToRegion({
      ...location.coordinates,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationCard}
      onPress={() => handleLocationPress(item)}
    >
      <Image source={item.image} style={styles.locationImage} />
      <Text style={styles.locationName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderBusInfo = () => (
    <View style={styles.busInfoContainer}>
      <Text style={styles.sectionTitle}>Available Buses</Text>
      {selectedLocation.buses.map((route, index) => (
        <View key={index} style={styles.busCard}>
          <View style={styles.routeBadge}>
            <Text style={styles.routeText}>{route}</Text>
          </View>
          <Text style={styles.arrivalTime}>Next arrival: 8 min</Text>
          <Text style={styles.busStatus}>Approaching Wescoe Hall</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 38.9548,
          longitude: -95.2446,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={location.coordinates}
            onPress={() => handleLocationPress(location)}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>{location.name}</Text>
            </View>
          </Marker>
        ))}

        {buses.map((bus) => (
          <Marker
            key={bus.id}
            coordinate={bus.coordinates}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.busMarker}>
              <Text style={styles.busMarkerText}>{bus.route}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Location Selector */}
      <View style={styles.locationSelector}>
        <FlatList
          horizontal
          data={locations}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Bottom Sheet for Details */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['25%', '50%', '90%']}
        backgroundStyle={styles.bottomSheet}
      >
        <ScrollView style={styles.bottomSheetContent}>
          {selectedLocation && (
            <>
              <Image
                source={selectedLocation.image}
                style={styles.locationHeaderImage}
              />
              <Text style={styles.locationTitle}>{selectedLocation.name}</Text>
              {renderBusInfo()}
            </>
          )}
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KU_COLORS.white,
  },
  map: {
    flex: 1,
  },
  locationSelector: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    height: 120,
  },
  locationCard: {
    width: 160,
    marginRight: 10,
    backgroundColor: KU_COLORS.white,
    borderRadius: 12,
    padding: 8,
    shadowColor: KU_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
  },
  locationName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: KU_COLORS.blue,
  },
  marker: {
    backgroundColor: KU_COLORS.red,
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: KU_COLORS.white,
  },
  markerText: {
    color: KU_COLORS.white,
    fontWeight: 'bold',
  },
  bottomSheet: {
    backgroundColor: KU_COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  bottomSheetContent: {
    padding: 20,
  },
  locationHeaderImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KU_COLORS.blue,
    marginBottom: 20,
  },
  busInfoContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: KU_COLORS.black,
    marginBottom: 12,
  },
  busCard: {
    backgroundColor: KU_COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: KU_COLORS.yellow,
  },
  routeBadge: {
    backgroundColor: KU_COLORS.blue,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  routeText: {
    color: KU_COLORS.white,
    fontWeight: 'bold',
  },
  arrivalTime: {
    marginTop: 8,
    fontSize: 16,
    color: KU_COLORS.black,
  },
  busStatus: {
    marginTop: 4,
    fontSize: 14,
    color: KU_COLORS.red,
  },
  busMarker: {
    backgroundColor: KU_COLORS.yellow,
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: KU_COLORS.white,
  },
  busMarkerText: {
    color: KU_COLORS.blue,
    fontWeight: 'bold',
  },
});

export default BusRouteTracker;
