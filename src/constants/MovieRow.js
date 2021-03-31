import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {creatStore} from 'redux';
export default function MovieRow({ movie }) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: movie.Poster }}
                style={{ width: 200, height: 200 }}
            />


            <Text>{movie.Title}</Text>
            <Icon name="heart-outline" size={25} style={{ color: 'gray', padding: 11 }} />
        </View>
    )
}
const styles = StyleSheet.create({
    poster: {
        height: 100,
        width: 70,
        resizeMode: 'contain'
    },
    container: {
        padding: 5,
        flexDirection: 'row'
    }
})