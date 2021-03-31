import React, { PureComponent } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, Modal, Image, Pressable, ScrollView, Alert } from 'react-native';
import { List, ListItem, Left, Body, Right } from 'native-base';
import { Icon, Avatar } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import mockMoview from '../mockMovies';
import MoviewRow from '../constants/MovieRow';
import * as Animatable from 'react-native-animatable';
import Database from '../Database';
import { StatusBar } from 'react-native';
import { parse } from 'react-native-svg';
import { Button } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  SCLAlert,
  SCLAlertButton
} from 'react-native-scl-alert'
// import Button from '../components/Button';
import stripe from 'tipsi-stripe';
const db = new Database();

stripe.setOptions({
  publishableKey: 'pk_test_Wim6Z9pN58qzMYDDXvsPMrR0',
})
export class Cart extends PureComponent {
  static title = 'Card Form'

  state = {
    loading: false,
    token: null,
    success: null,
    modalVisible: false,
    show: false
  }

  handleOpen() {
    this.setState({ show: true })
  }

  handleClose = () => {
    this.setState({ show: false })
    this.props.navigation.navigate('TabScreentest');
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  constructor(props) {
    super(props)
    this.state = {
      movies: mockMoview.Search,
      dbs: '',
      _list_elimination: [],
      _pQty: 1,
      _pPrice: 5,
      _total: 0,
      tokenId: '',
      loading: true,
      showAlert: false
    }
    db.initDB().then((result) => {
      this.loadDbVarable(result);
    })
    this.loadDbVarable = this.loadDbVarable.bind(this);

  }
  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
    this.props.navigation.navigate('TabScreentest');
  };


  loadDbVarable(result) {
    this.setState({
      dbs: result,
    });
    this.getCartData();
    // this.viewListData();
  }
  getCartData() {
    let { pPrice, total = 0 } = this.props
    db.listCartData(this.state.dbs).then((results) => {
      result = results;
      var jsonTextValues = [];
      result.map((item, index) => {


        jsonTextValues.push({
          label: item.pId, value: item.pName
        });

      });
      // console.log("sdasdasda asd asd OOOOOOOOOOOO : " + jsonTextValues);
     

      
      


      for (var i = 0; i < result.length; i++) {
        pPrice = result[i].pPrice;
        total += parseFloat(pPrice);

      }

      this.setState({
        isLoading: false,
        _list_elimination: results,
        _total: total
      });
    }).catch((err) => {
      console.log(err);
    })

  }
  substracttem(id, price, qty) {
    var price1 = price * (qty - 1);
    let data = {
      pQty: this.state._pQty,
      _pPrice: price1,
      pId: id
    }
    db.subItemQty(this.state.dbs, data).then((result) => {
      this.getData();
    }).catch((err) => {
      console.log(err);
    })
  }
  addItem(id, price, qty) {
    var price1 = price * (qty + 1);
    let data = {
      pQty: this.state._pQty,
      _pPrice: price1,
      pId: id
    }

    db.addItemQty(this.state.dbs, data).then((result) => {
      this.getData();
    }).catch((err) => {
      console.log(err);
    })
  }
  deleteData(id) {

    db.deleteItem(this.state.dbs, id).then((result) => {

      this.getData();

    }).catch((err) => {
      console.log(err);
      this.setState = {

      }
    })
  }
  getData() {
    let { pPrice, total = 0 } = this.props
    db.listCartItems(this.state.dbs).then((data) => {
      let result = data;
      for (var i = 0; i < result.length; i++) {

        pPrice = result[i].pPrice;
        total += parseFloat(pPrice);
      }
      this.setState({
        isLoading: false,
        _list_elimination: data,
        _total: total
      });

    }).catch((err) => {
      console.log(err);
    })
  }
  async componentDidMount() {
    const response = await fetch('http://www.omdbapi.com/?apikey=8a00c4a5&s=Batman');
    const data = await response.json()
    this.setState({
      movies: data.Search
    })
  }
  doPayment = async () => {
    // Use firebase serve for local testing if you don't have a paid firebase account
    fetch('https://us-central1-flawless-lacing-307006.cloudfunctions.net/payWithStripe', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: (this.state._total) * 100,
        currency: "aud",
        token: this.state.tokenId,
        payment_method_types: ['card'],
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          success: responseJson.status == 'succeeded' ? true : false,
          response: responseJson
        })

        if (responseJson.status == 'succeeded') {
          // Alert.alert('success');
          // this.showAlert();
          console.log("&&&&&&&&&&%%%%%%%%%%%%%%%%%%%%% : " + this.state._list_elimination);

          db.deleteCartData(this.state.dbs).then((result) => {
  
          }).catch((err) => {
            console.log(err);
          
          })


          this.handleOpen();

          

        }
      })
      .catch((error) => {
        console.error(error);
      });;
  }
  cart_data = async () => {
    fetch('https://satasmemiy.tk/cart_data', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount:100,
        currency: "aud",
        token: 65000,
        payment_method_types: 'aaaaaaaaaaaaaaa',
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      
      })
      .catch((error) => {
        console.error(error);
      });;
  }

  handleCardPayPress = async () => {
    try {
      const token = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        // smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: 'Gunilla Haugeh',
            line1: 'Canary Place',
            line2: '3',
            city: 'Macon',
            state: 'Georgia',
            country: 'US',
            postalCode: '31217',
          },
        },
      })

      this.setState({
        tokenId: token.id,
        loading: false,
        token
      })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  renderItem = ({ item }) => {
    return (
      <Animatable.View animation="flipInX">
        <ListItem
          style={{
            paddingTop: 10,
            flexDirection: 'row',
            marginBottom: 15,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 10
            },
            shadowOpacity: 1,
            shadowRadius: 20,
            marginLeft: 0
          }}
        >

          <Left style={{ paddingLeft: 10 }}>
            <View >

              <Image source={{ uri: 'https://satasmemiy.tk/images/food/' + item.pImage }} style={{ width: 90, height: 80 }} />
            </View>
          </Left>
          <Body style={{ marginLeft: -60 }}>
            <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>{item.pName}</Text>

            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <View style={{ backgroundColor: 'gray', borderRadius: 10, marginTop: 2, width: 16, height: 16, alignItems: "center", justifyContent: 'center' }}>
                <Icon
                  type='font-awesome'
                  color='gray'
                  iconStyle={{ fontSize: 11 }}
                  name="dollar" color="white"
                  onPress={() => {

                  }}
                />
              </View>
              <Text style={styles.dateText, { marginLeft: 5, fontWeight: 'bold' }}>{item.pPrice} </Text>

            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Avatar
                rounded
                showEditButton
                size={26}
                icon={{ name: 'minus', type: 'font-awesome', color: '#2e7d32' }}
                containerStyle={{
                  shadowColor: 'rgba(0,0,0, 0.4)', // IOS
                  shadowOffset: { height: 3, width: 8 },
                  borderWidth: 1, borderColor: 'white', // IOS
                  shadowOpacity: 3, // IOS
                  shadowRadius: 5, elevation: 2,
                  backgroundColor: '#b2dfdb',
                }}
                onPress={() => this.substracttem(item.pId, item.pOnePrice, item.pQty)}
              />
              <Text style={{ color: 'gray', paddingLeft: 10, paddingEnd: 10, paddingTop: 5 }}>{item.pQty}</Text>
              <Avatar
                rounded
                showEditButton
                size={26}
                icon={{ name: 'plus', type: 'font-awesome', color: '#2e7d32' }}
                containerStyle={{
                  shadowColor: 'rgba(0,0,0, 0.4)', // IOS
                  shadowOffset: { height: 3, width: 8 },
                  borderWidth: 1, borderColor: 'white', // IOS
                  shadowOpacity: 3, // IOS
                  shadowRadius: 5, elevation: 2,
                  backgroundColor: '#b2dfdb',
                }}
                onPress={() => this.addItem(item.pId, item.pOnePrice, item.pQty)}
              />

            </View>

          </Body>
          <Right style={{ bottom: 30, }}>
            <View >
              <TouchableOpacity style={{ backgroundColor: '#ff4081', width: 70, paddingLeft: 10, paddingRight: 10, padding: 5, borderRadius: 20, alignItems: 'center', right: -10, }} onPress={() => {
                this.deleteData(item.pId);
              }}>
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Right>

        </ListItem>
      </Animatable.View>

    );

  };

  keyExtractor = (item, index) => index.toString()
  render() {
    const { loading, token, success, response } = this.state
    const { movies } = this.state

    if (success == true) {

    }
    const { modalVisible } = this.state;

    const { showAlert } = this.state;
    return (

      <SafeAreaView style={{ flex: 1 }}>
        <SCLAlert
          theme="success"
          show={this.state.show}
          title="Payment Succeddful"
          subtitle="Thank you! Payment is complete"
          onRequestClose={this.handleClose}
          cancellable={false}
        >
          <SCLAlertButton theme="success" onPress={this.handleClose}>Done</SCLAlertButton>
        </SCLAlert>

        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#fff" />
        <View style={{ flex: 1, }}>
          <View style={{ marginLeft: 20, marginTop: 30 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>My Order</Text>
          </View>
          <View style={styles.container}>

            {/* <AwesomeAlert
              show={showAlert}
              showProgress={false}
              title="Payment Succeddful"
              message="Thank you! Payment is complete"
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              // showCancelButton={true}
              showConfirmButton={true}
              // cancelText="No, cancel"
              confirmText="Done"
              confirmButtonColor="green"
              onCancelPressed={() => {
                this.hideAlert();
              }}
              onConfirmPressed={() => {
                this.hideAlert();
              }}
            /> */}
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>
              <FlatList
                contentContainerStyle={{
                  padding: 15,
                  paddingTop: StatusBar.currentHeight || 0
                }}
                ListEmptyComponent={this.emptyComponent}
                scrollEnabled={false}
                keyExtractor={this.keyExtractor}
                data={this.state._list_elimination}
                renderItem={this.renderItem}
              />

              <View>

                {/* <TouchableOpacity style={{ backgroundColor: 'yellow' }}
                  loading={loading}
                  onPress={this.cart_data}

                >
                  <Text style={{ color: 'white' }}>Parse sdata</Text>
                </TouchableOpacity>

                <Text ></Text> */}
              </View>
            </ScrollView>
            <View style={{ alignItems: 'flex-end', backgroundColor: 'white', borderRadius: 20 }}>

              <View style={{ padding: 10, flexDirection: 'row', }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ paddingLeft: 13, fontWeight: 'normal', fontSize: 15, }}>Total</Text>
                  <Text style={{ paddingLeft: 13, paddingRight: 13, fontWeight: 'bold', fontSize: 18, }}>US ${this.state._total}</Text>
                </View>

                {/* <TouchableOpacity style={styles.buttonstyle}
                  onPress={() => this.props.navigation.navigate('CardFormScreen')}
                >
                  <Text style={{ color: 'white' }}>check out</Text>
                </TouchableOpacity> */}
                {/* <Text style={styles.instruction}></Text> */}
                {
                  token == null ?
                    <TouchableOpacity style={styles.buttonstyle}
                      loading={loading}
                      onPress={this.handleCardPayPress}
                    // onPress={() => this.props.navigation.navigate('CardFormScreen')}
                    >
                      <Text style={{ color: 'white' }}>check out</Text>
                    </TouchableOpacity>
                    : <View


                    >
                      {token && (
                        // <Button
                        //   // loading={loading}
                        //   title="Pay"
                        //   width="100%"
                        //   titleStyle={{ color: 'white' }}
                        //   buttonStyle={{ borderRadius: 25, width: "100%", borderColor: 'white', color: 'white', }}
                        //   onPress={this.doPayment}

                        // >
                        // </Button>
                        <Button
                          loading={loading}
                          title='Pay'

                          titleStyle={{ color: 'white' }}
                          buttonStyle={styles.submitText, { backgroundColor: 'red', borderRadius: 15, width: "100%", borderColor: 'white', color: '#ccc', padding: 15, borderWidth: 1, paddingHorizontal: 82 }}
                          onPress={this.doPayment}


                        />
                        // <Button 
                        //   loading={loading}
                        //   // loading={loading}
                        //   onPress={this.doPayment}
                        // >
                        //   <Text style={{ color: 'white',fontSize:20 }}>Pay</Text>
                        // </Button>
                      )}
                      {success &&

                        <>

                          {/* <Text style={styles.instruction}>
                            Status: {response.status}
                          </Text> */}
                          {/* <Text style={styles.instruction}>
                            ID: {response.id}
                          </Text>
                          <Text style={styles.instruction}>
                            Amount: {response.amount}
                          </Text> */}

                        </>

                      }
                    </View>

                }



              </View>

            </View>
          </View>
        </View>

      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: '100%'
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50,
    backgroundColor: "red",

    borderRadius: 25,


    width: 110,
  }, buttonstyle: {
    backgroundColor: "#009984",
    borderRadius: 15,
    width: "76%",
    padding: 0,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',

  },
  paybuttonstyle: {
    backgroundColor: "red",
    borderRadius: 15,
    width: "70%",
    padding: 0,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',

  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  button: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: "#AEDEF4",
  },
  text: {
    color: '#fff',
    fontSize: 15
  }
})