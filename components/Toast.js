import Toast from '@react-native-community/toast';

const showSuccessToast = (message) => {
  Toast.show({
    text1: 'Success',
    text2: message,
    type: 'success',
    position: 'bottom',
    duration: Toast.durations.LONG,
  });
};

const showErrorToast = (error) => {
  Toast.show({
    text1: 'Error',
    text2: error,
    type: 'error',
    position: 'bottom',
    duration: Toast.durations.LONG,
  });
};

return { showSuccessToast, showErrorToast}