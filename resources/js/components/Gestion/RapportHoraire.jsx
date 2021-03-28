import React from 'react';
import Row from "../props/Gestion/horaire/Row";
import axios from "axios";
import PagesTitle from "../props/utils/PagesTitle";
import TableBottom from "../props/utils/TableBottom";


class RapportHoraire extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popup:false,
            service: null,
            maxwwek: 0,
            wek: 0,
            data:false,
        }
        this.update = this.update.bind(this);
        this.submit = this.submit.bind(this);
    }

    setdata(bool){
        this.setState({data:bool});
    }

    async componentDidMount() {
        this.setdata(false);
        var req = await axios({
            url: '/data/service/alluser',
            method: 'get'
        })
        this.setState({
            service: req.data.service,
            maxweek: req.data.maxweek,
            wek: req.data.maxweek,
        })
        this.setdata(true);
    }
    async update(){
        this.setdata(false);
        var req = await axios({
            url: '/data/service/alluser/'+this.state.wek,
            method: 'get'
        })
        this.setState({
            service: req.data.service,
        })
        this.setdata(true);
    }

    submit(e){
        e.preventDefault();
        this.update()
    }


    render() {
        if(this.state.data){
            return (


                <div className={'RapportHorraire'}>
                    <section className={'header'}>
                        <PagesTitle title={'Rapport horaire'}/>
                        <div className={'semaine-select'}>
                            <form onSubmit={this.submit}>
                                <label>Semaine :</label>
                                <input type={"number"} min={"1"} max={this.state.maxweek} step={"1"} value={this.state.wek} onChange={(e)=>{this.setState({wek:e.target.value})}}/>
                                <button type={'submit'} className={'btn'}>Valider</button>
                            </form>
                        </div>
                        <button className={'btn add-perso'}>Exporter en exel</button>
                        <button className={'btn add-perso'} onClick={()=>this.setState({popup:true})}>Modifier le temps de service</button>
                    </section>
                    <section className={'rapport-table-container'}>
                        <div className={'rapport-table'}>
                            <div className={'row table-header'}>
                                <div className={'cell head column-1'}>
                                    <p>agent</p>
                                </div>
                                <div className={'cell head column-8'}>
                                    <p>dimanche</p>
                                </div>
                                <div className={'cell head column-2'}>
                                    <p>lundi</p>
                                </div>
                                <div className={'cell head column-3'}>
                                    <p>mardi</p>
                                </div>
                                <div className={'cell head column-4'}>
                                    <p>mercredi</p>
                                </div>
                                <div className={'cell head column-5'}>
                                    <p>jeudi</p>
                                </div>
                                <div className={'cell head column-6'}>
                                    <p>vendredi</p>
                                </div>
                                <div className={'cell head column-7'}>
                                    <p>samedi</p>
                                </div>
                                <div className={'cell head column-9'}>
                                    <p>total</p>
                                </div>
                                <div className={'cell head column-10'}>
                                    <p>En service ?</p>
                                </div>
                            </div>

                            {this.state.service &&
                            this.state.service.map((item)=>
                                item.get_user.grade_id < 10 &&
                                    item.get_user.grade_id > 0 &&
                                        <Row key={item.id} inService={item.get_user.service} itemid={item.id} update={this.update} userid={item.get_user.id} name={item.get_user.name} dimanche={item.dimanche} lundi={item.lundi} mardi={item.mardi} mercredi={item.mercredi} jeudi={item.jeudi} vendredi={item.vendredi} samedi={item.samedi} total={item.total}/>
                            )
                            }

                        </div>
                        <TableBottom placeholder={'rechercher un nom'} page={1} pages={5}/>
                    </section>
                    {this.state.popup &&
                    <section className="popup">
                        <div className={'center'}>
                            <form>
                                <h2>Ajouter/enelever du temps</h2>
                                <div className="rowed">
                                    <label>nom</label>
                                    <input type={'text'} max={100}/>
                                </div>
                                <div className="rowed">
                                    <label>action</label>
                                    <select defaultValue={1}>
                                        <option value={1} disabled>choisir</option>
                                        <option value={2}>ajouter</option>
                                        <option value={3}>enelever</option>
                                    </select>
                                </div>
                                <div className="rowed">
                                    <label>temps</label>
                                    <input type={'text'} placeholder={'hh:mm'}/>
                                </div>
                                <div className={'button'}>
                                    <button onClick={()=>this.setState({popup: false})} className={'btn'}>fermer</button>
                                    <button type={'submit'} className={'btn'}>valider</button>
                                </div>
                            </form>
                        </div>
                    </section>
                    }

                </div>
            )
        }else{
            return(
                <div className={'load'}>
                    <img src={'/assets/images/loading.svg'} alt={''}/>
                </div>
            )
        }


    }
}

export default RapportHoraire;
