import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Path, Text as SvgText, Circle, Line } from 'react-native-svg';
import tinycolor from 'tinycolor2';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Colors from '../Shared/Colors';

const WheelGame = () => {
  const [result, setResult] = useState('');
  const spinValue = useRef(new Animated.Value(0)).current;
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7', 'Option 8'];
  const wheelSize = 300;
  const strokeSize = 5; // the thinkness of the wheel's white border
  const viewBoxSize = wheelSize + strokeSize * 2;
  const wheelRadius = wheelSize / 2 - strokeSize / 2; // adjust the radius to make the white border visible
  const [isSpinning, setIsSpinning] = useState(false);

  // color options
  const springFlowerColors = ['#F294AD', '#F2D7B6', '#D9C5D2', '#F2DCEB', '#D93280'];
  const neutralBaseColors = ['#C0C4B6', '#EADFDB', '#AEAFB1', '#D8C2B5', '#F2CFB3'];
  const kittenBaseColors = ['#BF6989', '#D9C2AD', '#8C5230', '#A6836F', '#F2F2F2'];
  const cuteBaseColors = ['#90B8DB', '#4389C4', '#FF677C', '#FDBDCB', '#FFFFFF'];
  const energeBaseColors = ['#9EBF24', '#F2C84B', '#F2B263', '#F2620F', '#8C1D04'];
  const chocolateColors = ['#A65F37', '#D98D62', '#73341D', '#A66963'];
  const woodColors = ['#736656', '#A69580', '#593E25', '#A68263', '#D9B9A7'];

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

  const colors = generateLighterColors(kittenBaseColors, options.length);

  // render sector 
  const renderSector = (option, index) => {
    const startAngle = (index * 360) / options.length;
    const endAngle = ((index + 1) * 360) / options.length;
    const midAngle = (startAngle + endAngle) / 2;

    // calculate the text position
    // calculate the start line
    const startX = wheelRadius * Math.cos(2 * Math.PI * startAngle / 360);
    const startY = wheelRadius * Math.sin(2 * Math.PI * startAngle / 360);

    // calculate the end line
    const endX = wheelRadius * Math.cos(2 * Math.PI * endAngle / 360);
    const endY = wheelRadius * Math.sin(2 * Math.PI * endAngle / 360);
    const pathD = `M 0 0 L ${wheelSize / 2} 0 A ${wheelSize / 2} ${wheelSize / 2} 0 0 1 ${wheelSize / 2 * Math.cos(2 * Math.PI / options.length)} ${wheelSize / 2 * Math.sin(2 * Math.PI / options.length)} Z`;

    return (
      <G key={option} rotation={(index * 360) / options.length}>
        <Path d={pathD} fill={colors[index % colors.length]} />
        <SvgText
          x={wheelSize / 3.5}
          y="20"
          fill="black"
          transform={`rotate(${(360 / options.length) / 3})`}
          textAnchor="middle"
          fontSize="20"
        >
          {option}
        </SvgText>
        {/* the start line */}
        <Line
          x1="0"
          y1="0"
          x2={startX}
          y2={startY}
          stroke="white"
          strokeWidth="2"
        />
        {/* the end line */}
        <Line
          x1="0"
          y1="0"
          x2={endX}
          y2={endY}
          stroke="white"
          strokeWidth="2"
        />
      </G>
    );
  };

  // spin wheel
  const spinWheel = () => {
    if (isSpinning) return;
    setResult('');
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
      console.log("selectedOption: ", selectedOption);
      setResult(selectedOption);
      setIsSpinning(false);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperSection}>
        <TouchableOpacity onPress={spinWheel}>
          <Entypo name="triangle-down" size={80} color="white" />
        </TouchableOpacity>
      </View>
      <View>
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
        <TouchableOpacity
          onPress={spinWheel}
          style={styles.startButton}>
          <Text style={{ color: Colors.DARK_GRAY, fontWeight: 'bold' }}>Start</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 20, margin: 20 }}>Selected: {result}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    left: 150,
    top: 150,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -20,
    marginTop: -20,
    borderRadius: 50,
    backgroundColor: 'white',
  },
});

export default WheelGame;
