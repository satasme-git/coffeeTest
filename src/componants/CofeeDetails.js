import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import {IMAGE} from '../constants/image';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {Avatar, Divider} from 'react-native-elements';
import Star from 'react-native-star-view';
import {CustomHeader} from '../index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UIStepper from 'react-native-ui-stepper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import Database from '../Database';
import {TagSelect} from 'react-native-tag-select';
import * as Animatable from 'react-native-animatable';
import SwitchSelector from 'react-native-switch-selector';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
const db = new Database();

const sugar = [
  {label: 'White', value: '15'},
  {label: 'Brown', value: '30'},
];

export class CofeeDetails extends Component {
  constructor(props) {
    super(props);
    this.checkToken();
    this.state = {
      isLoading: true,
      _aaa: 0,
      // _price: options[0].value,
      _price: 0,
      _name: this.props.route.params.item_nme,
      _id: this.props.route.params.id,
      _image: this.props.route.params.img,
      dbs: '',
      _qty: 1,
      value: 25,
      labelSizes: 18,
      colors: 'black',
      position: 0,
      addextra_total: 0,
      sml_val: 0,
      gros_total: 0,
      SelectedButton: '',
      param_price: this.props.route.params.price,
      _coffeeAditionValue: 0,
      options: [
        { label: "Small", value: "0" },
        { label: "Medium", value: "0" },
        { label: "Large", value: "0" },
        { label: "Medium", value: "30" },
        { label: "Large", value: "45" }
      ],
      data: [
        {id: 1, label: 'Full Cream', val: '0'},
        {id: 2, label: 'Skim', val: '0'},
        {id: 3, label: 'Soy', val: '0'},
        {id: 4, label: 'Almond', val: '0'},
        {id: 5, label: 'Oat', val: '0'},
      ],
    };
    db.initDB().then((result) => {
      this.loadDbVarable(result);
    });
    this.loadDbVarable = this.loadDbVarable.bind(this);
  }
  checkToken = async () => {
    const token = await AsyncStorage.getItem('cus_id');
    if (token) {
      //   this.props.navigation.navigate('HomeApp');
    } else {
      this.props.navigation.navigate('SignIn');
    }
  };

  changeSML(value) {
    var smlval = value;
    var total = parseFloat(smlval);

    this.setState({
      sml_val: total,
      // gros_total:  total,
    });
  }
  loadDbVarable(result) {
    this.setState({
      dbs: result,
    });
    db.cartCont(this.state.dbs)
      .then((data) => {
        let cart_count = data;

        this.setState({
          _aaa: cart_count,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getFoodById() {
    fetch('https://satasmemiy.tk/getFoodById/' + this.props.route.params.id, {
      method: 'get',
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var result = [];
        var addExtra = [];
        var smallPrice = 0;
        var datas = JSON.stringify(responseJson.details);

        // console.log(">>>>>>>>>>>>>>>> response json : " + responseJson.details.length);
        if (responseJson.details.length != 0) {
          smallPrice = responseJson.details[0].price;
          console.log(">>>>>>>>>>>>>>>> response json : " + responseJson.details[0].price);
          responseJson.details.forEach((subProduct) => {
            result.push({label: subProduct.size, value: subProduct.price});
          });
          responseJson.data.forEach((extra) => {
            addExtra.push({id: extra.id, label: extra.label, val: extra.val});
          });
          // console.log(addExtra);

          this.setState(
            {
              isLoading: false,
              options: result,
              data: addExtra,
              _coffeeAditionValue: 1,
              sml_val: smallPrice,
            },
            function () {},
          );
        } else {
          console.log(responseJson.price);
          this.setState(
            {
              isLoading: false,
              sml_val: responseJson.price,
            },
            function () {},
          );
        }
        // console.log(responseJson.details);
        // var datas=JSON.stringify(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  addToCart = () => {
    let {pId, pOnePrice, pQty, newPrice = 0, innervalue = 0} = this.props;
    let dataa = {
      p_id: this.state._id,
      p_name: this.state._name,
      p_price:
        (this.state.addextra_total + parseFloat(this.state.sml_val)) *
        parseFloat(this.state._qty),
      p_description: this.props.route.params.description,
      p_image: this.state._image,
      pQty: this.state._qty,
    };
    db.listCartItems(this.state.dbs)
      .then((data) => {
        let result = data;
        if (result == 0) {
          db.addtocart(this.state.dbs, dataa)
            .then((result) => {
              // this.props.navigation.replace('YourPageRoot');
              this.props.navigation.replace('Cart');
            })
            .catch((err) => {
              console.log(err);
            });
          this.setState({
            isLoading: false,
          });
        } else {
          for (var i = 0; i < result.length; i++) {
            pId = result[i].pId;
            pOnePrice = result[i].pOnePrice;
            pQty = result[i].pQty;
            if (result[i].pId == this.state._id) {
              innervalue = 1;
            }
          }
          if (innervalue == 1) {
            newPrice = (pQty + 1) * pOnePrice;
            db.updateCart(this.state.dbs, newPrice, this.state._id)
              .then((result) => {
                // this.props.navigation.push('TabScreentest');
                this.props.navigation.replace('Cart');
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            db.addtocart(this.state.dbs, dataa)
              .then((result) => {
                this.props.navigation.replace('Cart');
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

    db.cartCont(this.state.dbs)
      .then((data) => {
        let cart_count = data;

        this.setState({
          _aaa: cart_count,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  insertInvoice = () => {
    const myArray = AsyncStorage.getItem('cus_id');
    const {_id} = this.state;
    const {_qty} = this.state;

    fetch('https://satasmemiy.tk/images/food/api/neworder', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: this.state._cus_id,
        // imagename: 'sdasdasd',
        foods: [
          {
            product_id: _id,
            qty: _qty,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((customerselect) => {
        Alert.alert(JSON.stringify(customerselect));
      });
  };
  async componentDidMount() {
    this.getFoodById();
    const myArray = await AsyncStorage.getItem('cus_id');
    this.setState({
      isLoading: false,
      _cus_id: myArray,
    });

    // const responseJson = await response;
    // .then((responseJson) => {

    //   this.data = responseJson;

    // Alert.alert("sadasd " + responseJson);
    // console.log(JSON.parse(responseJson));

    // }).catch((error) => {
    //   console.error(error);
    // });
    // }).then((response) => response.json())
    //     .then((responseJson) => {

    //      this.data = responseJson;
    //      this.setState({ loading: false });

    //      console.log("asdasdasdasd asd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> : "+response);
    // }).catch((error) => {
    //   console.error(error);
    // });
  }
  setValue = (value) => {
    var price =
      (this.state.addextra_total + parseFloat(this.state.sml_val)) * value;
    this.setState({
      isLoading: false,
      _price: price,
      _qty: value,
    });
  };
  // _handleClick(button) {
  //   var smlval = 0;
  //   if (button == "1") {
  //     smlval = 10;
  //   } else if (button == "2") {
  //     smlval = 20;
  //   } else if (button == "3") {
  //     smlval = 30;
  //   }

  //   this.setState({
  //     SelectedButton: button,
  //     sml_val: smlval
  //   })
  // }
  _handleClick3(button) {
    var responsejson = JSON.stringify(this.tag.itemsSelected);
    const valuesArray = JSON.parse(responsejson);
    var total = 0;
    valuesArray.map((item) => {
      total += parseFloat(item.val);
    });
    this.setState({
      addextra_total: total,
      // gros_total: parseFloat(this.state.gros_total) + addextra_total
    });
  }
  render() {
    let {isLoading} = this.state;

    const {id, img, item_nme, description, price} = this.props.route.params;
    const starStyle = {
      width: 100,
      height: 20,
      marginBottom: 0,
      marginTop: 0,
    };
    if (isLoading) {
      return <BarIndicator color="#fbb146" />;
    } else {
      return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#00897b'}}>
          <StatusBar
            barStyle="light-content"
            hidden={false}
            backgroundColor="#00897b"
          />
          <CustomHeader
            title=""
            isPost
            isHome={false}
            cart_qty={this.state._aaa}
            bdcolor="#00897b"
            navigation={this.props.navigation}
          />

          <View style={styles.header}>
            <View
              style={{
                width: 290,
                height: 290,
                borderRadius: 200,
                backgroundColor: '#009984',
                zIndex: -1,
                position: 'absolute',
                marginLeft: 55,
              }}></View>
            <Animatable.View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 30,
                marginTop: 0,
              }}
              animation="bounceInDown">
              <ImageBackground
                source={{uri: 'https://satasmemiy.tk/images/food/' + img}}
                style={{
                  height: '105%',
                  width: '100%',
                  resizeMode: 'contain',
                  zIndex: -1,
                }}></ImageBackground>
            </Animatable.View>
            <View
              style={{
                flexDirection: 'row-reverse',
                marginHorizontal: 30,
                top: -25,
              }}>
              <Avatar
                rounded
                size={48}
                containerStyle={{
                  backgroundColor: 'white',
                  shadowColor: 'rgba(0,0,0, .4)', // IOS
                  shadowOffset: {height: 2, width: 5}, // IOS
                  shadowOpacity: 3, // IOS
                  shadowRadius: 5,
                  elevation: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="heart-outline"
                  size={25}
                  style={{color: 'gray', padding: 11}}
                />
              </Avatar>
            </View>
          </View>

          <Animatable.View style={styles.footer} animation="fadeInUp">
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              showsHorizontalScrollIndicator={false}
              style={styles.scrollView}>
              {/* <View style={{ flexDirection: 'row-reverse', marginHorizontal: 5, zIndex: 5,  }}>
  
  
            </View> */}
              {/* </View> */}
              <View style={{paddingLeft: 20, paddingRight: 10}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 28,
                    paddingBottom: 10,
                    fontWeight: 'bold',
                  }}>
                  {item_nme}
                </Text>

                {/* <Star score={5} style={starStyle} /> */}
                {/* <AirbnbRating
  
              /> */}
                <Star score={4.7} style={starStyle} />

                {/* <Text style={{ color: '#7b412d', fontSize: 20, paddingBottom: 10, fontWeight: 'bold' }}>Product Description</Text> */}
                <Text
                  style={{
                    color: 'gray',
                    textAlign: 'justify',
                    fontSize: 15,
                    marginBottom: 10,
                  }}>
                  {description}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}></View>
                {/* <View style={{ marginBottom: 10 }}>
                  <Divider style={{ backgroundColor: 'gray', }} />
                </View> */}

                {
                  // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> : " + this.state._coffeeAditionValue)

                  this.state._coffeeAditionValue == 1 ? (
                    <View>
                      <Animatable.View
                        animation="flipInX"
                        style={{marginBottom: 20}}>
                        <SwitchSelector
                          options={this.state.options}
                          initial={0}
                          selectedColor={'white'}
                          buttonColor={'#00897b'}
                          borderColor={'white'}
                          height={45}
                          onPress={(value) => this.changeSML(value)}
                        />
                      </Animatable.View>

                      <View
                        style={{
                          backgroundColor: 'white',
                          borderRadius: 10,
                          padding: 10,
                        }}>
                        <Text style={{marginBottom: 10}}>Add Extra</Text>
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                          <TagSelect
                            data={this.state.data}
                            max={3}
                            ref={(tag) => {
                              this.tag = tag;
                            }}
                            onItemPress={() => this._handleClick3(this.tag)}
                          />
                        </ScrollView>
                      </View>

                      <View style={{marginTop: 10, width: 140}}>
                        <Text style={{paddingVertical: 8}}>Sugar Type </Text>
                        <SwitchSelector
                          options={sugar}
                          initial={0}
                          selectedColor={'white'}
                          buttonColor={'brown'}
                          borderColor={'white'}
                          height={35}
                          options={sugar}
                        />
                      </View>
                    </View>
                  ) : (
                    <View></View>
                  )
                }
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                    marginTop: 15,
                  }}>
                  <View>
                    <Text>Total</Text>

                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 38,
                        color: 'red',
                        marginTop: -2,
                      }}>
                      ${' '}
                      {(this.state.addextra_total +
                        parseFloat(this.state.sml_val)) *
                        parseFloat(this.state._qty)}
                    </Text>
                    {/* <Text style={{ fontWeight: 'bold', fontSize: 38, color: 'red', marginTop: -2 }}>$ {parseFloat(this.state._price) }</Text> */}
                  </View>
                  <View style={{marginTop: 22}}>
                    <UIStepper
                      borderRadius={25}
                      height={40}
                      width={130}
                      // value={1}
                      initialValue={1}
                      minimumValue={1}
                      borderColor={'#00897b'}
                      tintColor={'#00897b'}
                      displayValue={true}
                      onValueChange={(value) => {
                        this.setValue(value);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    {/* <TouchableOpacity style={styles.button} onPress={this.insertInvoice}>
            
                      <Text style={styles.buttonText}>Make Order</Text>
                    </TouchableOpacity>
                     */}
                    {/* <TouchableOpacity style={styles.button} onPress={this.addToCart}>
              
                      <Text style={styles.buttonText}>add to cart</Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              </View>
              {/* <View> */}
            </ScrollView>
            <View
              style={{
                alignItems: 'flex-end',
                backgroundColor: 'white',
                borderRadius: 20,
              }}>
              <View style={{padding: 10, flexDirection: 'row'}}>
                <TouchableOpacity
                  style={styles.buttongeart}
                  onPress={() => this.props.navigation.navigate('WishList')}>
                  <Icon
                    name="heart-outline"
                    size={25}
                    style={{color: '#00897b', padding: 0}}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonstyle}
                  onPress={this.addToCart}>
                  <Text style={{color: 'white'}}>Make Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animatable.View>
        </SafeAreaView>
      );
    }
  }
}
const styles = StyleSheet.create({
  sml_button: {
    height: 45,
    width: 105,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  header: {
    flex: 2,
    backgroundColor: '#00897b',
  },
  footer: {
    backgroundColor: '#F2F2F2',
    flex: 3,
    zIndex: -1,
    // flex: 1,
    // flexDirection: 'row',

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingRight: 10,
    paddingTop: 10,
  },

  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
    marginTop: -5,
    marginLeft: 18,
    marginBottom: 10,
    // marginVertical: 5,
    //  zIndex:5
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
  brestposition3: {
    width: 260,
    height: 260,
    marginRight: -30,
    marginTop: -30,
    flexDirection: 'row-reverse',
    backgroundColor: 'rgba(102, 51, 33, 0.8)',
    borderRadius: 130,
    // overflow: 'hidden',
    zIndex: -2,
    position: 'absolute',
  },
  brestposition4: {
    width: 170,
    height: 170,
    // marginRight: 12,
    marginTop: 12,
    marginLeft: 42,
    backgroundColor: 'rgba(123, 65, 45, 1)',
    borderRadius: 110,
    // overflow: 'hidden',
    zIndex: -1,

    position: 'absolute',
  },
  button: {
    backgroundColor: '#00897b',
    padding: 15,
    borderRadius: 25,
    // width:'200',
    width: 350,

    marginTop: 13,
    //marginLeft: 18,
    // marginVertical: 5
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },

  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50,
    backgroundColor: 'red',

    borderRadius: 25,

    width: 110,
  },
  buttonstyle: {
    backgroundColor: '#00897b',
    borderRadius: 15,
    width: '78%',
    padding: 0,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttongeart: {
    backgroundColor: 'white',
    borderColor: '#00897b',
    borderWidth: 1,
    borderRadius: 15,
    width: '17%',
    marginRight: 10,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: 50,
    marginLeft: 15,
  },
  buttonContainer: {
    padding: 15,
  },
  buttonInner: {
    marginBottom: 15,
  },
  labelText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 15,
  },
  item: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#FFF',
  },
  label: {
    color: '#333',
  },
  itemSelected: {
    backgroundColor: '#333',
  },
  labelSelected: {
    color: '#FFF',
  },
});
