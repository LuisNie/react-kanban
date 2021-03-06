/**
 * Created by luyuann on 9/14/2016.
 */
import React, {Component,PropTypes} from 'react';
import Card from './Card';
import {DropTarget} from 'react-dnd';

const listTargetSpec = {
    hover(props,monitor){
        const draggedId = monitor.getItem().id;
        props.cardCallbacks.updateStatus(draggedId,props.id);
    }
}

let collect = (connect,monitor)=>{
    return {
        connectDropTarget:connect.dropTarget()
    }
}


class List extends Component{
    render(){
        const {connectDropTarget} = this.props;
        //console.log(this.props.cards);
        var cards = this.props.cards.map((card)=>{
            return <Card key={card.id}
                         id = {card.id}
                         title={card.title}
                         description={card.description}
                         color = {card.color}
                         tasks = {card.tasks}
                         taskCallbacks = {this.props.taskCallbacks}
                         cardCallbacks={this.props.cardCallbacks}
                    />
        })
        return connectDropTarget(
            <div className="list">
                <h1>{this.props.title}</h1>
                {cards}
            </div>)
    }
}

List.propTypes = {
    id:PropTypes.string,
    title:PropTypes.string.isRequired,
    description:PropTypes.string,
    cards:PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object,
    connectDropTarget:PropTypes.func.isRequired,
    cardCallbacks:PropTypes.object
}

export default DropTarget("hello",listTargetSpec,collect)(List);