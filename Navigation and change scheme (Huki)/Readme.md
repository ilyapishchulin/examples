# Навигация и смена цветовой схемы в VK Mini Apps

В этом лонгриде расскажу про корректную навигацию и работу с темами.

Сервис для тестов — [клац](https://vk.com/app7251385) <br/>
Оригинальная статья — [клац](https://vk.com/@iboge-navigation) <br/>
Мой вк — [клац](https://vk.com/@iboge)

## Навигация

***Оборачиваем наши панели в [ConfigProvider](https://vkcom.github.io/vkui-styleguide/#configprovider)***.

```jsx static
<ConfigProvider isWebView={true}>
  <View activePanel={activePanel}>
    <Home id='home'/>
    <Second id='second'/>
  </View>
</ConfigProvider>
```

***Пишем функцию для возврата на прошлую панель.***

```jsx static
const goBack = () => {
  if( history.length === 1 ) {  // Если в массиве одно значение:
    bridge.send("VKWebAppClose", {"status": "success"}); // Отправляем bridge на закрытие сервиса.
  } else if( history.length > 1 ) { // Если в массиве больше одного значения:
    history.pop() // удаляем последний элемент в массиве.
    setActivePanel( history[history.length - 1] ) // Изменяем массив с иторией и меняем активную панель.
  }
}
```

***Объявляем несколько переменных.***

 ```jsx static
 const [activePanel, setActivePanel] = useState("home"); // Ставим начальную панель
 const [history, setHistory] = useState(['home']) // Заносим начальную панель в массив историй.
 ```

***Для выполнения перехода на следующую панель:***

```jsx static
function goToPage( name ) { // В качестве аргумента принимаем id панели для перехода
  window.history.pushState( {panel: name}, name ); // Создаём новую запись в истории браузера
  setActivePanel( name ); // Меняем активную панель
  history.push( name ); // Добавляем панель в историю
};
```

***Для работы свайпа добавляем в [View](https://vkcom.github.io/vkui-styleguide/#view) пару свойств.***

```jsx static
<ConfigProvider isWebView={true}>
  <View 
   activePanel={activePanel} // Активная панель равная стейту.
   history={history} // Ставим историю из массива панелей.
   onSwipeBack={goBack} // При свайпе выполняется данная функция.
  >
    <Home id="home" goToPage={goToPage}/>
    <Second id="second" SetScheme={SetScheme}/>
  </View>
</ConfigProvider>
```

***В функцию useEffect добавляем обработчик события изменения истории браузера для работы навигационных кнопок.***

```jsx static
window.addEventListener('popstate', () => goBack());
```

***Для возврата на прошлую панель используем `window.history.back()`.***

```jsx static
<PanelHeaderBack onClick={() => window.history.back()}/>
```

## Смена цветовой схемы

***Объявляем новую переменную.***

```jsx static
const [scheme, SetStateScheme] = useState('bright_light');
```

***В useEffect подписываемся на событие получения темы.***

```jsx static
useEffect(() => {
  bridge.subscribe(({ detail: { type, data }}) => {
    if ( type === 'VKWebAppUpdateConfig' ) {
      SetScheme( data.scheme )
    }
  });
}, []);
```

***В [ConfigProvider](https://vkcom.github.io/vkui-styleguide/#configprovider) добавляем свойство scheme.***

```jsx static
<ConfigProvider isWebView={true} scheme={scheme}> 
```

***Пишем главную функцию для смены цветовой схемы.***

```jsx static
function SetScheme( scheme, isChange = false ) {
	const lights = ['bright_light', 'client_light'];
	const isLight = lights.includes( scheme );
	isLight = isChange ? !isLight : isLight;

	SetStateScheme( isLight ? 'bright_light' : 'space_gray' );
		 
	bridge.send('VKWebAppSetViewSettings', {
		  'status_bar_style': isLight ? 'dark' : 'light',
		  'action_bar_color': isLight ? '#000' : '#ffff'
	});
}
```

***Меняем цветовую схему по клику на кнопку***
```jsx 
<Button onClick={() => SetScheme( scheme, true )}>Альтернативная тема</Button>
```
