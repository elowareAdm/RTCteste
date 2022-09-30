/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCView,
} from 'react-native-webrtc';

const App: () => React$Node = () => {
  let peerConstraints = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  };

  const [localMediaStream, setLocalMediaStream] = useState<MediaStream>();
  let mediaConstraints = {
    audio: true,
  };
  const start = async () => {
    let isVoiceOnly = true;

    try {
      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

      if (isVoiceOnly) {
        let videoTrack = await mediaStream.getVideoTracks()[0];
        videoTrack._enabled = false;
      }
      setLocalMediaStream(mediaStream);
    } catch (err) {
      console.log(err);
    }
  };
  const stop = () => {
    console.log('stop');
    if (localMediaStream) {
      localMediaStream.release();
      setLocalMediaStream(undefined);
    }
  };

  const connection = () => {
    Alert.alert('Connexao estabelecida');
    let peerConnection = new RTCPeerConnection(peerConstraints);
    peerConnection.addEventListener('connectionstatechange', _event => {
      switch (peerConnection.connectionState) {
        case 'closed':
          // hooks
          break;
      }
    });
    peerConnection.addEventListener('icecandidate', event => {});
    peerConnection.addEventListener('icecandidateerror', _event => {});
    peerConnection.addEventListener('iceconnectionstatechange', _event => {});
    peerConnection.addEventListener('icegatheringstatechange', _event => {});
    peerConnection.addEventListener('negotiationneeded', _event => {});
    peerConnection.addEventListener('signalingstatechange', _event => {});
    peerConnection.addEventListener('addstream', _event => {
      console.log('added event');
    });
    peerConnection.addEventListener('removestream', _event => {});
    peerConnection.addIceCandidate(localMediaStream);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body}>
        {localMediaStream && (
          <RTCView streamURL={localMediaStream.toURL()} style={styles.stream} />
        )}
        <View style={styles.footer}>
          <Button title="Start" onPress={start} />
          <Button title="Stop" onPress={stop} />
          <Button title="Criar conexao rtc" onPress={connection} />
          <Button title="add Media Stream" onPress={connection} />

          <RTCView
            mirror={true}
            objectFit={'cover'}
            streamURL={localMediaStream ? localMediaStream.toURL() : ''}
            zOrder={0}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill,
  },
  stream: {
    flex: 1,
  },
  footer: {
    backgroundColor: Colors.lighter,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default App;
