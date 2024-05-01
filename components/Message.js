import { View, Text, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';
import ModalInfoUser from './ModalInfoUser';
import ModalViewFile from './ModalViewFile';
import { useSelector } from 'react-redux';
import Input from './Input';
import { Video } from 'expo-av';
import * as ENV from '../env';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;
const Message = ({ message, messages, fetchMessage }) => {
    const fileExtension = message.file?.split('.').pop().toLowerCase();
    const [open, setOpen] = useState(false)
    const [viewUser, setViewUser] = useState(null);
    const [openFile, setOpenFile] = useState(false);
    const [viewFile, setViewFile] = useState(null)
    const [numberView, setNumberView] = useState(0);
    const { data, loading } = useFetchData('users');
    const [replyMessage, setReplyMessage] = useState(null);
    const auth = useSelector((state) => state.auth.user);
    const [isView, setIsView] = useState(true)
    const getUserById = (id) => {
        return data?.find(e => e._id === id)
    }
    const messageCheck = messages?.filter((e) => e.replyMessageId === message._id)
    const [replyMess, setReplyMess] = useState([])
    useEffect(() => {
        const replyMess = messageCheck.slice(0, numberView)
        setReplyMess(replyMess)
        if (numberView >= messageCheck.length) {
            setIsView(false)
        }
    }, [messages, numberView])

    const handleDownload = (file) => {
        Linking.openURL(`${SERVER_URL}/uploads/${file}`);
    };

    const formattedTime = new Intl.DateTimeFormat('vi-VN', {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });

    const handleViewUser = (id) => {
        if (id === auth._id) {
            return;
        }
        setViewUser(id)
        setOpen(true)
    }

    const ReplyMessage = ({ message, messages, fetchMessage }) => {
        return (
            <View style={{ marginLeft: 10, borderLeftWidth: 5, borderColor: '#0950CD' }}>
                <Message message={message} messages={messages} fetchMessage={fetchMessage} />
            </View>
        )
    };

    const viewImageAndVideo = (file) => {
        setViewFile(file)
        setOpenFile(true)
    }


    return (
        <View key={message._id} style={{}}>
            <ModalViewFile open={openFile} close={() => setOpenFile(false)} file={viewFile}/>
            <ModalInfoUser open={open} close={() => setOpen(false)} idUser={viewUser} />
            <View style={{
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'space-between',
                marginVertical: 10,
                borderBottomWidth: 1,
                paddingBottom: 20,
                borderColor: 'grey'
            }}>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 5
                    }}>
                        {loading ? (
                            <>
                                <ActivityIndicator size={20} color="black" style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 5,
                                    margin: 5,
                                    borderWidth: 1,
                                }} />
                                <Text style={{ fontWeight: 'bold' }}>loading...</Text>
                            </>
                        ) : (
                            <TouchableOpacity
                                onPress={() => handleViewUser(message?.senderUser)}
                                style={{
                                    flexDirection: 'row',
                                }}>
                                <Image source={{ uri: `${SERVER_URL}/uploads/${getUserById(message.senderUser)?.avatar}` }} style={{ width: 50, height: 50, borderRadius: 5, margin: 5 }} />
                            </TouchableOpacity>

                        )}
                        <View>
                            < Text style={{ fontWeight: 'bold' }}>{getUserById(message.senderUser)?.name} </Text>
                            <Text style={{ flexWrap: 'wrap', padding: 5, width: 220 }}>{message?.content}</Text>
                        </View>

                    </View>
                    {message.file && (
                        <View>
                            {['jpg', 'png'].includes(fileExtension) ? (
                                <TouchableOpacity onPress={() => viewImageAndVideo(message.file)}>
                                    <Image source={{ uri: `${SERVER_URL}/uploads/${message.file}` }} style={{ width: 200, height: 200 }} resizeMode="contain" />
                                </TouchableOpacity>
                            ) : ['mp4'].includes(fileExtension) ? (
                                <View style={{ display: 'flex' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            onPress={() => viewImageAndVideo(message.file)}>
                                            <Video
                                                source={{ uri: `${SERVER_URL}/uploads/${message.file}` }}
                                                rate={1.0}
                                                volume={1.0}
                                                isMuted={true}
                                                resizeMode="contain"
                                                shouldPlay
                                                style={{ width: 200, height: 200, margin: 10 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{ marginBottom: 10, fontWeight: 'bold', color: 'grey' }}>
                                        {message.fileName && message.fileName.length > 20 ? message.fileName.substring(0, 20) + '..' : message.fileName}
                                    </Text>
                                </View>
                            ) : (
                                <View style={{ display: 'flex' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <TouchableOpacity style={{ width: 100, height: 120, borderWidth: 1, borderColor: 'grey', borderRadius: 5, margin: 10, overflow: 'hidden', alignItems: 'center', padding: 5, backgroundColor: '#f5f5f5', justifyContent: 'center' }} onPress={() => handleDownload(message.file)}>
                                            <Text numberOfLines={1}>
                                                <Icon name="file" size={30} color="black" />
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDownload(message.file)}>
                                            <Icon name="download" size={20} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{ marginBottom: 10, fontWeight: 'bold', color: 'grey' }}>
                                        {message.fileName && message.fileName.length > 20 ? message.fileName.substring(0, 20) + '..' : message.fileName}
                                    </Text>
                                </View>
                            )}

                        </View>
                    )
                    }
                    <Text>{formattedTime.format(new Date(message?.time))}</Text>
                </View>
                <View>
                    {!replyMessage && (
                        <TouchableOpacity onPress={() => setReplyMessage(message)}>
                            <Icon name="reply" size={20} color="black" style={{
                                padding: 10,
                                marginTop: 50,
                                marginLeft: 5,
                                borderWidth: 1,
                                borderRadius: 5,
                                marginRight: 20
                            }} />
                        </TouchableOpacity>
                    )}

                </View>
            </View>
            {replyMessage &&
                <View style={{
                    paddingLeft: 20,
                    paddingBottom: 10,
                    borderBottomWidth: 1,
                    paddingRight: 5
                }}>
                    <Input fetchMessage={fetchMessage} replyMess={replyMessage} close={() => setReplyMessage(null)} />
                </View>
            }
            {replyMess?.map((mess) => {
                return <ReplyMessage key={mess._id} message={mess} messages={messages} fetchMessage={fetchMessage} />
            })}

            {isView && <TouchableOpacity onPress={() => setNumberView(preNum => preNum + 3)} style={{ alignSelf: 'center' }}><Text style={{ fontWeight: 'bold', color: '#0950CD' }}>Xem thêm ({messageCheck.length - numberView})</Text></TouchableOpacity>
            }</View >
    )
}

export default Message