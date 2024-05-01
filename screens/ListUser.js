import { View, Text, ActivityIndicator, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import useFetchData from '../hooks/useFetchData';
import ModalInfoUser from '../components/ModalInfoUser';
import socket from '../hooks/socket'
import * as ENV from '../env';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;
const ListUser = () => {
    const idGroup = useSelector((state) => state.room.group)
    const auth = useSelector(state => state.auth.user)
    const { data: member, loading: loadingMember, error: errorMember, refetchData: fetchMember  } = useFetchData('groupmembers');
    const { data: user } = useFetchData('users');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false)
    const [members, setMembers] = useState([])
    const [open, setOpen] = useState(false)
    const [viewUser, setViewUser] = useState(null)
    const getUserById = (id) => {
        return user?.find(e => e._id === id)
    }

    useEffect(() => {
        socket.on('Fetch member', fetchMember)
        return () => {
            socket.off('Fetch member', fetchMember)  
        }
    })
    useEffect(() => {
        if (!loadingMember) {
            setLoading(false)
        }

        if (errorMember) {
            setError(true)
        }

        if (!error && !loading) {
            const group = member?.filter(e => e.idGroup === idGroup && e.idMember !== auth?._id)
            setMembers(group)
        }
    }, [loadingMember, errorMember, idGroup]);

    const handleChoiseUser = (id) => {
        setViewUser(id)
        setOpen(true)
    }
    return (
        <View style={{}}>
            <ModalInfoUser open={open} close={() => setOpen(false)} idUser={viewUser}/>
            {loading ? (
                <ActivityIndicator size="large" color="grey" style={{ marginTop: 20 }} />
            ) : error ? (
                <View></View>
            ) : (
                <ScrollView>
                    {members?.map((mem) => {
                        return (
                            <TouchableOpacity onPress={() => handleChoiseUser(mem.idMember)} key={mem._id} 
                            style={{ 
                                flexDirection: 'row', 
                                borderRadius: 5,
                                alignItems: 'center', 
                                backgroundColor: 'white',
                                margin: 5
                                }}>
                                <Image source={{
                                    uri: `${SERVER_URL}/uploads/${getUserById(mem.idMember)?.avatar ? getUserById(mem.idMember).avatar : 'user.png'}`
                                }} style={{ width: 50, height: 50, borderRadius: 180, margin: 5 }} />
                                <Text >{getUserById(mem.idMember)?.name}</Text>
                            </TouchableOpacity>

                        )
                    })}
                </ScrollView>
            )
            }

        </View >
    )
}

export default ListUser