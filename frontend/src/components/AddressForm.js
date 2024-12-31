import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddressForm = ({ onAddressSave, location }) => {
    const [addressData, setAddressData] = useState({
        houseNumber: '',
        apartment: '',
        area: '',
        category: 'Home',
        lat: location?.lat || null,
        lng: location?.lng || null
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (location) {
        setAddressData(prevData => ({ ...prevData, lat: location.lat, lng: location.lng }));
      }
    }, [location]);

    const handleChange = (e) => {
        setAddressData({ ...addressData, [e.target.name]: e.target.value });
    };

    const validateForm = (values) => {
      let errors = {};
      if (!values.houseNumber) {
        errors.houseNumber = "House/Flat/Block No. is required";
      }
      if (!values.apartment) {
        errors.apartment = "Apartment/Road/Area is required";
      }
      if (!values.area) {
        errors.area = "Area is required";
      }
      return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validateForm(addressData));
        setIsSubmitting(true);
        if (Object.keys(formErrors).length === 0) {
          try {
              const response =  await axios.post('http://localhost:5000/api/address', addressData);
              onAddressSave(response.data);
              setAddressData({
                  houseNumber: '',
                  apartment: '',
                  area: '',
                  category: 'Home',
                  lat: location?.lat || null,
                  lng: location?.lng || null
              });
          } catch (error) {
              console.error('Error saving address:', error);
              alert("Error saving address. Please check console for details.");
          } finally {
            setIsSubmitting(false);
          }
        } else {
          setIsSubmitting(false);
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="houseNumber" placeholder="House/Flat/Block No." value={addressData.houseNumber} onChange={handleChange} required />
            {formErrors.houseNumber && <span className="error">{formErrors.houseNumber}</span>}
            <input type="text" name="apartment" placeholder="Apartment/Road/Area" value={addressData.apartment} onChange={handleChange} required/>
            {formErrors.apartment && <span className="error">{formErrors.apartment}</span>}
            <input type="text" name="area" placeholder="Area" value={addressData.area} onChange={handleChange} required/>
            {formErrors.area && <span className="error">{formErrors.area}</span>}
            <select name="category" value={addressData.category} onChange={handleChange}>
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Friends & Family">Friends & Family</option>
            </select>
            <input type="hidden" name="lat" value={addressData.lat} onChange={handleChange}/>
            <input type="hidden" name="lng" value={addressData.lng} onChange={handleChange}/>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Save Address"}
            </button>
        </form>
    );
};

export default AddressForm;