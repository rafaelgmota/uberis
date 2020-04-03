import React, { useEffect, useState, useRef, Fragment } from 'react';
import { View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Search from '../Search';
import Directions from '../Directions';
import { getPixelSize } from '../../utils';
import Geocoder from 'react-native-geocoding';
import Details from '../Details';
import API_KEY from '../../config/apikey';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

import { Back,  LocationBox, LocationText, LocationTimeBox, LocationTimeText, LocationTimeTextSmall } from './styles';

Geocoder.init(API_KEY);

export default function Map() {
  const [region, setRegion] = useState(null);
  const [destination, setDestination] = useState(null);
  const [location, setLocation] = useState(null);
  const [duration, setDuration] = useState(null);
  const mapRef = useRef(null);

  useEffect( () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: {latitude, longitude} }) => {
        Geocoder.from({ latitude, longitude })
          .then(({ results }) => {
            const address = results[0].formatted_address;
            const location = address.substring(0, address.indexOf(','));
            setLocation(location);
          });

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

  function handleBack() {
    setDestination(null);
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
                setDuration(Math.floor(result.duration));

                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                    bottom: getPixelSize(350),
                  }
                });
              }}
            />
            <Marker image={markerImage} coordinate={destination}  anchor={{ x: 0, y: 0 }}>
              <LocationBox>
                <LocationText>{destination.title}</LocationText>
              </LocationBox>
            </Marker>

            <Marker coordinate={region}  anchor={{ x: 0, y: 0 }}>
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>Min</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker>
          </Fragment>
           }
      </MapView>
      { destination ? 
      <Fragment>
        <Back onPress={handleBack}>
          <Image source={backImage} />
        </Back>
        <Details/>
      </Fragment>
      :  <Search onLocationSelected={handleLocationSelected}/> }    
    </View>
  );
}