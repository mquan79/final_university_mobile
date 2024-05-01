import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { logout } from '../store/Slice/authSlice';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
const UserScreen = () => {
    const dispatch = useDispatch();
    const logoutUser = () => {
        dispatch(logout())
        Toast.show({
          type: 'success',
          text1: 'Đăng xuất thành công',
          position: 'top',
        });
    }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>UserScreen</Text>
      <TouchableOpacity onPress={logoutUser}><Text>Logout</Text></TouchableOpacity>
    </View>
  )
}

export default UserScreen