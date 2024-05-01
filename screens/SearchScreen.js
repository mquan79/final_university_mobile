import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import useFetchData from '../hooks/useFetchData'
import { add } from '../hooks/apiCustomer'
import socket from '../hooks/socket'
const SearchScreen = () => {
    const [text, setText] = useState('');
    const { data, refetchData } = useFetchData('groups');
    const { data: member, refetchData: fetchMember } = useFetchData('groupmembers')
    const { data: user } = useFetchData('users');
    const auth = useSelector((state) => state.auth.user)
    const [groups, setGroups] = useState([]);
    const getUserById = (id) => {
        return user?.find(e => e._id === id)
    }
    useEffect(() => {
        if (text.trim() === '') {
            setGroups([])

        }
        if (data && text.trim() !== '') {
            const filteredGroups = data.filter(e => e.nameGroup.toLowerCase().replace(/[\u0300-\u036f]/g, '').includes(text.toLowerCase().replace(/[\u0300-\u036f]/g, '')));
            setGroups(filteredGroups);
        }
    }, [data, text]);

    useEffect(() => {
    }, [member])

    const handleConfirm = (id) => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn tham gia channel này không?',
            [
                {
                    text: 'Hủy',
                    onPress: () => console.log('Hủy'),
                    style: 'cancel',
                },
                {
                    text: 'Đồng ý',
                    onPress: () => handleJoinGroup(id),
                },
            ],
            { cancelable: false }
        );
    };

    const handleJoinGroup = async (id) => {
        await add({
            idGroup: id,
            idMember: auth._id
        }, 'groupmembers')
        refetchData();
        fetchMember();
        socket.emit('Fetch member')
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5', width: '100%', paddingTop: 50 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SEARCH CHANNEL</Text>
            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    style={{
                        height: 40,
                        width: 400,
                        borderWidth: 1,
                        margin: 5,
                        padding: 10,
                    }}
                    placeholder='Tìm kiếm...'
                    value={text}
                    onChangeText={(value) => setText(value)}
                />
                {/* <TouchableOpacity
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        margin: 5,
                        borderRadius: 5,
                        backgroundColor: '#0950cd'
                    }}
                    onPress={handleSearch}
                >
                    <Text style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'white'
                    }}>SEARCH</Text>
                </TouchableOpacity> */}
            </View>
            <ScrollView style={{}}>
                {groups.map((group) => {
                    const find = member.find(e => e.idMember === auth?._id && e.idGroup === group._id)
                    return (
                        !find &&
                        <View key={group._id} style={{ borderWidth: 1, flexDirection: 'row', padding: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{group.nameGroup}</Text>
                                <Text style={{ fontSize: 10 }}>HOST: {getUserById(group.hostGroup)?.name}</Text>
                            </View>

                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    padding: 5,
                                    backgroundColor: '#0950cd'
                                }}
                                onPress={() => handleConfirm(group._id)}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>JOIN</Text></TouchableOpacity>
                        </View>

                    )
                })}
            </ScrollView>
        </View >
    );
}

export default SearchScreen;
