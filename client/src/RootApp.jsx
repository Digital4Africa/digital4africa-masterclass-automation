import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './app/store.js';
import Overlay from './components/Overlay.jsx';


const InnerApp = () => {
 

  return (
    <>
      <Overlay />
      <App />
    </>
  );
};

const RootApp = () => (
  <Provider store={store}>
    <InnerApp />
  </Provider>
);

export default RootApp;
