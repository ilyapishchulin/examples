import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Bridge
import { View, ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css'; // Импортируем css

// Импортируем панели
import Home from './panels/home.js'
import Second from './panels/second.js'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'home', // Начальная панель.
            history: ['home'],
            scheme: 'bright_light'
        }
    }

    goToPage( name ) { // В качестве аргумента принимаем id панели для перехода
        window.history.pushState( { panel: name }, name ); //  Создаём новую запись в истории браузера
        this.setState({ 
            activePanel: name, // Меняем активную панель
            history: [...this.state.history, name] // Добавляем в массив панель, на которую перешли
        })
    }

    goBack = () => {
        var history = this.state.history;
        
        if( history.length === 1  ) {  // Если в массиве одно значение:
          bridge.send("VKWebAppClose", {"status": "success"}); // Отправляем bridge на закрытие сервиса.
        } else if ( history.length > 1 ) {  // Если в массиве больше одного значения:
          history.pop() // Удаляем последний элемент в массиве.
          this.setState({ activePanel: history[history.length - 1] }) // Изменяем массив с иторией и меняем активную панель.
        }
    }

    componentDidMount() {
        bridge.subscribe(({ detail: { type, data }}) => { // Подписываемся на события bridge.
	    if ( type === 'VKWebAppUpdateConfig' ) { // Получаем тему клиента.
               this.SetScheme( data.scheme )
            }
        })
        // Обработчик события изменения истории браузера для работы навигационных кнопок.
        window.addEventListener('popstate', () => this.goBack());
    }

    SetScheme( scheme, isChange = false ) {
        const lights = ['bright_light', 'client_light'];
        const isLight = lights.includes( scheme );
        
        this.UpdateTheme( isChange ? !isLight : isLight );
    }
     
    UpdateTheme( isLight ) {
        this.setState({ scheme: isLight ? 'bright_light' : 'space_gray' });

        bridge.send('VKWebAppSetViewSettings', {
           'status_bar_style': isLight ? 'dark' : 'light',
           'action_bar_color': isLight ? '#000' : '#ffff'
        });
    }
    
    render() {
        return(
            <ConfigProvider isWebView={true} scheme={this.state.scheme}>
                <View 
                    activePanel={this.state.activePanel}
                    history={this.state.history}
                    onSwipeBack={this.goBack}
                >
                    <Home id="home" this={this}/>
                    <Second id="second" this={this}/>
                </View>
            </ConfigProvider>
        );
    }
}

export default App;
