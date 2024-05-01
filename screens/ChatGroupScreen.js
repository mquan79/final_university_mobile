import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react';
import useFetchData from '../hooks/useFetchData';
import { setRoom } from '../store/Slice/roomSlice';
import { useDispatch, useSelector } from 'react-redux';
import { updated } from '../hooks/apiCustomer';
import ListUser from './ListUser';
import ModalCreateThreads from '../components/ModalCreateThreads'
import socket from '../hooks/socket'
const ChatGroupScreen = ({ navigation, messages, fetchData }) => {
    const { data: topic, loading: loadingTopic, error: errorTopic, refetchData: fetchTopic } = useFetchData('topicgroups');
    const user = useSelector((state) => state.auth.user);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [topics, setTopic] = useState([]);
    const dispatch = useDispatch();
    const idGroup = useSelector((state) => state.room.group)
    const [stateA, setStateA] = useState('channel');
    const [open, setOpen] = useState(false)
    useEffect(() => {
        if (!loadingTopic) {
            setLoading(false)
        }

        if (errorTopic) {
            setError(error)
        }
    }, [loadingTopic, errorTopic]);

    useEffect(() => {
        socket.on('Create threads', fetchTopic)
        return () => {
            socket.on('Create threads', fetchTopic)
        }
    })

    useEffect(() => {
        if (!loading && !error && idGroup) {
            const topics = topic?.filter((e) => e.idGroup === idGroup)
            setTopic(topics)
        }
    }, [loading, error, idGroup, topic])

    const handleChat = async (topic) => {
        setLoading(true);
        dispatch(setRoom(topic))
        try {
            navigation.navigate('ChatGroup')
            const messageGroup = messages && messages.filter((message) =>
                message.receiverGroup === topic._id &&
                !message.send.find(e => e.userId === user._id)
            );

            await Promise.all(messageGroup.map(async (message) => {
                const updatedSend = [...message.send, { userId: user._id }];
                await updated(message._id, { send: updatedSend }, 'messages');
            }));

        } catch (error) {
            console.error("Error handling chat:", error);
            setError(true);
        } finally {
            fetchData();
            setLoading(false);

        }
    }


    return (
        <View style={{ flex: 1, paddingTop: 70, backgroundColor: '#0950CD', width: 330 }}>
            <ModalCreateThreads open={open} close={() => setOpen(false)} fetchData={fetchTopic} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => setStateA('member')}
                    style={{
                        width: '50%',
                        height: 40,
                        marginBottom: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: stateA !== 'channel' ? '#fbb700' : 'white'
                    }}>
                    <Text style={{
                        fontWeight: 'bold',
                    }}>MEMBERS</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setStateA('channel')}
                    style={{
                        width: '50%',
                        height: 40,
                        marginBottom: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: stateA === 'channel' ? '#fbb700' : 'white'
                    }}>
                    <Text style={{
                        fontWeight: 'bold',
                    }}>THREADS</Text>
                </TouchableOpacity>
            </View>
            {loading || !idGroup ? (
                <ActivityIndicator size="large" color="grey" style={{ marginTop: 20 }} />
            ) : error ? (
                <View></View>
            ) : (
                stateA === 'channel' ? (
                    <>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View></View>
                            <TouchableOpacity onPress={() => setOpen(true)}>
                                <Text style={{
                                    fontSize: 30,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    marginBottom: 10
                                }}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ paddingTop: 10}}>
                            {
                                topics && topics.map((topic) => {
                                    var messageGroup = messages && messages.filter((message) =>
                                        message.receiverGroup === topic._id &&
                                        !message.send.find(e => e.userId === user._id))
                                    return (
                                        <TouchableOpacity
                                            key={topic._id}
                                            onPress={() => handleChat(topic)}
                                            style={{
                                                width: 330,
                                                borderWidth: 1,
                                                padding: 10,
                                                marginBottom: 10,
                                                borderColor: 'white'
                                            }}
                                        >
                                            {messageGroup?.length > 0 &&
                                                <View style={{
                                                    backgroundColor: 'red',
                                                    height: 20,
                                                    width: 20,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: '50%',
                                                    position: 'absolute',
                                                    top: -10,
                                                    right: 0,
                                                }}>

                                                    <Text style={{
                                                        color: 'white',
                                                        fontSize: 10,
                                                        fontWeight: 'bold'
                                                    }}>{messageGroup?.length}</Text>
                                                </View>
                                            }

                                            <Text style={{
                                                fontSize: 13,
                                                fontWeight: 'bold',
                                                color: 'white'
                                            }}># {topic.nameTopicGroup}</Text>
                                        </TouchableOpacity>
                                    )

                                })
                            }
                        </ScrollView>

                    </>
                ) : (
                    <View>
                        <ListUser />
                    </View>
                )
            )}

        </View>
    )
}

export default ChatGroupScreen