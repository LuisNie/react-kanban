/**
 * Created by luyuann on 9/16/2016.
 */
import React,{Component} from 'react';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';
import 'babel-polyfill';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type':'application/json',
    Authorization:'any-string-you-like'

}

class KanbanBoardContainer extends Component{
    constructor(){
        super(...arguments);
        this.state = {
                cards:[]
        }
    }
    addTask(cardId,taskName){

    }
    deleteTask(cardId, taskId, taskIndex){
        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        let nextState = update(this.state.cards,{[cardIndex]:{tasks:{$splice:[[taskIndex,1]]}}});
        this.setState({cards:nextState});
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'delete',
            headers: API_HEADERS
        });
    }
    toggleTask(cardId, taskId, taskIndex){

    }
    componentDidMount(){
        fetch(API_URL+'/cards',{headers:API_HEADERS})
            .then((response)=>response.json())
            .then((responseData)=>{
                console.log("i am fetching data");
                console.log(responseData);
                this.setState({cards:responseData});
            })
            .catch((error)=>{
                console.log('Error fetching and parsing data',error);
            });
    }
    render(){
        return <KanbanBoard cards={this.state.cards} taskCallbacks = {{
            toggle:this.toggleTask.bind(this),
            delete:this.deleteTask.bind(this),
            add:this.addTask.bind(this)
        }}/>
    }
}

export default KanbanBoardContainer;