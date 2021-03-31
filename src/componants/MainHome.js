import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-web-swiper';
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from 'react-native-cards';
import {IMAGE} from '../constants/image';
import {List, ListItem, Left, Body, Right} from 'native-base';
import {FlatList} from 'react-native-gesture-handler';
import Star from 'react-native-star-view';
// import { SearchBar } from 'react-native-elements';
import {Icon} from 'react-native-elements';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import Carousel from 'react-native-snap-carousel';
let deviceWidth = Dimensions.get('window').width;
export class MainHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      errormsg: '',
      slides: [],
      data: [],
    };
  }
  state = {
    search: '',
  };

  _renderItem = ({item, index}) => {
    return (
      <View>
        <Image
          source={{
            uri:
              'https://satasmemiy.tk/work/public/images/slides/' + item.thumb,
          }}
          style={{
            backgroundColor: '#fff',
            width: '100%',
            height: '100%',

            // height: 280,
            // width: 590,
          }}></Image>
      </View>
    );
  };

  loadScren() {
    fetch('https://satasmemiy.tk/getAllsubcategory', {
      method: 'get',
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          data: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          errormsg: error,
        });
      });
  }
  componentDidMount() {
    console.log(deviceWidth);
    fetch('https://satasmemiy.tk/getAllsubcategory', {
      method: 'get',
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          data: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          errormsg: error,
        });
      });

    this.getAllSlides();
  }
  getAllSlides() {
    fetch('https://satasmemiy.tk/admin/getAllSlides', {
      method: 'get',
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          slides: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  updateSearch = (search) => {
    this.setState({search});
  };
  renderItem = ({item}) => {
    return (
      <ListItem
        style={{
          marginBottom: 10,
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: 15,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: item.color,
        }}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('TabScreentest', {
              categpry_name: item.name,
            })
          }>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: -15,
              marginLeft: 5,
              marginBottom: -20,
            }}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <ImageBackground
                source={{uri: item.image}}
                style={{
                  bottom: 50,
                  resizeMode: 'cover',
                  width: 105,
                  height: 90,
                }}></ImageBackground>
            </View>
            <View style={{bottom: 30}}>
              <Text style={(styles.dateText, {fontWeight: 'bold'})}>
                {item.name}{' '}
              </Text>
            </View>
            <View style={{bottom: 20}}>
              <TouchableOpacity onPress={() => handleAddTask()}>
                <View style={styles.addWrapper}>
                  <Text style={{color:'white'}}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </ListItem>
    );
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    let {isLoading} = this.state;
    const {search} = this.state;
    const starStyle = {
      width: 70,
      height: 15,
      marginBottom: 0,
      marginTop: 0,
    };

    return (
      <ParallaxScroll
        renderHeader={({animatedValue}) => (
          <View style={{backgroundColor: 'red', height: 130}}>
            <View style={{backgroundColor: '#3B7457', height: 130}}>
              <View style={{marginLeft: 20, marginBottom: 10, marginTop: -5}}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 32, color: 'white'}}>
                  Welcome To
                </Text>
                <Text
                  style={{fontWeight: 'normal', fontSize: 20, color: 'white'}}>
                  Marlen's Wherehouse
                </Text>
              </View>
              <View style={{marginTop: 0, paddingLeft: 15, paddingRight: 15}}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    borderColor: 'gray',
                    borderWidth: 0.5,
                    borderRadius: 25,
                    backgroundColor: '#F2F2F2',
                    paddingLeft: 10,
                    height: 42,
                  }}>
                  <Icon
                    name="search"
                    type="font-awesome"
                    size={20}
                    style={{color: '#9e9e9e', paddingRight: 5}}
                  />
                  <TextInput
                    style={{width: '85%'}}
                    placeholder="Search..."
                    onEndEditing={this.clearFocus}
                    autoFocus={false}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
        headerHeight={130}
        isHeaderFixed={false}
        parallaxHeight={130}
        parallaxBackgroundScrollSpeed={5}
        parallaxForegroundScrollSpeed={2.5}>
        {this.state.errormsg == '' ? (
          <View style={{height: 780}}>
            <View style={{height: 280}}>
              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                autoplay={true}
                loop={true}
                useScrollView={true}
                scrollEnabled={true}
                hasParallaxImages={true}
                layout={'stack'}
                layoutCardOffset={18}
                data={this.state.slides}
                renderItem={this._renderItem}
                sliderWidth={deviceWidth}
                itemWidth={340}
              />

              {/* <Swiper
                horizontal
                loop
                timeout={-3.5}
                controlsProps={{
                  dotActiveStyle: {backgroundColor: 'red'},
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(200,20,20,0.3)',
                  }}>
                  <Image
                    source={IMAGE.ICON_SLIDE7}
                    style={{height: 280, width: 390}}></Image>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(200,20,20,0.3)',
                  }}>
                  <Image
                    source={IMAGE.ICON_SLIDE4}
                    style={{height: 280, width: 400}}></Image>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(200,20,20,0.3)',
                  }}>
                  <Image
                    source={IMAGE.ICON_SLIDE5}
                    style={{height: 280, width: 400}}></Image>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(200,20,20,0.3)',
                  }}>
                  <Image
                    source={IMAGE.ICON_SLIDE6}
                    style={{height: 280, width: 400}}></Image>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(200,20,20,0.3)',
                  }}>
                  <Image
                    source={IMAGE.ICON_SLIDE3}
                    style={{height: 280, width: 400}}></Image>
                </View>
              </Swiper> */}
            </View>

            <View>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  paddingLeft: 15,
                  paddingTop: 20,
                }}>
                Our Category
              </Text>
              <View
                style={{
                  borderTopWidth: 4,
                  borderTopColor: '#009688',
                  borderRadius: 3,
                  marginHorizontal: 16,
                  width: 45,
                  marginTop: 10,
                }}></View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic">
                <FlatList
                  horizontal
                  contentContainerStyle={{
                    paddingTop: StatusBar.currentHeight || 0,
                  }}
                  ListEmptyComponent={this.emptyComponent}
                  scrollEnabled={false}
                  keyExtractor={this.keyExtractor}
                  data={this.state.data}
                  renderItem={this.renderItem}
                />
              </ScrollView>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  paddingLeft: 15,
                  paddingTop: 0,
                }}>
                Favourites
              </Text>
              <View style={[styles.card, {margin: 15}]}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{backgroundColor: '#F2F2F2', borderRadius: 200}}>
                    <Image
                      source={IMAGE.ICON_ABTIMG6}
                      style={{height: 120, width: 120}}></Image>
                  </View>
                  <View style={{margin: 10}}>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                      Blueberry Muffin
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: 11,
                        color: 'gray',
                        width: 220,
                        marginTop: 5,
                      }}>
                      Originally published on this day in 2014, these blueberry
                      muffins are a personal and reader favorite. I found myself
                      baking the muffins often, swapping blueberries for apples,
                      peaches, and other fruits.
                    </Text>
                    <Star score={4.7} style={starStyle} />
                    <Text
                      style={{color: 'red', fontWeight: 'bold', fontSize: 16}}>
                      $ 4
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Image
              source={IMAGE.ICON_NO_INTERNET}
              style={{height: 180, width: 300}}></Image>
            <Text style={{fontSize: 30, color: '#adaaaa'}}>Whoops !</Text>
            <Text style={{fontSize: 16, color: '#adaaaa'}}>
              Network connection failed{' '}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.loadScren()}>
              <Text style={styles.text}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ParallaxScroll>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  addWrapper: {
    width: 25,
    height: 25,
    backgroundColor: '#3B7457',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 0.2,
  },
  card: {
    height: 135,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 8,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    alignItems: 'flex-start',
    // margin: 5
  },
  button: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: 'red',
  },
  text: {
    color: '#fff',
    fontSize: 15,
  },
});
