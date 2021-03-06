/**
 * Created by luyuann on 9/14/2016.
 */
import React ,{Component,PropTypes} from 'react';
import List from './List';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Link } from 'react-router';

class KanbanBoard extends Component{
    render(){
        console.log("hello");
        console.log(this.props.children);
        let cardModal=this.props.children && React.cloneElement(this.props.children, {
                cards: this.props.cards,
                cardCallbacks: this.props.cardCallbacks
            });
        return (
            <div className="app">
                <Link to="/new" className = "float-button">+</Link>
                <List id="todo" title="TO Do" taskCallbacks = {this.props.taskCallbacks}
                      cards = {this.props.cards.filter((card)=>card.status==="todo")}
                      cardCallbacks={this.props.cardCallbacks}
                />
                <List id="in-progress" title = "In Progress" taskCallbacks = {this.props.taskCallbacks}
                      cards = {this.props.cards.filter((card)=>card.status==="in-progress")}
                      cardCallbacks={this.props.cardCallbacks}
                />
                <List id ='done' title="Done" taskCallbacks = {this.props.taskCallbacks}
                      cards={this.props.cards.filter((card)=>card.status==="done")}
                      cardCallbacks={this.props.cardCallbacks}
                />
                {cardModal}
            </div>);
    };
}
KanbanBoard.propTypes = {
    cards:PropTypes.arrayOf(PropTypes.object),
    taskCallbacks:PropTypes.object,
    cardCallbacks:PropTypes.object
};
export default DragDropContext(HTML5Backend)(KanbanBoard);