import React from 'react';
import axios from "axios";
import PagesTitle from "../props/utils/PagesTitle";
import Uploader from "../props/utils/Uploader";


class Stats extends React.Component {
    render() {
        return (
            <div className="acc-content">

            </div>
        );
    }
}

class Account extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: false,
            email: '',
            name: '',
            compte: '0000',
            tel: '00000000',
            liveplace: 'BC',
            popup:false,
            mdp: '',
            mdprepet: '',
            lastmdp: '',
            image: null,
            errors: [],
            id: null,
            matricule: 'null'
        }

        this.postInfos = this.postInfos.bind(this);
        this.changeMdp = this.changeMdp.bind(this)
        this.postBg = this.postBg.bind(this);
    }


    async componentDidMount() {
        var req = await axios({
            url: '/data/user/infos/get',
            method: 'get',
        })
        if(req.status === 200){
            this.setState({
                data:true,
                email: req.data.infos.email,
                name: req.data.infos.name,
                compte: req.data.infos.compte,
                tel: req.data.infos.tel,
                liveplace: req.data.infos.liveplace,
                image: req.data.infos.bg_img,
                id:req.data.infos.id,

            });
        }
    }

    async postInfos(e){
        e.preventDefault()
        await  axios({
            url: '/data/user/infos/put',
            method:'PUT',
            data: {
                email: this.state.email,
                name: this.state.name,
                compte: this.state.compte,
                tel: this.state.tel,
                liveplace: this.state.liveplace,
            }
        }).catch(error => {
            error = Object.assign({}, error);
            if(error.response.status === 422){
                this.setState({errors: error.response.data.errors})
            }
        })
    }

    async changeMdp(e){
        e.preventDefault();
        var req = await axios({
            url: '/data/user/mdp/put',
            method: 'put',
            data: {
                last: this.state.lastmdp,
                newmdp: this.state.mdp,
                mdprepet: this.state.mdprepet,
            }
        })
        if(req.status === 201){
            this.setState({
                lastmdp: '',
                mdp: '',
                mdprepet: '',
                popup: false,
            })
        }
    }

    async postBg(){
        var req = await axios({
            method:'POST',
            url: '/data/user/bg/post',
            data: {
                image: this.state.image,
            }
        })
    }

    render() {
        return (
            <div className="acc-content">
                {!this.state.data &&
                    <div className={'load'}>
                        <img src={'/assets/images/loading.svg'} alt={''}/>
                    </div>
                }
                {this.state.data &&
                    <section className="changedata" style={{filter: this.state.popup ? 'blur(5px)' : 'none'}}>
                    <form onSubmit={this.postInfos}>
                        <div className="rowed">
                            <label>nom prénom</label>
                            <input required type={"text"} className={(this.state.errors.name? 'form-error': '')} value={this.state.name} onChange={(e)=>{this.setState({name:e.target.value})}}/>
                            <ul className={'error-list'}>
                                {this.state.errors.name && this.state.errors.name.map((item)=>
                                    <li>{item}</li>
                                )}
                            </ul>
                        </div>
                        <div className="rowed">
                            <label>email</label>
                            <input required type={"email"} className={(this.state.errors.email ? 'form-error': '')} value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}}/>
                            <ul className={'error-list'}>
                                {this.state.errors.email && this.state.errors.email.map((item)=>
                                    <li>{item}</li>
                                )}
                            </ul>
                        </div>
                        <div className="rowed">
                            <label>numéro de tel</label>
                            <input required type={"number"} className={(this.state.errors.tel ? 'form-error': '')} max={'99999999'} value={this.state.tel} onChange={(e)=>{this.setState({tel:e.target.value})}}/>
                            <ul className={'error-list'}>
                                {this.state.errors.tel  && this.state.errors.tel.map((item)=>
                                    <li>{item}</li>
                                )}
                            </ul>
                        </div>
                        <div className="rowed">
                            <label>numéro de compte</label>
                            <input required type={"number"} className={(this.state.errors.compte ? 'form-error': '')} value={this.state.compte} onChange={(e)=>{this.setState({compte:e.target.value})}}/>
                            <ul className={'error-list'}>
                                {this.state.errors.compte && this.state.errors.compte.map((item)=>
                                    <li>{item}</li>
                                )}
                            </ul>
                        </div>
                        <div className="rowed">
                            <label>Conté habité</label>
                            <select value={this.state.liveplace} onChange={(e)=>{this.setState({liveplace:e.target.value})}}>
                                <option>BC</option>
                                <option>LS</option>
                            </select>
                        </div>
                        <button type={'submit'} className={'btn'}>valider</button>
                    </form>
                </section>
                }
                {this.state.data &&
                    <section className={'bigchange'} style={{filter: this.state.popup ? 'blur(5px)' : 'none'}} >
                    <button className={'btn'} onClick={async () => {
                        await axios({
                            method: 'GET',
                            url: '/data/user/reset/send',
                        })
                    }
                    }>changer de mot de passe</button>
                    <div className="img">
                        <div className="rowed">
                            <h2>Arrière plan du site (Affeté à la prochainne connexion)</h2>
                            <div className="beta"/>
                        </div>
                        <Uploader text={'1920*1080 2MO'} images={(image)=>{
                            this.setState({image:image});
                            this.postBg();
                        }} default={'/storage/user_background/'+this.state.id + '/' +this.state.image}/>
                        <button className={'btn'} onClick={async (e) => {
                            e.preventDefault();
                            await axios({
                                method: 'DELETE',
                                url: '/data/user/bg/delete',
                            })
                        }}>supprimer</button>
                    </div>
                </section>
                }


                {this.state.popup &&
                    <section className={'popup'}>
                    <div className={'center'}>
                        <form onSubmit={this.changeMdp}>
                            <h1>Changer de mot de passe</h1>
                            <div className={'row'}>
                                <label>Ancien mot de passe</label>
                                <input type={'password'} value={this.state.lastmdp} onChange={(e)=>{this.setState({lastmdp:e.target.value})}}/>
                            </div>
                            <div className={'row'}>
                                <label>Nouveau mot de passe</label>
                                <input type={'password'} value={this.state.mdp} onChange={(e)=>{this.setState({mdp:e.target.value})}}/>
                            </div>
                            <div className={'row'}>
                                <label>Répéter le mot de passe</label>
                                <input type={'password'} value={this.state.mdprepet} onChange={(e)=>{this.setState({mdprepet:e.target.value})}}/>
                            </div>
                            <div className={'row-evenly'}>
                                <button className={'btn'} onClick={()=>this.setState({popup:false})}>Fermer</button>
                                <button className={'btn'} type={'submit'}>Envoyer</button>
                            </div>
                        </form>
                    </div>
                </section>
                }
            </div>
        );
    }
}

class MonCompte extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: false,
            account: true,
            grade: 'chargement ',
            matricule: 'null',

        }
    }
    async componentDidMount() {
        var req = await axios({
            url: '/data/user/infos/get',
            method: 'get',
        })
        if (req.status === 200) {
            this.setState({
                grade: req.data.infos.get_grade.name + ' ',
                matricule: req.data.infos.matricule !== null ? req.data.infos.matricule : 'null'})
        }
    }

    // Btn des stats <button onClick={()=> this.setState({stats: true, account: false})} className={this.state.stats ? '' : 'unselected'}><img src={'/assets/images/stats.svg'} alt={''}/>mes statistiques</button>
    render() {
        return (
            <div className={"moncompte"}>
                <PagesTitle title={"Mon Compte <br> <span>"+ this.state.grade + "("+ this.state.matricule + ")" + "</span>"}/>
                <div className={'account-container'}>
                    <div className={'header'}>
                        <button onClick={()=> this.setState({stats: false, account: true})} className={this.state.account ? '' : 'unselected'}><img src={'/assets/images/settings.svg'} alt={''}/> mes informations</button>
                    </div>
                    {this.state.stats && <Stats/>}
                    {this.state.account && <Account/>}
                </div>
            </div>
        )
    }
}

export default MonCompte;
