import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import { getData } from "./actions/getData";

function App() {
  const [contentVal, setContent] = useState([
    { Positive: [] },
    { Negative: [] },
    { Neutral: [] },
  ]);
  const [PoisitivePage, setPoisitivePage] = useState(1);
  const [NegativePage, setNegativePage] = useState(1);
  const [NeutralPage, setNeutralPage] = useState(1);
  const apiData = useSelector((state) => state.getDataReducer.apiData);
  const dispatch = useDispatch();
  console.log("apiData111", apiData);
  useEffect(() => {

    dispatch(getData());

    /* Data format
      [
        {"Positive":[{product_title:"",review_body:"",score:null,category:""},{product_title:"",review_body:"",score:null,category:""}]},
        {"Negtaive":[{product_title:"",review_body:"",score:null,category:""},{product_title:"",review_body:"",score:null,category:""}]},
        {"Neutral":[{product_title:"",review_body:"",score:null,category:""},{product_title:"",review_body:"",score:null,category:""}]}
      ]
      */
  }, [dispatch]);

  useEffect(() => {
    let Sentiment = require("sentiment");
    let sentiment = new Sentiment();
    console.log("apiData", apiData);
    apiData.forEach((content, i) => {
      if (content.review_body + content.review_headline) {
        let res = sentiment.analyze(
          content.review_body + content.review_headline
        );
        let temp, category, stateCopy;
        stateCopy = Object.assign({}, contentVal);
        switch (true) {
          case res.score < 0 ||
            content.star_rating === "1" ||
            content.star_rating === "2":
            category = 1;
            temp = "Negative";
            break;
          case res.score > 0 || content.star_rating === "5":
            category = 0;
            temp = "Positive";
            break;
          case res.score === 0:
            category = 2;
            temp = "Neutral";
            break;
          default:
            break;
        }
        console.log("stateCopy", stateCopy, category, temp);
        stateCopy[category][temp].push({
          Title: content.product_title,
          review_body: content.review_body,
          review_headline: content.review_headline,
          Date: content.review_date,
          Sentiment_Score: res.score,
        });
        setContent((prev) => [...prev, stateCopy]);
      }
    });
  }, [apiData]);

  function handleClick(event) {
    let category = event.target.getAttribute("category");
    if (category === "Positive") {
      setPoisitivePage(Number(event.target.id));
    } else if (category === "Negative") {
      setNegativePage(Number(event.target.id));
    } else if (category === "Neutral") {
      setNeutralPage(Number(event.target.id));
    }
  }

  function renderCardtext(contentVal, category) {
    // Logic for displaying current Items
    let indexOfLastItem;
    if (category === "Positive") {
      indexOfLastItem = PoisitivePage * 3;
    } else if (category === "Negative") {
      indexOfLastItem = NegativePage * 3;
    } else if (category === "Neutral") {
      indexOfLastItem = NeutralPage * 3;
    }
    const indexOfFirstItem = indexOfLastItem - 3;
    console.log('contentVal', contentVal);
    const currentItems = Array.isArray(contentVal) ? contentVal.slice(indexOfFirstItem, indexOfLastItem) : contentVal;
    console.log("currentItems", currentItems);
    return Array.isArray(currentItems) && currentItems.map((content, i) => {
      return (
        <Accordion defaultActiveKey="0" key={i}>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey={i}>
                <Card.Text className="cardHeadline">
                  {content.review_headline}
                </Card.Text>
                <Card.Text className="cardDate">
                  {" "}
                  {content.Date + "  "}
                </Card.Text>
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={i}>
              <Card.Body>{content.review_body}</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    });
  }

  function renderPagenumbers(contentVal, category) {
    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(contentVal.length / 3); i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => {
      return (
        <li key={number} id={number} category={category} onClick={handleClick}>
          {number}
        </li>
      );
    });
  }
  return (
    <div className="App">
      <header className="App-header">Sentiment Analysis</header>
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">
            Sentiment Analysis for Amazon Customer reviews
          </h1>
          <p className="lead text-muted">
            A CI/CD workflow enabled React-bootstrap app which analyses the
            sentiment of amazon customer reviews is deployed in AWS Amplify
            development platform. Customer reviews dataset found
            <a
              href="https://s3.amazonaws.com/amazon-reviews-pds/tsv/sample_us.tsv"
              target="_blank" without rel="noreferrer"
            >
              {" "}
              here.{" "}
            </a>
            Github Link
            <a
              href="https://github.com/banurekhaMohan279/AmazonReviews-Analyser"
              target="_blank" without rel="noreferrer"
            >
              {" "}
              here.
            </a>
          </p>
        </div>
      </section>
      <div className="album py-5 bg-light">
        <div className="container">
          <CardDeck>
            {contentVal.map((content, i) => {
              console.log("contentcontentcontentcontent", content);
              let category = Object.keys(content)[0];
              let contentInner = content[category];
              let imgname = Object.keys(content)[0].toLowerCase();
              return (
                <Card key={i} style={{ minWidth: "18rem" }}>
                  <Card.Img
                    variant="top"
                    src={"/AmazonReviews-Analyser/img/" + imgname + ".png"}
                  />
                  <Card.Body>
                    <Card.Title>{category + " Comments"}</Card.Title>
                    {renderCardtext(contentInner, category)}
                  </Card.Body>
                  <ul id="page-numbers">
                    {renderPagenumbers(contentInner, category)}
                  </ul>
                </Card>
              );
            })}
          </CardDeck>
        </div>
      </div>
      <footer className="App-footer">
        @Copyrights Reserved 2023. Contact banurekha279@gmail.com for queries.
      </footer>
    </div>
  );
}

export default App;
