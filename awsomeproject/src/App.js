import React from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {default as theme} from './custom-theme.json';
import AppNavigator from './navigations/AppNavigator';
import { Provider } from "react-redux";
import { createStore } from 'redux';
import theApp from "./screens/store/reducers";

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
      <Provider store={createStore(theApp)}>
        <AppNavigator></AppNavigator>
      </Provider>
      </ApplicationProvider>
    </>
  );
}
