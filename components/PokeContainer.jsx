import React, { Component } from 'react'
import PokeCard from './PokeCard.jsx'

class PokeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pokeInfo: [],
            pokeName: null, 
            fetchTime: [],
            evolutionBool: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.pokeQueryBuilder = this.pokeQueryBuilder.bind(this);
        this.handleTruth = this.handleTruth.bind(this)

    }

    handleClick (event) {
        event.preventDefault()
        const query = this.pokeQueryBuilder(this.state.pokeName, this.state.evolutionBool);
        let startTime = Date.now(); 
        fetch('https://graphql-pokemon.now.sh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({query: query})
        })
        .then(res => res.json())
        .then(info => {
            let pokeArray = [...this.state.pokeInfo, info]
            let elapsedTime = Date.now() - startTime;
            let timeArray = [...this.state.fetchTime, elapsedTime];
            this.setState({ pokeInfo: pokeArray, fetchTime: timeArray })
        })
    }

    handleNameChange (e) {
        this.setState({pokeName: e.target.value});
    }

    handleTruth () {
        let truth
        if (this.state.evolutionBool) truth = false
        else {truth = true}
        this.setState({evolutionBool: truth})
        console.log(this.state.evolutionBool)
    }

    pokeQueryBuilder (pokeName, evolutions = false) {
        let query = `query {
                    pokemon(name: "${pokeName}") {
                      name
                      image
                      attacks {
                        special {
                          name
                        }
                      }`

            if (evolutions) {
                query +=(`
                evolutions {
                    name
                }
              }
          }`)
            }
            else{
                query +=(
                  `  }
                }`  
                )
            }
        console.log(query)
        return query        
    }

    render() {
        const pokeCards = []
        for (let i = 0; i < this.state.pokeInfo.length; i += 1) {
            pokeCards.push(<PokeCard pokeInfo={this.state.pokeInfo[i]} fetchTime={this.state.fetchTime[i]}/>)
        }
        return (
            <div className = 'pokeContainer'>
                <h1>poke card</h1>
                <form>
                    <input id="pokeName" value={this.state.pokeName} onChange={this.handleNameChange} type="text" />
                    <button onClick={(event) => this.handleClick(event)}>QUERY POKEMON NAME</button>
                    <input type='checkbox' onChange={this.handleTruth}></input>
                </form>
                    {pokeCards}
            </div>
        )
    }
}

export default PokeContainer;