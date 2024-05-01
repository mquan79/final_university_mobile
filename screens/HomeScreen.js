import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, ActivityIndicator, BackHandler, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ChatGroupScreen from './ChatGroupScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import useFetchData from '../hooks/useFetchData';
import { setGroup } from '../store/Slice/roomSlice';
import socket from '../hooks/socket';
import ModalCreateChannel from '../components/ModalCreateChannel'
const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const { data: group, loading: loadingGroup, error: errorGroup, refetchData: fetchGroup } = useFetchData('groups');
  const { data: member, loading: loadingMember, error: errorMember, refetchData: fetchMember } = useFetchData('groupmembers');
  const { data: message, loading: loadingMessage, error: errorMessage, refetchData: fetchMessage } = useFetchData('messages');
  const [stateHome, setStateHome] = useState(null);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();
  const fetchData = () => {
    fetchGroup();
    fetchMember();
  }

  useEffect(() => {
    socket.on('Fetch member', fetchMember)
    socket.on('Message', fetchMessage)
    return () => {
      socket.off('Fetch member', fetchMember)
      socket.off('Message', fetchMessage)
    }
  }, [])

  useEffect(() => {
    if (!loadingGroup && !loadingMember && !loadingMessage) {
      setLoading(false)
    }
  }, [loadingGroup, loadingMember, loadingMessage]);


  useEffect(() => {
    if (errorGroup && errorMember && errorMessage) {
      setError(true)
    }
  }, [errorGroup, errorMember, errorMessage]);

  useEffect(() => {
    if (!loading && !error) {
      const group = member.filter(e => e.idMember === user?._id)
      setGroups(group)
      choiseIdGroup(group[0].idGroup)
    }
  }, [loading, error, group, member])

  const getGroupById = (id) => {
    return group?.find(e => e?._id === id)
  }

  const choiseIdGroup = (id) => {
    setStateHome(id)
    dispatch(setGroup(id))
  }
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <ModalCreateChannel open={open} close={() => setOpen(false)} fetchData={fetchData} />
      <View style={styles.smallColumn}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        </View>
        <TouchableOpacity key={group?._id} onPress={() => setOpen(true)}>
          <View style={{
            backgroundColor: '#2a61c2',
            height: 50,
            width: 50,
            borderRadius: 10,
            marginBottom: 15,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
          }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity key={group?._id} onPress={() => navigation.navigate('SearchScreen')}>
          <View style={{
            backgroundColor: '#2a61c2',
            height: 50,
            width: 50,
            borderRadius: 10,
            marginBottom: 15,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            borderWidth: stateHome === 'search' ? 3 : 0,
            borderColor: 'white',
          }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}><Icon name="search" size={20} color="white" /></Text>
          </View>
        </TouchableOpacity>
        <ScrollView style={{}}>
          {loading ? (
            <ActivityIndicator size="large" color="grey" style={{ marginTop: 20 }} />
          ) : error ? (
            <View>
              <TouchableOpacity onPress={() => BackHandler.exitApp()}>
                <View style={{
                  backgroundColor: 'grey',
                  height: 50,
                  width: 50,
                  borderRadius: 10,
                  marginVertical: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Icon name="refresh" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginTop: 10 }}>
              {
                groups && groups.map((group) => {
                  const messageGroup = message.filter((message) => message.receiverChannel === group.idGroup && !message.send.find(e => e.userId === user._id))
                  return (
                    <TouchableOpacity key={group?._id} onPress={() => choiseIdGroup(group.idGroup)}>
                      <View style={{
                        backgroundColor: '#2a61c2',
                        height: 50,
                        width: 50,
                        borderRadius: 10,
                        marginBottom: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 5,
                        borderWidth: stateHome === group.idGroup ? 3 : 0,
                        borderColor: 'white',
                      }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{getGroupById(group.idGroup).nameGroup.substring(0, 3)}</Text>
                      </View>
                      {messageGroup?.length > 0 &&
                        <View style={{
                          backgroundColor: 'red',
                          height: 20,
                          width: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: '50%',
                          position: 'absolute',
                          top: -8,
                          right: 0,
                        }}>
                          <Text style={{
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}>{messageGroup?.length}</Text>
                        </View>
                      }

                    </TouchableOpacity>

                  )
                })
              }
            </View>
          )}

        </ScrollView>
      </View >
      < View style={styles.largeColumn} >
        <Text>
          <ChatGroupScreen navigation={navigation} messages={message} fetchData={fetchMessage} />
        </Text>
      </View >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#154ba9'
  },
  smallColumn: {
    flex: 1,
    backgroundColor: '#154ba9',
    padding: 10,
    marginTop: 30
  },
  largeColumn: {
    flex: 6,
  },
});

export default HomeScreen;
