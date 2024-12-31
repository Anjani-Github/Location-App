import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import LocationModal from './components/LocationModal';
import AddressForm from './components/AddressForm';
import AddressList from './components/AddressList';
import './App.css';

function App() {
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [addressString, setAddressString] = useState(null);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        if (isLocationModalOpen && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                    setIsLocationModalOpen(false);
                    setLocationError(null);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationError(error);
                    if (error.code === error.PERMISSION_DENIED) {
                        alert("Location permission denied. Please enable it in your browser settings.");
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        alert("Location information is unavailable.");
                    } else if (error.code === error.TIMEOUT) {
                        alert("The request to get user location timed out.");
                    } else {
                        alert("An unknown error occurred while getting your location.");
                    }
                    setIsLocationModalOpen(true); // Reopen the modal on error
                }
            );
        }
    }, [isLocationModalOpen]);

    const handleEnableLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setIsLocationModalOpen(false);
        }, (error) => {
          console.error("Error getting location:", error);
          setIsLocationModalOpen(true);
        })
      }
    };

    const handleSearchManually = () => {
        setIsLocationModalOpen(false);
    };

    const handleLocationSelect = (location, address) => {
        setCurrentLocation(location);
        setAddressString(address);
    };

    const handleAddressSave = (newAddress) => {
        setSavedAddresses([...savedAddresses, newAddress]);
    };

    return (
        <div className="App">
            <LocationModal
                isOpen={isLocationModalOpen}
                onRequestClose={() => setIsLocationModalOpen(false)}
                onEnableLocation={handleEnableLocation}
                onSearchManually={handleSearchManually}
            />
            {currentLocation && (
                <div>
                    <MapComponent onLocationSelect={handleLocationSelect} currentLocation={currentLocation} />
                    {addressString && <p>Selected Address: {addressString}</p>}
                    <AddressForm onAddressSave={handleAddressSave} location={currentLocation} />
                    <AddressList />
                </div>
            )}
        </div>
    );
}

export default App;