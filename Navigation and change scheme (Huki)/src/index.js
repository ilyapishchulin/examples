import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import App from './App.js';
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';
import {platform, IOS} from '@vkontakte/vkui';

bridge.send('VKWebAppInit', {}); // Запусааем приложение
const root = document.getElementById('root');
if(platform() === IOS) {
    mVKMiniAppsScrollHelper(root); // Добавляем скролхелпер для Safari
}
ReactDOM.render(<App />, root); // Рендерим App.js

