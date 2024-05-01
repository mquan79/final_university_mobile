import { View, Text, Modal, Button } from 'react-native'
import React from 'react'

const ModalCustom = ({open, close}) => {
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
                    <Text>This is a dialog</Text>
                    <Button title="Close" onPress={() => close()} />
                </View>
            </View>
        </Modal>
    )
}

export default ModalCustom