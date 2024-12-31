import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddressList = () => {
    const [addresses, setAddresses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/address'); // The Axios GET request
                setAddresses(response.data);
            } catch (err) {
                setError(err.message || "Failed to fetch addresses.");
                console.error("Error fetching addresses:", err); // Log the full error for debugging
                if (axios.isAxiosError(err)) {
                    // Access specific Axios error properties
                    if (err.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.error("Response data:", err.response.data);
                        console.error("Response status:", err.response.status);
                        console.error("Response headers:", err.response.headers);
                    } else if (err.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.error("Request:", err.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.error('Error message:', err.message);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    if (loading) {
        return <div>Loading addresses...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Saved Addresses</h2>
            {addresses.length === 0 ? (
                <p>No addresses saved yet.</p>
            ) : (
                <ul>
                    {addresses.map(address => (
                        <li key={address._id}>
                            {address.houseNumber}, {address.apartment}, {address.area} ({address.category})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressList;