// screens/SettingsScreen.js - App settings and information
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Linking
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationPermission, setLocationPermission] = useState(true);
  
  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      if (settings !== null) {
        const parsedSettings = JSON.parse(settings);
        setDarkMode(parsedSettings.darkMode || false);
        setNotifications(parsedSettings.notifications !== false); // Default to true
        setLocationPermission(parsedSettings.locationPermission !== false); // Default to true
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };
  
  const saveSettings = async () => {
    try {
      const settings = {
        darkMode,
        notifications,
        locationPermission
      };
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };
  
  // Save settings whenever they change
  useEffect(() => {
    saveSettings();
  }, [darkMode, notifications, locationPermission]);
  
  const toggleDarkMode = () => {
    setDarkMode(previous => !previous);
  };
  
  const toggleNotifications = () => {
    setNotifications(previous => !previous);
  };
  
  const toggleLocationPermission = () => {
    setLocationPermission(previous => !previous);
  };
  
  const openKuTransportation = () => {
    Linking.openURL('https://transportation.ku.edu/');
  };
  
  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem('favorites');
      Alert.alert('Success', 'App cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      Alert.alert('Error', 'Failed to clear app cache');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
            <Text style={styles.settingDescription}>Enable dark theme for the app</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#d0d0d0', true: '#aad4ff' }}
            thumbColor={darkMode ? '#0051ba' : '#f5f5f5'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDescription}>Receive bus alerts and updates</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#d0d0d0', true: '#aad4ff' }}
            thumbColor={notifications ? '#0051ba' : '#f5f5f5'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Location Services</Text>
            <Text style={styles.settingDescription}>Allow app to access your location</Text>
          </View>
          <Switch
            value={locationPermission}
            onValueChange={toggleLocationPermission}
            trackColor={{ false: '#d0d0d0', true: '#aad4ff' }}
            thumbColor={locationPermission ? '#0051ba' : '#f5f5f5'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity style={styles.linkRow} onPress={openKuTransportation}>
          <Text style={styles.linkText}>KU Transportation Services</Text>
          <MaterialIcons name="open-in-new" size={20} color="#0051ba" />
        </TouchableOpacity>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Build</Text>
          <Text style={styles.infoValue}>2025.04.22</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Storage</Text>
        
        <TouchableOpacity 
          style={styles.dangerButton}
          onPress={() => {
            Alert.alert(
              'Clear App Cache',
              'Are you sure you want to clear all app data including favorites?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Clear',
                  onPress: clearCache,
                  style: 'destructive',
                },
              ]
            );
          }}
        >
          <Text style={styles.dangerButtonText}>Clear App Cache</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  linkText: {
    fontSize: 16,
    color: '#0051ba',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#777',
  },
  dangerButton: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e8000d',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  dangerButtonText: {
    color: '#e8000d',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SettingsScreen;