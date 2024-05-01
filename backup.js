import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { Video } from 'expo-av';
import { Camera } from 'expo-camera';

export default function App() {
  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  useEffect(() => {
    const startVideo = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        const video = await cameraRef.current.recordAsync();
        if (videoRef.current) {
          videoRef.current.source = { uri: video.uri };
          await videoRef.current.loadAsync();
          await videoRef.current.playAsync();
        }
      } else {
        console.error('Camera permission not granted');
      }
    };

    startVideo();
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);
  
  return (
    <View style={styles.container}>
        <Camera ref={cameraRef} type={Camera.Constants.Type.front}>
          <Video
            ref={videoRef}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={{ width: 200, height: 400 }}
          />
        </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
