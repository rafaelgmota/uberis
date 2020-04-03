import React, { useEffect, useState, useRef, Fragment } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Search from '../Search';
import Directions from '../Directions';
import { getPixelSize } from '../../utils';

import markerImage from '../../assets/marker.png'

export default function Map() {
  const [region, setRegion] = useState(null);
  const [destination, setDestination] = useState(null);
  const mapRef = useRef(null);

  useEffect( () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: {latitude, longitude} }) => {
        setRegion({
          latitude,
          longitude,
          longitudeDelta: 0.0143,
          latitudeDelta: 0.0134,
        });
      }, //Sucesso
      () => {}, //Erro
      {
        timeout: 2000,
        enableHighAccuracy: true, //Pega a localização pelo GPS ou WiFi
        maximumAge: 1000,
      }
    )
  }, []);

  function handleLocationSelected(data, { geometry }) {
    const { location: { lat: latitude, lng: longitude } } = geometry;

    setDestination({latitude, longitude, title: data.structured_formatting.main_text});
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
         showsUserLocation={true}
         loadingEnabled
      >
        { destination &&
          <Fragment>
            <Directions
              origin={region}
              destination={destination}
              onReady={result => {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                    bottom: getPixelSize(50),
                  }
                });
              }}
            />
            <Marker image={markerImage} coordinate={destination}  anchor={{ x: 0, y: 0 }}> 
            </Marker>
          </Fragment>
           }
      </MapView>
      <Search onLocationSelected={handleLocationSelected}/>
    </View>
  );
}