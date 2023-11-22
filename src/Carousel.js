import React, {useRef, useEffect} from 'react';
import {View, Dimensions, Animated, Text} from 'react-native';

const data = [
  {
    _id: 1,
    img: 'https://source.unsplash.com/user/c_v_r/1900x800',
  },
  {
    _id: 2,
    img: 'https://picsum.photos/200/300',
  },
  {
    _id: 3,
    img: 'https://source.unsplash.com/user/c_v_r/1900x800',
  },
  {
    _id: 4,
    img: 'https://picsum.photos/200/300',
  },
  {
    _id: 5,
    img: 'https://source.unsplash.com/user/c_v_r/1900x800',
  },
  {
    _id: 6,
    img: 'https://picsum.photos/200/300',
  },
];

const {width, height} = Dimensions.get('window');

const TextScroll = ({item, index, scrollX}) => {
  const opacity = scrollX.interpolate({
    inputRange: [(index - 1) * width, index * width, (index + 1) * width],
    outputRange: [0, 1, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      key={item._id}
      style={{
        height,
        width,
        opacity,
        position: 'absolute',
        zIndex: 9999,
      }}>
      <Text style={{fontSize: 32, alignSelf: 'center'}}>
        Screen {index + 1}
      </Text>
    </Animated.View>
  );
};

const ImageScroll = ({item, index, scrollX}) => {
  const translateX = scrollX.interpolate({
    inputRange: [(index - 1) * width, index * width, (index + 1) * width],
    outputRange: [-width, 0, width],
    extrapolate: 'clamp',
  });
  const opacity = scrollX.interpolate({
    inputRange: [
      (index - 1) * Dimensions.get('window').width,
      index * Dimensions.get('window').width,
      (index + 1) * Dimensions.get('window').width,
    ],
    outputRange: [0, 1, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.Image
      source={{
        uri: item.img,
      }}
      style={{
        height: 400,
        width: Dimensions.get('window').width,
        transform: [
          {
            translateX,
          },
        ],
        opacity,
      }}
    />
  );
};

const Pagination = ({item, index, scrollX, count = 5}) => {
  const translateX = scrollX.interpolate({
    inputRange: [(index - 1) * width, index * width, (index + 1) * width],
    outputRange: [-width, 0, width],
    extrapolate: 'clamp',
  });

  count = data?.length > count ? count : data?.length;
  console.log('🚀 ~ file: Carousel.js:102 ~ Pagination ~ count:', data.length);
  return (
    <Animated.View
      style={{
        backgroundColor: '#979',
        padding: 4,
        position: 'absolute',
        bottom: 12,
        flexDirection: 'row',
        left: '50%', // Move the left edge to the center
        transform: [{translateX: -50}, {translateX}],
      }}>
      {data?.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [12, 30, 12],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index?.toString()}
            style={{
              height: 12,
              width: dotWidth,
              borderRadius: 12,
              backgroundColor: '#fff',
              margin: 4,
            }}
          />
        );
      })}
    </Animated.View>
  );
};

const RenderItem = props => {
  return (
    <View>
      <ImageScroll {...props} />
      <TextScroll {...props} />
      <Pagination {...props} />
    </View>
  );
};

export const Carousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
      useNativeDriver: false,
    });
  }, [scrollX]);

  return (
    <View
      style={{
        height: 400,
        width: Dimensions.get('window').width,
        borderWidth: 1,
      }}>
      <Animated.FlatList
        data={data}
        keyExtractor={item => item?._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        renderItem={({item, index}) => {
          return <RenderItem item={item} index={index} scrollX={scrollX} />;
        }}
      />
    </View>
  );
};
