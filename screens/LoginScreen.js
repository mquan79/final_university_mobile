import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { loginRequest, loginSuccess, loginFailure } from '../store/Slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import useFetchData from '../hooks/useFetchData'
import bcrypt from 'bcryptjs';
import Toast from 'react-native-toast-message';
const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.auth.loading);
    const { data, loading, error } = useFetchData('users');
    const handleLogin = async() => {
        dispatch(loginRequest());
        const user = data.find(e => e.username === username)
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                try {
                    dispatch(loginSuccess(user));
                    Toast.show({
                        type: 'success',
                        text1: 'Đăng nhập thành công',
                        position: 'top',
                        visibilityTime: 1000,
                        autoHide: true
                      });
                } catch (e) {
                    dispatch(loginFailure(e));
                }
            } else {
                dispatch(loginFailure('ERROR'));
                Toast.show({
                    type: 'error',
                    text1: 'Sai mật khẩu',
                    position: 'top',
                    visibilityTime: 1000,
                    autoHide: true
                  });
            }
        } else {
            dispatch(loginFailure('ERROR'));
            Toast.show({
                type: 'error',
                text1: 'Tài khoản không tồn tại',
                position: 'top',
                visibilityTime: 1000,
                autoHide: true
              });
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {isLoading || loading ? (
                <ActivityIndicator size="large" color="grey" style={{ marginTop: 20 }} />
            ) : error ? (
                <View>
                    <Text>Error</Text>
                </View>
            ) : (
                <View>
                    <Text>LoginScreen</Text>
                    <TextInput
                        value={username}
                        onChangeText={(value) => setUsername(value)}
                        placeholder="Username.."
                        style={{ borderWidth: 1, borderColor: 'black', width: 200, height: 40, padding: 10 }}
                    />
                    <TextInput
                        value={password}
                        onChangeText={(value) => setPassword(value)}
                        placeholder="Password.."
                        secureTextEntry={true}
                        style={{ borderWidth: 1, borderColor: 'black', width: 200, height: 40, padding: 10, marginTop: 10 }}
                    />
                    <TouchableOpacity onPress={handleLogin} style={{ marginTop: 20 }}>
                        <Text style={{ padding: 10, borderRadius: 5 }}>Login</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default LoginScreen;
