import React from "react";
import {NavLink} from "react-router-dom";

class Patient extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            rapport: false,
            BC: false,
            dossier:false,
            poudre:false,
        }
    }


    componentDidMount() {
        if(this.props.service){
            this.setState({rapport:true})
            this.setState({poudre:true})
            this.setState({dossier:true})
            this.setState({BC:true})
        }
        if(this.props.perm['HS_rapport']) {
            this.setState({rapport: true})
        }
        if(this.props.perm['HS_BC']){
            this.setState({BC:true})
        }
        if(this.props.perm['HS_dossier']){
            this.setState({dossier:true})
        }
        if(this.props.perm['HS_poudre']){
            this.setState({poudre:true})
        }
        if(this.props.perm['HS_poudre_history']){
            this.setState({poudre:true})
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
       if(this.props.perm !== prevProps.perm){
           if(this.props.perm['HS_rapport']) {
               this.setState({rapport: true})
           }
           if(this.props.perm['HS_BC']){
               this.setState({BC:true})
           }
           if(this.props.perm['HS_dossier']){
               this.setState({dossier:true})
           }
           if(this.props.perm['HS_poudre'] || this.props.perm['HS_poudre_history']){
               this.setState({poudre:true})
           }
       }
       if(this.props.service !== prevProps.service){
           if(this.props.service === true){
               this.setState({dossier:true})
               this.setState({BC:true})
               this.setState({rapport:true})
               this.setState({poudre:true})
           }else{
               if(!this.props.perm['HS_rapport']) {
                   this.setState({rapport:false})
               }
               if(!this.props.perm['HS_BC']){
                   this.setState({BC:false})
               }

               if(!this.props.perm['HS_dossier']){
                   this.setState({dossier:false})
               }
               if(!this.props.perm['HS_poudre'] || !this.props.perm['HS_poudre_history']){
                   this.setState({poudre:false})
               }
           }
       }
    }

    render() {
        return(
            <div className="Menu-Item" id="Patient">
                <h2 className="Menu_title"><span>Patient</span></h2>
                <ul className="Menu-list">
                    {this.state.rapport &&
                    <li><NavLink to={'/patient/rapport'}>Rapport  patient</NavLink></li>
                    }
                    {this.state.BC &&
                    <li><NavLink to={'/patient/blackcode'}>Black code</NavLink></li>
                    }
                    {this.state.dossier &&
                    <li><NavLink to={'/patient/dossiers'}>Dossiers</NavLink></li>
                    }
                    {this.state.poudre &&
                    <li><NavLink to={'/patient/poudre'}>Tests de poudre</NavLink></li>
                    }
                </ul>
            </div>
        );
    }
}
export default Patient;
