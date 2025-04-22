// components/BuildingItem.js - Individual building item in the list
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BuildingItem = ({ building, onPress }) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={() => onPress(building)}>
      {building.image ? (
        <Image 
          source={building.image} 
          style={styles.buildingImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.iconContainer}>
          <MaterialIcons name="location-on" size={24} color="#e8000d" />
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.buildingName}>{building.name}</Text>
        <Text style={styles.stopCount}>
          {building.nearbyStops.length} nearby {building.nearbyStops.length === 1 ? 'stop' : 'stops'}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#aaa" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 12,
  },
  buildingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  buildingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stopCount: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
});

export default BuildingItem;