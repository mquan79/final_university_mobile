import { View, Text, Modal, Button, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import useFetchData from '../hooks/useFetchData'
import * as ENV from '../env';
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import { add, updated, deleted } from '../hooks/apiCustomer';
import moment from 'moment';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;
const ModalInfoUser = ({ open, close, idUser }) => {
    const { data: users } = useFetchData('users');
    const { data: friend, refetchData: fetchFriend } = useFetchData('friends');
    const [stateFriend, setStateFriend] = useState(null);
    const user = useSelector((state) => state.auth.user)
    const getUserById = () => {
        return users?.find(e => e._id === idUser)
    }

    const handleAddFriend = async () => {
        const data = {
            idUser1: user._id,
            idUser2: idUser,
            status: 'wait'
        }

        await add(data, 'friends');
        fetchFriend();
        close()
    }

    const handleAcceptFriend = async () => {
        const stateWait = friend.find(e => e.idUser1 === idUser && e.idUser2 === user?._id && e.status === 'wait');
        const dataUpdate = {
            status: 'friend'
        }

        await updated(stateWait._id, dataUpdate, 'friends')
        fetchFriend()
        close()
    }

    const handleUnAcceptFriend = async () => {
        const stateWait = friend.find(e => e.idUser1 === idUser && e.idUser2 === user?._id && e.status === 'wait');
        await deleted(stateWait._id, 'friends')
        fetchFriend();
        close()
    }


    const handleDeleteAddFriend = async () => {
        const stateNotWait = friend.find(e => e.idUser2 === idUser && e.idUser1 === user?._id && e.status === 'wait');
        await deleted(stateNotWait._id, 'friends')
        fetchFriend();
        close()
    }

    useEffect(() => {
        if (friend && users && idUser) {
            const stateWait = friend.find(e => e.idUser1 === idUser && e.idUser2 === user?._id && e.status === 'wait');
            const stateFriend = friend.find(e => (e.idUser1 === idUser && e.idUser2 === user?._id || e.idUser2 === idUser && e.idUser1 === user?._id) && e.status === 'friend');
            const stateNotWait = friend.find(e => e.idUser2 === idUser && e.idUser1 === user?._id && e.status === 'wait');
            if (stateWait) {
                setStateFriend('wait');
            } else if (stateFriend) {
                setStateFriend('friend');
            } else if (stateNotWait) {
                setStateFriend('waiting');
            } else {
                setStateFriend('no');
            }
        }
    }, [friend, users, idUser]);


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
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
                    <Image source={{
                        uri: `${SERVER_URL}/uploads/${getUserById(idUser)?.avatar ? getUserById(idUser).avatar : 'user.png'}`

                    }} style={{ width: 50, height: 50, borderRadius: 180, margin: 5 }} />
                    <View>
                        <Text style={{
                            margin: 3,
                            fontWeight: 'bold'
                        }}>Tên: {getUserById(idUser)?.name}</Text>
                        <Text style={{
                            margin: 3,
                            fontWeight: 'bold'
                        }}>Ngày sinh{moment(getUserById(idUser)?.birthday).format('DD/MM/YYYY')}</Text>
                        <Text style={{
                            margin: 3,
                            fontWeight: 'bold'
                        }}>Ngày tham gia: {moment(getUserById(idUser)?.time).format('DD/MM/YYYY')}</Text>
                        <Text style={{
                            margin: 3,
                            fontWeight: 'bold'
                        }}>ID: {idUser}</Text>
                    </View>

                    {stateFriend === 'friend' &&
                        <Text style={{
                            color: 'green',
                            fontWeight: 'bold'
                        }}><Icon name="check" size={16} color="green" /> Đã kết bạn</Text>
                    }

                    <View style={{ flexDirection: 'row' }}>
                        {stateFriend === 'no' ? (
                            <TouchableOpacity title="Close" onPress={handleAddFriend}
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
                                    }}>Kết bạn</Text></TouchableOpacity>
                        ) : stateFriend === 'wait' ? (
                            <>
                                <TouchableOpacity title="Close" onPress={handleAcceptFriend}
                                    style={{
                                        backgroundColor: 'green',
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
                                        }}><Icon name="check" size={10} color="white" /> Đồng ý</Text>
                                </TouchableOpacity>
                                <TouchableOpacity title="Close" onPress={handleUnAcceptFriend}
                                    style={{
                                        backgroundColor: '#f66',
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
                                        }}>X Từ chối</Text>
                                </TouchableOpacity>
                            </>
                        ) : stateFriend === 'waiting' ? (
                            <TouchableOpacity title="Close" onPress={handleDeleteAddFriend}
                                style={{
                                    backgroundColor: '#f66',
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
                                    }}>X Hủy</Text></TouchableOpacity>
                        ) : (
                            <></>
                        )}

                        <TouchableOpacity title="Close" onPress={() => close()}
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
                            }}>Đóng</Text></TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export default ModalInfoUser