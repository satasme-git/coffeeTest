import React, { Component } from 'react';
import { StatusBar, TextInput, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-elements';
import { IMAGE } from '../constants/image';
import { CustomHeader } from '../index';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export class SignIn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      TextInputEmail: '',
      TextInputPassword: '',
    }

  }
  InputUsers = () => {
    const { TextInputEmail } = this.state;
    const { TextInputPassword } = this.state;

    fetch('https://satasmemiy.tk/login', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "user_email": TextInputEmail,
        "user_password": TextInputPassword,
      })
    }).then((response) => response.json())
    .then((responseJson) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>iddd : " + ""+responseJson.id);
        
        // id = "";
        // user_email = "";
        // user_password = "";
        // this.setState({
        //     isLoading: false,
        // }, function () {
        //     // In this block you can do something with new state.
        // });
        if (responseJson !== "") {
            AsyncStorage.setItem('cus_id',""+responseJson.id).then(
              responseJson => {
                   this.props.navigation.navigate('CofeeDetails');
                }
            );
            AsyncStorage.setItem('cus_name', responseJson.name);
        } else {
        //     // Alert.alert("Login Fail");
        //     showMessage({
        //         message: "Login Fail",
        //         description: "Username or password incorrect" + `${responseJson}`,
        //         backgroundColor: 'red',

        //     })
        //     this.props.navigation.navigate('Login2')
        }
      }).catch((error) => {
        console.error(error);
      })



  }
  render() {
    return (

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" hidden={false} backgroundColor="#3B7457" />
        <View style={{ color: 'white',backgroundColor:'#3B7457' ,alignItems:'flex-end',paddingTop:10,paddingEnd:20}}>
                <Button
                  title="Skip"
                  type="outline"
                  titleStyle={{ color: 'white',fontWeight:'normal',fontSize:14 }}
                  buttonStyle={styles.submitText, { borderRadius: 25,width:80, borderColor: 'white', color: '#ccc', padding: 7, borderWidth: 0.5,marginBottom:0 }}
                  onPress={() => this.props.navigation.navigate('drawer')}

                />
        </View>
        <LinearGradient colors={['#3B7457', '#3B7457']} style={styles.gradient}>
          {/* <CustomHeader title="" isHome={false} bdcolor='#00897b' navigation={this.props.navigation} /> */}
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
              <View style={{
            flex: 1, justifyContent: 'space-between', paddingHorizontal: 15,
            paddingVertical: 0,
          }}>
            <View style={{ flex: 1, justifyContent: 'center', }}>
              <Text style={{ fontSize: 26, fontWeight: "bold", marginTop: 15, color: '#fff' }}>Welcome </Text>
              <Text style={{ fontSize: 14, color: '#fff', marginBottom: 25 }}>Use email to Login</Text>

            </View>
         
            <Animatable.View animation="flipInY" style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Image style={{ width: 160, height: 140, marginLeft: 0 }}
                source={IMAGE.ICON_MALOGO}
                resizeMode="contain"
              />
            </Animatable.View>
            <Animatable.View animation="fadeInUp">
              <Text style={{ color: '#fff', paddingVertical: 5, marginLeft: 2, marginTop: 30 }}>User Name :</Text>
              
              <View style={{alignItems: 'center',flexDirection: 'row', borderColor: 'gray', borderWidth: 0.5, borderRadius: 25, backgroundColor: '#F2F2F2', paddingLeft: 10 }}>
             <Icon name="email" size={20} style= {{color:'gray',paddingRight:5}} />
              <TextInput blurOnSubmit onChangeText={TextInputValue => this.setState({ TextInputEmail: TextInputValue })} style={{width:'85%'}} placeholder="Enter User Name" onEndEditing={this.clearFocus} autoFocus={false} />
             </View>
              <Text style={{ color: '#fff', paddingVertical: 5, marginLeft: 2, marginTop: 10 }}>Password :</Text>
              <View style={{alignItems: 'center',flexDirection: 'row', borderColor: 'gray', borderWidth: 0.5, borderRadius: 25, backgroundColor: '#F2F2F2', paddingLeft: 10 }}>
             <Icon name="briefcase" size={20} style= {{color:'gray',paddingRight:5}} />
              <TextInput blurOnSubmit secureTextEntry={true} onChangeText={TextInputValue => this.setState({ TextInputPassword: TextInputValue })}  style={{width:'85%'}}  placeholder="Enter Password" onEndEditing={this.clearFocus} autoFocus={false} />
</View>
              {/* <TouchableOpacity activeOpacity={1.0} ref="touchableOpacity" style={{ marginTop: 40, }} onPress={this.InputUsers}>

                <LinearGradient colors={['#fff', '#fff']}

                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0.9 }}

                  style={styles.linearGradient}>
                  <Text style={styles.buttonText}>
                    Sign in
  </Text>
                </LinearGradient>
              </TouchableOpacity> */}
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ paddingVertical: 25 ,color:'#fff'}}>Don't have account? 
                
                <Text style={{ color: 'yellow' }}  onPress={() => this.props.navigation.navigate('SignUp')}>  create new Account</Text> 
                </Text>
              
              </View>
            
              <Button
                  title="Sign In"
                  type="outline"
                  titleStyle={{ color: 'white' }}
                  buttonStyle={ { borderRadius: 25, borderColor: 'white', color: 'white', padding: 12, borderWidth: 1,marginBottom:20,marginTop:5 }}
                  onPress={this.InputUsers}

                />


            </Animatable.View>

         
          </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>

    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
  , linearGradient: {
    // flex: 1,
    // width: 280,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 14,
    color: 'white',
    backgroundColor: 'transparent',
  }, passwordContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 10,
  },
  inputStyle: {
    flex: 1,
  }, container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  }

});