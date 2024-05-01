import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { add } from '../hooks/apiCustomer';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import socket from '../hooks/socket'
const ModalCreateChannel = ({ open, close, fetchData }) => {
    const [inputValue, setInputValue] = useState('');
    const user = useSelector((state) => state.auth.user);
    const handleSubmit = async() => {
        if(inputValue.trim() === '') {
            Toast.show({
                type: 'error',
                text1: 'Vui lòng nhập tên channel!!',
                position: 'top',
                visibilityTime: 1000,
                autoHide: true
              });
            return;
        }
        try{
            const res = await add({
                nameGroup: inputValue.trim(),
                hostGroup: user._id
              }, 'groups')
        
              await add({
                idGroup: res._id,
                nameTopicGroup: 'Chat chung',
                hostTopic: user._id,
              }, 'topicgroups');
        
              await add({
                idGroup: res._id,
                idMember: user._id
              }, 'groupmembers')

              Toast.show({
                type: 'success',
                text1: 'Tạo Channel thành công!!',
                position: 'top',
                visibilityTime: 1000,
                autoHide: true
              });

        } catch (e) {
            throw e
        } finally {
            socket.emit('Create threads')
            setInputValue('')
            fetchData();
            close();
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={open}
            onRequestClose={() => {
                close();
            }}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 50, borderRadius: 10 }}>
                    <Text>CREATE CHANNEL</Text>
                    <TextInput
                        style={{ height: 40, borderWidth: 1, marginVertical: 10 }}
                        placeholder="Nhập tên channel.."
                        onChangeText={text => setInputValue(text)}
                        value={inputValue}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={handleSubmit}
                            style={{
                                backgroundColor: '#2a61c2',
                                padding: 10,
                                margin: 5,
                                width: 80,
                                alignItems: 'center'
                            }}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 10,
                                    fontWeight: 'bold'
                                }}>CREATE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => close()}
                            style={{
                                backgroundColor: 'white',
                                padding: 10,
                                margin: 5,
                                borderWidth: 1,
                                width: 80,
                                alignItems: 'center'
                            }}>
                            <Text style={{
                                fontSize: 10,
                                fontWeight: 'bold'
                            }}>CLOSE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default ModalCreateChannel;
