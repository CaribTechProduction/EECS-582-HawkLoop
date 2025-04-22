// screens/HomeScreen.js - Main app screen
import React, { useContext, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Image
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BusDataContext } from '../context/BusDataContext';
import BuildingItem from '../components/BuildingItem';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { 
    buildings, 
    loading, 
    error, 
    setSelectedBuilding,
    findBestRoute,
    setSelectedRoute
  } = useContext(BusDataContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  
  useEffect(() => {
    if (buildings && buildings.length > 0) {
      setFilteredBuildings(buildings);
    }
  }, [buildings]);
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredBuildings(buildings);
    } else {
      const filtered = buildings.filter(building => 
        building.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBuildings(filtered);
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
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0051ba" />
        <Text style={styles.loadingText}>Loading bus data...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/ku_jayhawk_logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>HawkLoop</Text>
      </View>
      
      <Text style={styles.subtitle}>Find your destination on campus</Text>
      
      <Searchbar
        placeholder="Search for a building..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <FlatList
        data={filteredBuildings}
        renderItem={({ item }) => (
          <BuildingItem 
            building={item} 
            onPress={() => handleBuildingSelect(item)}
          />
        )}
        keyExtractor={item => item.id.toString()}
        style={styles.buildingList}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0051ba',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    margin: 16,
    color: '#333',
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
  },
  buildingList: {
    flex: 1,
  },
  listContent: {
    padding: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0051ba',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;