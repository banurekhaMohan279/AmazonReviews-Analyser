import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import { getData } from './actions/getData';
import { connect } from 'react-redux';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      content:[{"Positive":[]},{"Negative":[]},{"Neutral":[]}],
      PoisitivePage:1,
      NegativePage:1,
      NeutralPage:1
    }
    this.renderCardtext=this.renderCardtext.bind(this);
    this.renderPagenumbers=this.renderPagenumbers.bind(this);
    this.handleClick=this.handleClick.bind(this);
  }

  componentDidMount() {
      let Sentiment = require('sentiment'); 
      let sentiment = new Sentiment();    
      this.props.dispatch(getData()).then(() => {
                  this.props.apiData.forEach((content,i)=>{
                      if(content.review_body+content.review_headline)
                      {                        
                          let res= sentiment.analyze(content.review_body+content.review_headline);                      
                          let temp,category,stateCopy;
                          stateCopy = Object.assign({}, this.state);
                          switch(true){
                              case (res.score<0 || content.star_rating==="1" || content.star_rating==="2"):
                                       category=1;temp="Negative";break;
                              case (res.score>0 || content.star_rating==="5"):                                                                           
                                       category=0;temp="Positive";break;
                              case (res.score===0):
                                       category=2;temp="Neutral";break;
                              default:
                                 break;
                          }                       
                          stateCopy.content[category][temp].push({"Title":content.product_title,"review_body":content.review_body
                          ,"review_headline":content.review_headline,"Date":content.review_date,"Sentiment_Score":res.score})
                          this.setState(stateCopy);
                      }
                  })
      });

      /* Data format
      [
        {"Positive":[{product_title:"",review_body:"",score:null,category:""},{product_title:"",review_body:"",score:null,category:""}]},
        {"Negtaive":[{product_title:"",review_body:"",score:null,category:""},{product_title:"",review_body:"",score:null,category:""}]},
        {"Neutral":[{product_title:"",review_body:"",score:null,category:""},{product_title:"",review_body:"",score:null,category:""}]}
      ]
      */

  }

  handleClick(event) {
        let category=event.target.getAttribute('category');
        if(category=="Positive"){this.setState({PoisitivePage: Number(event.target.id)}); }
        else if(category=="Negative"){this.setState({NegativePage: Number(event.target.id)}); }
        else if(category=="Neutral"){this.setState({NeutralPage: Number(event.target.id)}); }
  }

  renderCardtext(contentVal,category){
    // Logic for displaying current Items
    let indexOfLastItem;
    if(category=="Positive") { indexOfLastItem = this.state.PoisitivePage * 3;}
    else if(category=="Negative"){ indexOfLastItem = this.state.NegativePage * 3;}
    else if(category=="Neutral"){ indexOfLastItem = this.state.NeutralPage * 3;} 
    const indexOfFirstItem = indexOfLastItem - 3;
    const currentItems = contentVal.slice(indexOfFirstItem, indexOfLastItem);
    return currentItems.map((content,i)=>{
             return( 
              <Accordion defaultActiveKey="0" key={i}>
                <Card>
                  <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey={i}>
                       <Card.Text className="cardHeadline" >{content.review_headline}</Card.Text>
                       <Card.Text className="cardDate"> {content.Date+"  "}</Card.Text>
                      </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={i}>
                    <Card.Body>{content.review_body}</Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
          )      
      });         
  }

  renderPagenumbers(contentVal,category){
    // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(contentVal.length / 3); i++) {
          pageNumbers.push(i);
        }

        return pageNumbers.map(number => {
          return (
            <li
              key={number}
              id={number}
              category={category}
              onClick={this.handleClick}>
              {number}
            </li>
          );
        });
  }

  render() {
    return(
        <div className="App">
            <header className="App-header">Sentiment Analysis</header>
            <section className="jumbotron text-center">
                <div className="container">
                    <h1 className="jumbotron-heading">Sentiment Analysis for Amazon Customer reviews</h1>
                    <p className="lead text-muted">A CI/CD workflow enabled React-bootstrap app which analyses the sentiment of amazon customer reviews is 
                    delployed in AWS Amplify development platform. Customer reviews dataset found 
                    <a href="https://s3.amazonaws.com/amazon-reviews-pds/tsv/sample_us.tsv" target="_blank"> here. </a>
                     Github Link 
                    <a href="https://github.com/banurekhaMohan279/awsreactapp" target="_blank"> here.</a>                
                    </p>
                </div>
            </section>
            <div className="album py-5 bg-light">
                  <div className="container">
                          <CardDeck>
                            {
                              this.state.content.map((content,i)=>{
                                let category=Object.keys(content)[0];
                                let contentVal=content[category];
                                return(
                                      <Card key={i}>
                                        <Card.Img variant="top" src={"/"+category+".png"}/>
                                        <Card.Body>
                                          <Card.Title>{category+ " Comments"}</Card.Title>
                                          {this.renderCardtext(contentVal,category)}                        
                                        </Card.Body>
                                        <ul id="page-numbers">
                                           {this.renderPagenumbers(contentVal,category)}
                                        </ul>
                                    </Card>
                                )
                              })
                            }   
                            </CardDeck>
                    </div>
              </div>
              <footer className="App-footer"> 
                @Copyrights Reserved 2020. Contact banurekha279@gmail.com for queries.
              </footer>
        </div>
      )
  }
  }

function mapStateToProps(state) {
  return {
    apiData: state.getDataReducer.apiData
  };
}
export default connect(mapStateToProps)(App);
