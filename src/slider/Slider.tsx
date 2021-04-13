import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  concat,
  divide,
  interpolate,
  multiply,
  sub,
  round,
  Value,
  useCode,
  eq,
  call,
  cond,
} from 'react-native-reanimated';
import {
  onGestureEvent,
  withOffset,
  diffClamp,
  ReText,
} from 'react-native-redash';
import Knob, { KNOB_SIZE } from './Knob';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 100;

export default () => {
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const gestureHandler = onGestureEvent({ state, translationX });
  const x = diffClamp(withOffset(translationX, state), 0, SLIDER_WIDTH);
  const translateX = sub(x, KNOB_SIZE / 2);
  //   const rotate = interpolate(translateX, {
  //     inputRange: [0, SLIDER_WIDTH / 3],
  //     outputRange: [0, 2 * Math.PI],
  //   });
  const scale = interpolate(x, {
    inputRange: [0, SLIDER_WIDTH],
    outputRange: [1, 1.5],
  });

  const value = round(multiply(divide(x, SLIDER_WIDTH), 100));
  const label = concat(value);

  // called when release (animation ended)
  useCode(
    () =>
      cond(
        eq(state, State.END),
        call([value], ([v]) => console.log({ value: v }))
      ),
    [state, value]
  );

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View style={styles.container}>
        <View style={styles.slider}>
          <View style={styles.sliderBackground}>
            <Animated.View style={[styles.sliderInner, { width: x }]} />
          </View>
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: KNOB_SIZE,
              height: KNOB_SIZE,
              transform: [{ translateX }],
            }}
          >
            <Animated.View
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 50,
                // transform: [{ rotate }],
              }}
            >
              <Knob state={state} scale={scale} />
            </Animated.View>
          </Animated.View>
        </View>
        <ReText text={label} style={styles.label} />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a9cbee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: SLIDER_WIDTH,
    height: KNOB_SIZE,
    justifyContent: 'center',
  },
  sliderBackground: {
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  sliderInner: {
    backgroundColor: 'grey',
    height: 20,
    borderRadius: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 30,
  },
});
