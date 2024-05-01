import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import useFetchData from '../hooks/useFetchData';
import Message from '../components/Message';
import Input from '../components/Input';
import socket from '../hooks/socket'

const GroupChat = ({ navigation }) => {
    const room = useSelector((state) => state.room.room);
    const { data: messageData, loading: loadingMessage, error: errorMessage, refetchData: fetchMessage } = useFetchData('messages');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const scrollViewRef = useRef(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchMessage(); 
            } catch (error) {
                throw error
            }
        };
    
        socket.on('Message', fetchData);
        return () => {
            socket.off('Message', fetchData);
        };
    }, []);
    

    const dataCheck = useRef(messages)
    useEffect(() => {
        if (!loadingMessage) {
            setLoading(false);
        }

        if (errorMessage) {
            setError(true);
        }
    }, [loadingMessage, errorMessage]);

    useEffect(() => {
        if (!loading && !error && room) {
            const filteredMessages = messageData.filter((mess) => mess.receiverGroup === room._id && !mess.replyMessageId);
            setMessages(filteredMessages);
        }
    }, [loading, error, room, messageData]);

    useEffect(() => {
        const scrollToEnd = () => {
            if (scrollViewRef.current && JSON.stringify(messages) !== JSON.stringify(dataCheck.current)) {
                scrollViewRef.current.scrollToEnd({ animated: true });
                dataCheck.current = messages;
            }
        };
    
        scrollToEnd();
    }, [messages]);



    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={{
                    backgroundColor: '#f5f5f5',
                    flexDirection: 'row',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: 20,
                    borderWidth: 1
                }}>
                    <Text style={{ marginTop: 60 }}># {room && room.nameTopicGroup}</Text>
                    <TouchableOpacity>
                        <Icon name="video-camera" size={20} color="black" style={{
                            padding: 10,
                            marginTop: 50,
                            marginLeft: 5,
                            borderWidth: 1,
                            borderRadius: 5,
                            marginRight: 20
                        }} />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="grey" style={{ marginTop: 20 }} />
                ) : error ? (
                    <View></View>
                ) : (
                    <ScrollView
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                        style={{ flex: 1 }}
                    >
                        {messages.map((message) => {
                            return (
                                <Message key={message._id} message={message} messages={messageData} fetchMessage={fetchMessage}/>

                            );
                        })}
                    </ScrollView>

                )}
                <Input fetchMessage={fetchMessage} close={() => console.log('')} />
            </View>
        </KeyboardAvoidingView >
    );
};

export default GroupChat;
