import React, { Component } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { CustomHeader } from '../index';
import { Avatar } from 'react-native-elements';
import QRCode from 'react-native-qrcode-generator';
import AsyncStorage from '@react-native-community/async-storage';
export class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      dataSource: '',
      _id: '',
      _name: '',
      _email: '',
      _mobile_no: '',
      _points: '',
      _cus_id:''
    };
  }
  state = {
    text: 'https://facebook.github.io/react-native/',
  };
  async componentDidMount() {
    const myArray = await AsyncStorage.getItem('cus_id');
    fetch('https://satasmemiy.tk/api/profile/' + myArray, {
      method: 'post',
      // header: {
      //   'Accept': 'application/json',
      //   'Content-Type': 'application/json',
      // },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": 2,


      })


    }).then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          _id: responseJson.id,
          _name: responseJson.name,
          _email: responseJson.email,
          _mobile_no: responseJson.mobile_no,
          text: responseJson.mobile_no,
          _points: responseJson.points,
          _cus_id:myArray
        });


      }).catch((error) => {
        console.error(error);
      })

  }

   refresh = () => {
   
   // const myArray = await AsyncStorage.getItem('cus_id');
  
    fetch('https://satasmemiy.tk/api/profile/' + this.state._cus_id, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": 1,


      })


    }).then((response) => response.json())
      .then((responseJson) => {

         this.setState({
          isLoading: false,
          _id: responseJson.id,
          _name: responseJson.name,
          _email: responseJson.email,
          _mobile_no: responseJson.mobile_no,
          text: responseJson.mobile_no,
          _points: responseJson.points
        });


      }).catch((error) => {
        console.error(error);
      })

  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader title="" isHome={true} bdcolor='#3B7457' bgcolor='#3B7457' navigation={this.props.navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.triangleCorner}>
            {/* <View style={{ backgroundColor: '#009688', height: 100, zIndex: -1 }}> */}
            {/* <View style={{ marginTop: 0, marginLeft: 20 }}>

            </View> */}
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bottom: 140 }}>

            <Avatar
              rounded
              showEditButton
              size={150}
              source={(require('../images/profiled.png'))
              }
              containerStyle={{
                margin: 10, shadowColor: 'rgba(0,0,0, .4)', // IOS
                shadowOffset: { height: 3, width: 8 }, borderWidth: 6, borderColor: 'white', // IOS
                shadowOpacity: 3, // IOS
                shadowRadius: 5, elevation: 8
              }}

            />
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{this.state._name}</Text>
            <Text style={{ color: 'gray' }}>{this.state._email}</Text>

            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={{ fontSize: 45, fontWeight: 'bold', color: 'red' }}>{this.state._points}</Text>
                <Text style={{ fontSize: 16 }}>Total Points</Text>
              </View>
            </View>
            <View style={{ paddingTop: 30 }}>


              <QRCode
                value={"" + this.state._mobile_no}
                size={200}
                bgColor='black'
                fgColor='white' />
            </View>
            <TouchableOpacity style={{ marginTop: 20 }}
             onPress={this.refresh}

            >
              <Text>refresh</Text>

            </TouchableOpacity>
          </View>

        </ScrollView>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9100',


    flexDirection: 'row',
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,

    elevation: 2,
  }, userInfoSection: {
    paddingLeft: 20,
  },
  header: {

    justifyContent: 'center',
    // alignItems: 'center',

    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    height: 180

  },
  title: {
    color: '#85375a',
    fontWeight: 'normal',
    fontSize: 18
  }, text: {
    color: 'gray',
    marginTop: 5
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 30
  }, footer: {
    marginTop: 20,
    flex: 1,
    backgroundColor: 'white',

    paddingHorizontal: 10,
    // paddingVertical: 30,
    height: 500

  }, container: {

  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  description: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  photo: {
    height: 50,
    width: 50,
  }, buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 13,
    color: '#ffffff',
    backgroundColor: 'transparent',
  }, circleGradient: {
    margin: 1,
    backgroundColor: "white",
    borderRadius: 5
  }, linearGradient: {

    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  }, triangleCorner: {
    // position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    zIndex: -1,
    borderRightWidth: 600,
    borderTopWidth: 170,
    borderRightColor: 'transparent',
    borderTopColor: '#3B7457'
  }


});