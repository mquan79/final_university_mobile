import React from 'react';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import store from './store/store';
import Navigator from './Navigator';
const App = () => {
  return (
    <Provider store={store} >
      <Navigator />
      <Toast />
    </Provider>
  );
};

export default App;
