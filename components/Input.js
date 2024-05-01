import { View, TouchableOpacity, TextInput, ActivityIndicator, Image, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import { add } from '../hooks/apiCustomer';
import { useSelector } from 'react-redux';
import * as DocumentPicker from 'expo-document-picker';
import { Video } from 'expo-av';
import ImagePickerComponent from './ImagePickerComponent';
import socket from '../hooks/socket'
const Input = ({ fetchMessage, replyMess, close }) => {
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [type, setType] = useState(null)
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const group = useSelector((state) => state.room.group)
    const room = useSelector((state) => state.room.room);
    const pickDocument = async () => {
        try {
            const picker = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: false
            });

            const { uri, name } = picker.assets[0];
            setFile(uri);
            setFileName(name);
            setType(name?.split('.').pop().toLowerCase());
        } catch (error) {
            console.log('Error picking document:', error);
        }
    };

    const handleSend = async () => {
        let messageFormat = {};
        setLoading(true)
        if (content === '' && file === '') {
            return;
        }
        const messageContent = content.trim();
        try {
            messageFormat = {
                senderUser: user._id,
                receiverGroup: room._id,
                receiverChannel: group,
                send: [
                    {
                        userId: user._id
                    }
                ],
                content: messageContent,
                file: file && `${Date.now()}.${type === 'image' ? 'png' : type === 'video' ? 'mp4' : type}`,
                fileName: file && fileName && fileName,
                time: new Date(),
                replyMessageId: replyMess?._id,
            };

            if (file && fileName) {
                const formData = new FormData();
                formData.append('file', {
                    uri: file,
                    type: type,
                    name: messageFormat.file,
                });
                console.log(file, type, formData)
                await add(formData, 'upload');
            } else if (file && !fileName) {
                const formData = new FormData();
                formData.append('file', {
                    uri: file,
                    type: 'image/jpeg',
                    name: messageFormat.file,
                });
                await add(formData, 'upload');

            }

            await add(messageFormat, 'messages');
        } catch (e) {
            throw e
        } finally {
            fetchMessage();
            setLoading(false)
        }
        setFile(null)
        setFileName(null)
        setType(null)
        setContent('');
        close();
        socket.emit('Message', messageFormat);
    }

    const handleCloseFile = () => {
        setFile(null)
        setFileName(null)
        setType(null)
    }
    // const fileExtension = file?.split('.').pop().toLowerCase();
    // console.log(fileExtension)
    return (
        <>
            {file && <View style={{ flexDirection: 'row' }}>
                {type === 'image' ? (
                    <Image source={{ uri: file }} style={{ width: 100, height: 100 }} resizeMode="contain" />
                ) : type === 'video' ? (
                    <Video
                        source={{ uri: file }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={true}
                        resizeMode="contain"
                        shouldPlay
                        style={{ width: 100, height: 100 }}
                    />
                ) : (
                    <View style={{ display: 'flex' }}>
                        <View style={{ width: 80, height: 100, borderWidth: 1, borderColor: 'grey', borderRadius: 5, margin: 10, overflow: 'hidden', alignItems: 'center', padding: 5, backgroundColor: '#f5f5f5', justifyContent: 'center' }}>
                            <Text numberOfLines={1}>
                                <Icon name="file" size={30} color="black" />
                            </Text>
                        </View>
                        <Text style={{ marginBottom: 10, fontWeight: 'bold', color: 'grey' }}>
                            {fileName && fileName.length > 10 ? fileName.substring(0, 10) + '..' : fileName}
                        </Text>
                    </View>
                )}<TouchableOpacity onPress={handleCloseFile}><Text style={{ fontSize: 20, fontWeight: 'bold' }}>X</Text></TouchableOpacity></View>}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <TextInput
                        placeholder='Nhập tin nhắn...'
                        onChangeText={(value) => setContent(value)}
                        value={content}
                        style={{
                            borderWidth: 1,
                            borderColor: 'black',
                            height: 40,
                            padding: 10,
                            marginTop: 10,
                            marginLeft: 5,
                            borderRadius: 5
                        }} />
                </View>
                <TouchableOpacity onPress={pickDocument}>
                    <Icon name="file" size={20} color="black" style={{
                        padding: 10,
                        marginTop: 5,
                        marginLeft: 5,
                        borderWidth: 1,
                        borderRadius: 5
                    }} />
                </TouchableOpacity>
                <ImagePickerComponent setData={setFile} isSquare={false} setType={setType} />
                {loading ? (
                    <TouchableOpacity>
                        <ActivityIndicator size={20} color="black" style={{
                            padding: 10,
                            marginTop: 5,
                            marginLeft: 5,
                            borderWidth: 1,
                            borderRadius: 5
                        }} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleSend}>
                        <Icon name="send" size={20} color="black" style={{
                            padding: 10,
                            marginTop: 5,
                            marginLeft: 5,
                            borderWidth: 1,
                            borderRadius: 5
                        }} />
                    </TouchableOpacity>
                )}
            </View>
        </>
    )
}

export default Input