import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ImagePickerComponent({ setData, isSquare, setType }) {

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: isSquare,
            aspect: [3, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setType(result.assets[0].type)
            setData(result.assets[0].uri)
        }
    };
    return (

        <View>
            <TouchableOpacity onPress={pickImage}>
                <Icon name="image" size={20} color="black" style={{
                    padding: 10,
                    marginTop: 5,
                    marginLeft: 5,
                    borderWidth: 1,
                    borderRadius: 5
                }} />
            </TouchableOpacity>
        </View>
    );
}
