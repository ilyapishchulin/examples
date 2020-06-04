# Навигация и смена цветовой схемы в VK Mini Apps

В этом лонгриде расскажу про корректную навигацию и работу с темами.

Сервис для тестов — [клац](https://vk.com/app7251385) <br/>
Оригинальная статья — [клац](https://vk.com/@iboge-navigation) <br/>
Мой вк — [клац](https://vk.com/@iboge)

## Навигация

***Оборачиваем наши панели в [ConfigProvider](https://vkcom.github.io/vkui-styleguide/#configprovider)***.

```jsx static
<ConfigProvider isWebView={true}>
  <View activePanel={this.state.activePanel}>
    <Home id="home" this={this}/>
    <Second id="second" this={this}/>
  </View>
</ConfigProvider>
```

***Пишем функцию для возврата на прошлую панель.***

```jsx static
goBack = () => {
  var history = this.state.history;
  
  if( history.length === 1  ) {  // Если в массиве одно значение:
    bridge.send("VKWebAppClose", {"status": "success"}); // Отправляем bridge на закрытие сервиса.
  } else if ( history.length > 1 ) {  // Если в массиве больше одного значения:
    history.pop() // Удаляем последний элемент в массиве.
    this.setState({ activePanel: history[history.length - 1] }) // Изменяем массив с иторией и меняем активную панель.
  }
}
```

***В this.state добавляем пару переменных***

 ```jsx static
 this.state = {
   activePanel: 'home', // Начальная панель.
   history: ['home'],
 }
 ```

***Для выполнения перехода на следующую панель:***

```jsx static
goToPage( name ) { // В качестве аргумента принимаем id панели для перехода
  window.history.pushState( { panel: name }, name ); //  Создаём новую запись в истории браузера
  this.setState({ 
      activePanel: name, // Меняем активную панель
      history: [...this.state.history, name] // Добавляем в массив панель, на которую перешли
  })
}
```

***Для работы свайпа добавляем в [View](https://vkcom.github.io/vkui-styleguide/#view) пару свойств.***

```jsx static
<ConfigProvider isWebView={true}>
  <View 
   activePanel={this.state.activePanel}
   history={this.state.history}
   onSwipeBack={this.goBack}
  >
    <Home id="home" this={this}/>
    <Second id="second" this={this}/>
  </View>
</ConfigProvider>
```

***В функцию componentDidMount добавляем обработчик события изменения истории браузера для работы навигационных кнопок.***

```jsx static
window.addEventListener('popstate', () => this.goBack());
```

***Для возврата на прошлую панель используем `window.history.back()`.***

```jsx static
<PanelHeaderBack onClick={() => window.history.back()}/>
```

## Смена цветовой схемы

***Добавляем в стейт новую переменную.***

```jsx static
this.state = {
   scheme: 'bright_light' // Будет по умолчанию.
}
```

***В componentDidMount подписываемся на события bridge.***

```jsx static
componentDidMount() {
  bridge.subscribe(({ detail: { type, data }}) => {
    if ( type === 'VKWebAppUpdateConfig' ) { // Получаем тему клиента.
      this.SetScheme( data.scheme )
    }
  })
}
```

***В [ConfigProvider](https://vkcom.github.io/vkui-styleguide/#configprovider) добавляем свойство scheme.***

```jsx static
<ConfigProvider isWebView={true} scheme={this.state.scheme}> 
```

***Пишем главную функцию для смены цветовой схемы.***

```jsx static
SetScheme( scheme, isChange = false ) {
   const lights = ['bright_light', 'client_light'];
   const isLight = lights.includes( scheme );
   const isLight = isChange ? !isLight : isLight;

   this.setState({ scheme: isLight ? 'bright_light' : 'space_gray' });
   bridge.send('VKWebAppSetViewSettings', {
      'status_bar_style': isLight ? 'dark' : 'light',
      'action_bar_color': isLight ? '#000' : '#ffff'
   });
}
```

***Меняем цветовую схему по клику на кнопку***
```jsx 
<Button onClick={() => this.SetScheme( this.state.scheme, true )}>Альтернативная тема</Button>
```
