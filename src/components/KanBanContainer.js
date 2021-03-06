/**
 * Created by luyuann on 9/16/2016.
 */
import React,{Component} from 'react';
//import {throttle} from './utils';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';
import 'babel-polyfill';
import update from 'react-addons-update';
import {Container} from 'flux/utils';
import CardActionCreators from '../actions/CardActionCreator';
import CardStore from '../stores/CardStore';

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
        };
        this.updateCardStatus = this.updateCardStatus.bind(this);
        this.updateCardPosition = this.updateCardPosition.bind(this);
    }

    addCard(card){
        CardActionCreators.addCard(card);
    }
    updateCard(card){
        CardActionCreators.updateCard(card);
    }
    addTask(cardId,taskName){
        let cardIndex = this.state.cards.findIndex((card)=>card.id==cardId);
        let newTask = {id:Date.now(),name:taskName,don:false};
        let nextState = update(this.state.cards,{
            [cardIndex]:{
                tasks:{$push:[newTask]}
            }
        });
        this.setState({cards:nextState});
        fetch(`${API_URL}/cards/${cardId}/tasks`,{
            method:'post',
            headers:API_HEADERS,
            body:JSON.stringify(newTask)
        }).then((response)=>response.json())
            .then((responseData)=>{
                newTask.id = responseData.id;
                this.setState({cards:nextState});
            })
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
        let cardIndex = this.state.cards.findIndex((card)=>card.id==cardId);
        let newDoneValue;
        let nextState = update(this.state.cards,{
            [cardIndex]:{
                tasks:{
                    [taskIndex]:{
                        done:{$apply:(done)=>{
                            newDoneValue=!done;
                            return newDoneValue;
                        }}
                    }
                }
            }
        });
        this.setState({cards:nextState});
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify({done:newDoneValue})
        });
    }
    componentDidMount(){
        CardActionCreators.fetchCards();
        console.log(this.state.cards);

    }


    updateCardStatus(cardId,listId){
        // let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        // let card = this.state.cards[cardIndex];
        // if(card.status!==listId){
        //     this.setState(update(this.state,{
        //         cards:{
        //             [cardIndex]:{
        //                 status:{
        //                     $set:listId
        //                 }
        //             }
        //         }
        //     }))
        // }
        CardActionCreators.updateCardStatus(cardId,listId);

    }

    updateCardPosition(cardId, afterId){
        if(cardId!==afterId){
            let cardIndex = this.state.cards.findIndex((card)=>card.id==cardId);
            let card = this.state.cards[cardIndex];
            let afterIndex = this.state.cards.findIndex((card)=>card.id == afterId);
            this.setState(update(this.state,{
                cards:{
                    $splice:[[cardIndex,1],[afterIndex,0,card]] //remove cardIndex, and put card after afterIndex  nice way
                }
            }))
        }
    }

    persistCardDrag(cardId,status){
        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        let card = this.state.cards[cardIndex];
        fetch(`${API_URL}/cards/${cardId}`,{
            method:'put',
            headers:API_HEADERS,
            body:JSON.stringify({status:card.status,row_order_position:cardIndex})
        })
            .then((response)=>{
                if(!response.ok){
                    throw new Error("server response wasn't ok");
                }
            })
            .catch((error)=>{
                console.log("Fetch error: ",error);
                this.setState(update(this.state,{cards:{
                    [cardIndex]:{
                        status:{$set:status}
                    }
                }}))
            })
    }
    render(){
         let kanbanBoard = this.props.children&&React.cloneElement(this.props.children,{
            cards : this.state.cards,
            taskCallbacks : {
                toggle:this.toggleTask.bind(this),
                delete:this.deleteTask.bind(this),
                add:this.addTask.bind(this)
            },
            cardCallbacks:{
                addCard:this.addCard.bind(this),
                updateCard:this.updateCard.bind(this),
                updateStatus:this.updateCardStatus,
                updatePosition:this.updateCardPosition,
                persistCardDrag: this.persistCardDrag.bind(this)
            }
         });
        return kanbanBoard;
    }
}

KanbanBoardContainer.getStores = ()=>([CardStore]);
KanbanBoardContainer.calculateState = (prevState) =>({
    cards:CardStore.getState(),
});

export default Container.create(KanbanBoardContainer);