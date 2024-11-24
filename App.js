import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const savedUserData = await AsyncStorage.getItem('userData');
      const status = await AsyncStorage.getItem('isLoggedIn');
      if (savedUserData) setUserData(JSON.parse(savedUserData)); // Update user data on mount
      if (status === 'true') setIsLoggedIn(true); // Check if logged in
    };
    checkLoginStatus();
  }, []);

  const handleSubmit = async () => {
    if (isLogin) {
      const savedUserData = await AsyncStorage.getItem('userData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        if (userData.email === parsedData.email && userData.password === parsedData.password) {
          setIsLoggedIn(true);
          setUserData(parsedData); // Ensure user data is set after successful login
          await AsyncStorage.setItem('isLoggedIn', 'true');
          Alert.alert('Success', 'Logged in successfully');
        } else {
          Alert.alert('Error', 'Invalid credentials');
        }
      }
    } else {
      // Validation for creating an account
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.contactNumber || !userData.address) {
        Alert.alert('Error', 'Please fill in all the fields');
        return;
      }
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setIsLoggedIn(true);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setRegistrationSuccess(true); // Show registration success message
      setIsLogin(true); // Switch to login view
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUserData({ username: '', password: '', firstName: '', lastName: '', email: '', contactNumber: '', address: '' });
    await AsyncStorage.removeItem('isLoggedIn');
  };

  const handleEdit = () => setIsEditing(true);
  const handleSaveChanges = async () => {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated');
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoggedIn ? (
        <ScrollView style={styles.profileContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome, {userData.firstName}!</Text>
            <View style={styles.detailsContainer}>
              {!isEditing ? (
                <>
                  <Text style={styles.infoText}>First Name: {userData.firstName}</Text>
                  <Text style={styles.infoText}>Last Name: {userData.lastName}</Text>
                  <Text style={styles.infoText}>Email: {userData.email}</Text>
                  <Text style={styles.infoText}>Contact Number: {userData.contactNumber}</Text>
                  <Text style={styles.infoText}>Address: {userData.address}</Text>
                </>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={userData.firstName}
                    onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={userData.lastName}
                    onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={userData.email}
                    onChangeText={(text) => setUserData({ ...userData, email: text })}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Contact Number"
                    value={userData.contactNumber}
                    onChangeText={(text) => setUserData({ ...userData, contactNumber: text })}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={userData.address}
                    onChangeText={(text) => setUserData({ ...userData, address: text })}
                  />
                </>
              )}
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loginContainer}>
          <Text style={styles.title}>{isLogin ? 'Login' : 'Create an Account'}</Text>
          <View style={styles.formContainer}>
            {isLogin ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={userData.email}
                  onChangeText={(text) => setUserData({ ...userData, email: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={userData.password}
                  onChangeText={(text) => setUserData({ ...userData, password: text })}
                  secureTextEntry
                />
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  value={userData.firstName}
                  onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={userData.lastName}
                  onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={userData.email}
                  onChangeText={(text) => setUserData({ ...userData, email: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={userData.password}
                  onChangeText={(text) => setUserData({ ...userData, password: text })}
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Number"
                  value={userData.contactNumber}
                  onChangeText={(text) => setUserData({ ...userData, contactNumber: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={userData.address}
                  onChangeText={(text) => setUserData({ ...userData, address: text })}
                />
              </>
            )}
            <TouchableOpacity style={styles.mainButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>
            {registrationSuccess && !isLogin && (
              <Text style={styles.registrationSuccess}>Registration successful!</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? 'Don’t have an account? Register' : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  profileContainer: { padding: 20, backgroundColor: '#fff' },
  welcomeContainer: {
    alignItems: 'center',
    backgroundColor: '#e8e6e6',
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 10 ,textAlign:'center'},

  detailsContainer: { width: '100%', marginVertical: 20 ,},

  infoText: { fontSize: 16, marginBottom: 10, color: '#000' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 15, paddingLeft: 10 },

  editButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, marginTop: 20 },

  logoutButton: { backgroundColor: '#A6D2E1', padding: 10, borderRadius: 5, marginTop: 10 },

  buttonText: { color: '#fff', textAlign: 'center' },

  loginContainer: { padding: 20, justifyContent: 'center' },

  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },

  mainButton: { backgroundColor: '#A6D2E1', padding: 15, borderRadius: 5, marginBottom: 20 },

  switchText: { textAlign: 'center', color: '#007BFF' },

  formContainer: 
  { backgroundColor: '#F3D0F5', borderRadius: 10, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  registrationSuccess: { textAlign: 'center', color: 'green', fontSize: 18, marginTop: 20 },


  welcomeContainer:{backgroundColor: '#CCEDE4', padding: 20, justifyContent: 'center',borderRadius:5}
});
