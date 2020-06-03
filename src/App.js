import React, { Component, PropTypes } from 'react';
import './App.css';
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import { getData } from './actions/getData';
import { connect } from 'react-redux';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      content:"",
      rating:null
    }
  }

  componentDidMount() {
      var Sentiment = require('sentiment');
      var sentiment = new Sentiment();
      this.props.dispatch(getData()).then(() => {
        var result = sentiment.analyze(this.props.apiData[0].review_body);
        console.dir(result); 
        this.setState({content:this.props.apiData[0].review_body,rating:result.score}) 
      });

  }

  render() {
    return(
        <div className="App">
          <header className="App-header">Sentiment Analysis          
          </header>
          <CardDeck>
                <Card>
                  <Card.Img variant="top" src="/positive.jpg" />
                  <Card.Body className="positiveCard">
                    <Card.Title>Positive</Card.Title>
                    <Card.Text>
                          {this.state.content}
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Img variant="top" src="/negative.jpg" />
                  <Card.Body className="negativeCard">
                    <Card.Title>Negative</Card.Title>
                    <Card.Text>
                      This card has supporting text below as a natural lead-in to additional
                      content.{' '}
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Img variant="top" src="/neutral.jpg" />
                  <Card.Body className="neutralCard">
                    <Card.Title>Neutral</Card.Title>
                    <Card.Text>
                      This is a wider card with supporting text below as a natural lead-in to
                      additional content. This card has even longer content than the first to
                      show that equal height action.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </CardDeck>
        </div>
      )
  }
  }

  App.propTypes = {

};


function mapStateToProps(state) {
  return {
    apiData: state.getDataReducer.apiData
  };
}
export default connect(mapStateToProps)(App);
