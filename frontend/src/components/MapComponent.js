import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import '../App.css';

const containerStyle = { width: '100%', height: '400px' }; // Responsive width

const MapComponent = ({ onLocationSelect }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 0, lng: 0 }); // Default
    const [markerPosition, setMarkerPosition] = useState(null);
    const [address, setAddress] = useState('');
    const [autocomplete, setAutocomplete] = useState(null);

    const onMapLoad = useCallback((map) => {
        setMap(map);
        if (markerPosition) {
          map.panTo(markerPosition);
        }
    }, [markerPosition]);

    const onMapUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const onMarkerDragEnd = (event) => {
        const newPosition = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setMarkerPosition(newPosition);
        setCenter(newPosition)
        geocodeLatLng(newPosition);
    };

    const locateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setCenter(userLocation);
                    setMarkerPosition(userLocation);
                    map?.panTo(userLocation);
                    geocodeLatLng(userLocation);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not get your location. Please enable location services.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const geocodeLatLng = (latLng) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK') {
              if (results[0]) {
                  setAddress(results[0].formatted_address);
                  onLocationSelect(latLng, results[0].formatted_address);
              } else {
                  setAddress('No results found');
                  onLocationSelect(latLng, 'No results found');
              }
          } else {
              setAddress('Geocoder failed: ' + status);
              onLocationSelect(latLng, 'Geocoder failed: ' + status);
          }
      });
    }

    const onPlaceChanged = () => {
      if (autocomplete !== null) {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const newPosition = {
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng(),
          }
          setCenter(newPosition);
          setMarkerPosition(newPosition);
          map?.panTo(newPosition);
          geocodeLatLng(newPosition);
        } else {
          alert("No location data found for this place.");
        }
      }
    }

    const onLoadAutocomplete = useCallback(auto => setAutocomplete(auto), [])

    return isLoaded ? (
        <div>
            <Autocomplete
              onLoad={onLoadAutocomplete}
              onPlaceChanged={onPlaceChanged}
            >
                <input
                  type="text"
                  placeholder="Search Address"
                  style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `240px`,
                    height: `32px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    marginLeft: '-120px'
                  }}
                />
              </Autocomplete>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                onLoad={onMapLoad}
                onUnmount={onMapUnmount}
            >
                {markerPosition && <Marker draggable={true} position={markerPosition} onDragEnd={onMarkerDragEnd} />}
            </GoogleMap>
            <button onClick={locateMe} style={{marginTop: '10px'}}>Locate Me</button>
            {address && <p>Address: {address}</p>}
        </div>
    ) : <></>;
};

export default React.memo(MapComponent);