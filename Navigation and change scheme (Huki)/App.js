import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ConfigProvider from '@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Second from './panels/second';

const App = () => {
	const [activePanel, setActivePanel] = useState("home"); // Ставим начальную панель
	const [history, setHistory] = useState(['home']) // Заносим начальную панель в массив историй.
	const [scheme, SetStateScheme] = useState('bright_light'); // Ставим цветовую схему по умолчанию.
	
	function goToPage( name ) { // В качестве аргумента принимаем id панели для перехода
		window.history.pushState( {panel: name}, name ); // Создаём новую запись в истории браузера
		setActivePanel( name ); // Меняем активную панель
		history.push( name ); // Добавляем панель в историю
	};

	const goBack = () => {
		if( history.length === 1 ) {  // Если в массиве одно значение:
			bridge.send("VKWebAppClose", {"status": "success"}); // Отправляем bridge на закрытие сервиса.
		} else if( history.length > 1 ) { // Если в массиве больше одного значения:
			history.pop() // удаляем последний элемент в массиве.
			setActivePanel( history[history.length - 1] ) // Изменяем массив с иторией и меняем активную панель.
		}
	}

	function SetScheme( scheme, isChange = false ) {
		const lights = ['bright_light', 'client_light'];
		const isLight = lights.includes( scheme );
		const isLight = isChange ? !isLight : isLight;

		SetStateScheme( isLight ? 'bright_light' : 'space_gray' );
		 
		bridge.send('VKWebAppSetViewSettings', {
		   'status_bar_style': isLight ? 'dark' : 'light',
		   'action_bar_color': isLight ? '#000' : '#ffff'
		});
	}

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if ( type === 'VKWebAppUpdateConfig' ) {
			  SetScheme( data.scheme )
			}
		});
		window.addEventListener('popstate', () => goBack()); // Обработчик события изменения браузерной истории
	}, []);
	 
	return (
		<ConfigProvider isWebView={true} scheme={scheme}>
			<View 
				activePanel={activePanel} // Активная панель равная стейту.
				history={history} // Ставим историю из массива панелей.
				onSwipeBack={goBack} // При свайпе выполняется данная функция.
			>
				<Home id="home" goToPage={goToPage}/>
				<Second id="second" SetScheme={SetScheme} scheme={scheme}/>
			</View>
		</ConfigProvider>
	);
}

export default App;


