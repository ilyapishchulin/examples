import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Div from '@vkontakte/vkui/dist/components/Div/Div';

const home = props => (
    <Panel id={props.id}> 
        <PanelHeader>
            Hello 
        </PanelHeader>
        <img style={{
            height: '50%', 
            width: '50%', 
            marginLeft: '25%'
        }} alt='' src='https://vk.com/sticker/1-16271-256'/>

        <Div>
            <Button onClick={() => props.this.goToPage( 'second' )} size='xl' mode='secondary'>Перейти на вторую панель</Button>
        </Div>
    </Panel>
);

export default home;
