import React from 'react';
import axios from "axios";


class TableBottom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className={"TableBottom"}>
                <div className={'searsh'}>
                    <input list={'autocomplete'} type={'text'} placeholder={this.props.placeholder}/>
                    <datalist id={'autocomplete'}>
                        <option>test</option>
                    </datalist>
                </div>
                <div className={'pages'}>
                    <button onClick={()=> this.props.prev()}>&lsaquo;</button>
                    <h5>{this.props.page}/{this.props.pages}</h5>
                    <button onClick={()=> this.props.next()}>&rsaquo;</button>
                </div>
            </div>
        )
    }
}

export default TableBottom;
