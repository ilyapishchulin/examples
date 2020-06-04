import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

const second = props => (
    <Panel id={props.id}>
        <PanelHeader left={<PanelHeaderBack onClick={() => window.history.back()}/>}>
            {props.this.state.scheme}
        </PanelHeader>
            <img style={{
                    height: '50%', 
                    width: '50%', 
                    marginLeft: '25%'
            }} alt="" src='https://vk.com/sticker/1-16263-256'/>

            <Div>
                <Button onClick={() => props.this.SetScheme( props.this.state.scheme, true )} size="xl" mode="secondary">Сменить тему на альтернативную</Button>
            </Div>
    </Panel>
);

export default second;
