import React, { useEffect, useState } from 'react'
import socket from './hooks/socket'
import { useSelector } from 'react-redux';
import useFetchData from './hooks/useFetchData';
import Notifications from './screens/Notifications'
const FetchData = () => {
    const { data: user } = useFetchData('users');
    const { data: group } = useFetchData('groups');
    const { data: topic } = useFetchData('topicgroups');
    const room = useSelector((state) => state.room.room);
    const [notification, setNotification] = useState(null);
    const getUserById = (id) => {
        return user?.find(e => e._id === id)
    }

    const getGroupById = (id) => {
        return group?.find(e => e._id === id)
    }

    const getRoomById = (id) => {
        return topic?.find(e => e._id === id)
    }

    useEffect(() => {
        socket.on('Message', NotificationMessage)
        return () => {
            socket.off('Message', NotificationMessage)
        }
    }, [room])

    const NotificationMessage = (data) => {
        if (data.receiverGroup === room?._id) {
            return;
        }
        setNotification(data)
    }

    useEffect(() => {
        setNotification(null)
    }, [notification])

    return notification && <Notifications title={`${getGroupById(notification.receiverChannel)?.nameGroup} / #${getRoomById(notification.receiverGroup)?.nameTopicGroup}`} message={`${getUserById(notification.senderUser)?.name} : ${notification.content}`} time={5000}/>
}

export default FetchData
