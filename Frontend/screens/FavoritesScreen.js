import React, { useContext, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BusDataContext } from '../context/BusDataContext';
import BuildingItem from '../components/BuildingItem';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { buildings, setSelectedBuilding, findBestRoute, setSelectedRoute } = useContext(BusDataContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load favorites on component mount
  useEffect(() => {
    loadFavorites();
  }, []);
  
  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites !== null) {
        const favoriteIds = JSON.parse(savedFavorites);
        
        // Map favorite IDs to actual building objects
        const favoriteBuildings = buildings.filter(building => 
          favoriteIds.includes(building.id)
        );
        
        setFavorites(favoriteBuildings);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setLoading(false);
    }
  };
  
  const removeFromFavorites = async (buildingId) => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites !== null) {
        const favoriteIds = JSON.parse(savedFavorites);
        const updatedFavorites = favoriteIds.filter(id => id !== buildingId);
        
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        
        // Update UI
        setFavorites(favorites.filter(building => building.id !== buildingId));
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      Alert.alert('Error', 'Failed to remove from favorites');
    }
  };
  
  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    const bestRoute = findBestRoute(building.id);
    if (bestRoute) {
      setSelectedRoute(bestRoute);
      navigation.navigate('Map');
    }
  };
  
  const renderFavoriteItem = ({ item }) => {
    return (
      <View style={styles.favoriteItemContainer}>
        <BuildingItem 
          building={item}
          onPress={() => handleBuildingSelect(item)}
        />
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromFavorites(item.id)}
        >
          <MaterialIcons name="delete-outline" size={24} color="#e8000d" />
        </TouchableOpacity>
      </View>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }
  
  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="favorite-outline" size={64} color="#aaa" />
        <Text style={styles.emptyText}>No favorites yet</Text>
        <Text style={styles.emptySubtext}>
          Add your frequently visited buildings from the home screen to quickly access them here.
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.addButtonText}>Browse Buildings</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  addButton: {
    backgroundColor: '#0051ba',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    padding: 8,
  },
  favoriteItemContainer: {
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
});

export default FavoritesScreen;