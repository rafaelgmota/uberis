import React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import API_KEY from '../../config/apikey';

export default function Directions({ destination, origin, onReady }) {
  console.log(origin);
  console.log(destination);
  return(
    <MapViewDirections 
      destination={destination}
      origin={origin}
      onReady={onReady}
      apikey={API_KEY}
      strokeWidth={3}
      strokeColor="#222"
    />
  );
}