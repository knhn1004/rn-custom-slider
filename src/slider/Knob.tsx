import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, { eq } from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';

interface KnobProps {
  state: Animated.Node<State>;
  scale: Animated.Node<number>;
}

export const KNOB_SIZE = 50;

const Knob: React.FC<KnobProps> = ({ state, scale }) => {
  const opacity = eq(state, State.ACTIVE);
  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/down.png')}
        style={[
          styles.image,
          {
            transform: [{ scale }],
          },
        ]}
      />
      <Animated.Image
        source={require('../../assets/up.png')}
        style={[styles.image, { opacity, transform: [{ scale }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
});

export default Knob;
