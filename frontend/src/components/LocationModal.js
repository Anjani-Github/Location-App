import React from 'react';
import Modal from 'react-modal';
import '../App.css';

Modal.setAppElement('#root'); // Important for accessibility

const LocationModal = ({ isOpen, onRequestClose, onEnableLocation, onSearchManually }) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={{
            overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            },
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                padding: '20px'
            }
        }}
    >
        <h2>Location Permission</h2>
        <p>Please enable location services or search manually.</p>
        <button onClick={onEnableLocation}>Enable Location</button>
        <button onClick={onSearchManually}>Search Manually</button>
    </Modal>
);

export default LocationModal;