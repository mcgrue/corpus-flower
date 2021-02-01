import React, { MouseEvent } from 'react';
import './App.css';

// import {AppProps} from './types';
import { Corpus } from './trie/Corpus';

const dict = new Corpus(false);

type AppProps = {};
type AppState = { resultText: string; inputText: string, searchInput: string };

class App extends React.Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      resultText: '(Results go here.)',
      inputText: 'Foo\nBar\nBaz\nBat\nBun1',
      searchInput: '',
    };
  }

  handleLoadCorpus() {
    const tmp = this.state.inputText.split('\n');

    tmp.forEach( (word) => {
      word = word.trim()
      
      if(word.length > 0) {
        dict.addWord(word);
      } 
    } );
    
    this.setState((state, props) => ({ resultText: dict.getAllWords().join('\n') }));
  }

  handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    console.log('this is:', this);
    
    event.preventDefault();

    this.handleLoadCorpus();
  }
  
  updateLoadText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({inputText: event.currentTarget.value});
  }
  
  onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({searchInput: event.currentTarget.value});
  }
  
  doSearch = (event: MouseEvent<HTMLButtonElement>) => {
    
    const searchWord = this.state.searchInput;
    const isWord = dict.isWord(searchWord);
    const childWords = dict.getBroadWords(searchWord, 10);
    
    alert( `Is word? ${isWord}\n\nautocompletes? ${childWords}` );
  }

  render() {

    const searchInput = this.state.searchInput || '';

    const rows = 10;
    const cols = 80;

    return (
      <div className="App">
        <header className="App-header">
          <textarea value={this.state.inputText} onChange={this.updateLoadText} rows={rows} cols={cols} />
          <button onClick={this.handleClick}>Load</button>
          <br />
          <br />
          <input value={searchInput} onChange={this.onSearchChange} />
          <button onClick={this.doSearch}>Search</button>
          <br />
          <br />
          <textarea
            id="results"
            rows={rows}
            cols={cols}
            value={this.state.resultText}
          />
        </header>
      </div>
    );
  }
}


export default App;