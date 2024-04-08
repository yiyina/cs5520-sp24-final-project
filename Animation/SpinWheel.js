import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Path, Text as SvgText, Circle, Line } from 'react-native-svg';
import tinycolor from 'tinycolor2';
import { Entypo } from '@expo/vector-icons';
import Colors from '../Shared/Colors';
import Card from '../Shared/Card';

const WheelGame = ({ spinItems, spinColor }) => {
  const [options, setOptions] = useState(spinItems);
  const [colorSet, setColorSet] = useState(spinColor);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to control button disabled state
  const [result, setResult] = useState('');
  const spinValue = useRef(new Animated.Value(0)).current;
  const wheelSize = 350;
  const strokeSize = 5; // the thinkness of the wheel's white border
  const viewBoxSize = wheelSize + strokeSize * 2;
  const wheelRadius = wheelSize / 2 - strokeSize / 2; // adjust the radius to make the white border visible

  useEffect(() => {
    setColorSet(spinColor);
    setOptions(spinItems);
  }, [spinColor, spinItems]);

  // generate colors 
  const generateLighterColors = (baseColors, numberOfOptions) => {
    const colors = [];
    const numberOfShadesPerColor = Math.ceil(numberOfOptions / baseColors.length);

    baseColors.forEach(baseColor => {
      for (let i = 0; i < numberOfShadesPerColor; i++) {
        const grayShadeColor = tinycolor(baseColor)
          .lighten(i * 5)
          .desaturate(i * 10)
          .toString();
        colors.push(grayShadeColor);
      }
    });
    return colors.slice(0, numberOfOptions);
  };

  const colors = generateLighterColors(colorSet, options.length);

  // render sector 
  const renderSector = (option, index) => {
    const maxCharLimit = 10;
    const displayText = option.length > maxCharLimit ? `${option.substring(0, maxCharLimit)}...` : option;
    const startAngle = index * 360 / options.length;
    const endAngle = (index + 1) * 360 / options.length;
    const midAngle = startAngle + (endAngle - startAngle) / 2;

    // calculate the text position
    const textRadius = wheelRadius * 0.95
    const textX = textRadius * Math.cos(midAngle * Math.PI / 180);
    const textY = textRadius * Math.sin(midAngle * Math.PI / 180);

    // calculate the start line
    const startX = wheelRadius * Math.cos(2 * Math.PI * startAngle / 360);
    const startY = wheelRadius * Math.sin(2 * Math.PI * startAngle / 360);
    const endX = wheelRadius * Math.cos(2 * Math.PI * endAngle / 360);
    const endY = wheelRadius * Math.sin(2 * Math.PI * endAngle / 360);

    const pathD = `M 0 0 L ${wheelSize / 2} 0 A ${wheelSize / 2} ${wheelSize / 2} 0 0 1 ${wheelSize / 2 * Math.cos(2 * Math.PI / options.length)} ${wheelSize / 2 * Math.sin(2 * Math.PI / options.length)} Z`;

    return (
      <G key={`${option}-${index}`} rotation={(index * 360) / options.length}>
        <Path d={pathD} fill={colors[index % colors.length]} />
        <SvgText
          x={wheelSize / 3.5}
          y="20"
          fill="black"
          transform={`rotate(${(360 / options.length)} ${wheelSize / 12} 30)`}
          textAnchor="middle"
          fontSize="16"
        >
          {displayText}
        </SvgText>
        {/* the start line */}
        <Line
          x1="0"
          y1="0"
          x2={startX}
          y2={startY}
          stroke="white"
          strokeWidth="1"
        />
        {/* the end line */}
        <Line
          x1="0"
          y1="0"
          x2={endX}
          y2={endY}
          stroke="white"
          strokeWidth="1"
        />
      </G>
    );
  };

  // spin wheel
  const spinWheel = () => {
    setResult('');
    setIsButtonDisabled(true);
    const randomSpin = Math.floor(Math.random() * 364 * 4 + 1440);

    Animated.timing(spinValue, {
      toValue: randomSpin,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      const degrees = randomSpin % 360;
      let adjustedDegrees = (360 - degrees - 90) % 360;
      adjustedDegrees = adjustedDegrees < 0 ? adjustedDegrees + 360 : adjustedDegrees;
      const index = Math.floor((adjustedDegrees / 360) * options.length);
      const safeIndex = index < options.length ? index : 0;
      const selectedOption = options[safeIndex];
      setResult(selectedOption);
      setIsSpinning(false);
      setIsButtonDisabled(false);
    });
  };

  return (
    <View style={styles.container}>
      {/* <Card newStyle={styles.card} /> */}
      <View style={styles.mainSpin}>
        {/* spin */}
        <Animated.View style={{ transform: [{ rotate: spinValue.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) }] }}>
          <Svg height={viewBoxSize} width={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
            <G y={viewBoxSize / 2} x={viewBoxSize / 2}>
              {options.map((option, index) => renderSector(option, index))}
              {/* white border */}
              <Circle
                cx="0"
                cy="0"
                r={wheelRadius}
                fill="none"
                stroke={Colors.WHITE}
                strokeWidth={strokeSize * 2}
              />
            </G>
          </Svg>
        </Animated.View>
        {/* shadow circle */}
        <View style={[styles.shadowCircle, { left: viewBoxSize / 2 - 150, top: viewBoxSize / 2 - 150 }]}>
          <Animated.View style={{ transform: [{ rotate: spinValue.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) }] }} />
        </View>
        <TouchableOpacity onPress={spinWheel} style={styles.selectTriangle}>
          <Entypo name="triangle-down" size={80} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={spinWheel}
          style={[styles.startButton, isButtonDisabled && { opacity: 0.4 }]} // Disable button style when isButtonDisabled is true
          disabled={isButtonDisabled}>
          <Text style={{ color: Colors.DARK_GRAY, fontWeight: 'bold' }}>START</Text>
        </TouchableOpacity>
        <View style={styles.result}>
          <Text style={{ fontSize: 25, margin: 20 }}>Selected: {result}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.GRAY,
  },
  upperSection: {
    position: 'absolute',
    top: Dimensions.get('window').height / 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  startButton: {
    position: 'absolute',
    left: 140,
    top: 140,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'white',
  },
  selectTriangle: {
    position: 'absolute',
    left: 140,
    top: -40,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  card: {
    position: 'absolute',
    height: Dimensions.get('window').height / 2,
    top: '25%',
  },
  mainSpin: {
    position: 'absolute',
  },
  result: {
    position: 'absolute',
    top: -100,
    left: 50,
  },
  shadowCircle: {
    position: 'absolute',
    zIndex: -1,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -25,
    marginTop: -25,
  },
});

export default WheelGame;
