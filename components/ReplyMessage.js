import { View, Text } from 'react-native'
import React from 'react'
import Message from './Message'
const ReplyMessage = ({ message, messages, fetchMessage }) => {
    return (
        <View style={{ marginLeft: 10, borderLeftWidth: 5, borderColor: '#0950CD' }}>
            <Message message={message} messages={messages} fetchMessage={fetchMessage}/>
        </View>
    )
};

export default ReplyMessage