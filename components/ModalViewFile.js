import { View, Text, Modal, Button, Image, ActivityIndicator } from 'react-native'
import { Video } from 'expo-av';
import * as ENV from '../env';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';

const SERVER_URL = `http://${ENV.env.ipv4}:5000`;
const ModalViewFile = ({ open, close, file }) => {
    const fileExtension = file?.split('.').pop().toLowerCase();
    const [loading, setLoading] = useState(false)
    const downloadImage = async () => {
        setLoading(true)
        try {
            const fileName = `${Date.now()}.png`;
            const fileUri = FileSystem.documentDirectory + fileName;

            const downloadObject = FileSystem.createDownloadResumable(`${SERVER_URL}/uploads/${file}`, fileUri);
            const response = await downloadObject.downloadAsync();

            if (response.status === 200) {
                console.log('Tải ảnh thành công:', response.uri);
                return response.uri;
            } else {
                console.log('Lỗi khi tải ảnh:', response);
                return null;
            }
        } catch (error) {
            console.log('Lỗi khi tải ảnh:', error);
            return null;
        } finally {
            setLoading(false)
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
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    {loading ? (
                        <View style={{ width: 360, height: 700, justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color="grey" style={{ marginTop: 20 }} />
                        </View>
                    ) : (
                        ['jpg', 'png'].includes(fileExtension) ? (
                            <Image source={{ uri: `${SERVER_URL}/uploads/${file}` }} style={{ width: 360, height: 700 }} resizeMode="contain" />
                        ) : ['mp4'].includes(fileExtension) ? (
                            <View style={{ display: 'flex' }}>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Video
                                        source={{ uri: `${SERVER_URL}/uploads/${file}` }}
                                        rate={1.0}
                                        volume={1.0}
                                        isMuted={true}
                                        resizeMode="contain"
                                        shouldPlay
                                        style={{ width: 360, height: 700 }}
                                    />
                                </View>
                            </View>
                        ) : null
                    )}

                    <Button title="Đóng" onPress={() => close()} />
                </View>
            </View>
        </Modal>
    )
}

export default ModalViewFile