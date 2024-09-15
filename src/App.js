//App.js

import { Oval } from "react-loader-spinner";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import { FaSearch } from "react-icons/fa";
import { GLOBALVARS } from "./globalvariable/GLOBALVARS";
import { cryptography } from "./crypto/encyption";
import { RxCross1 } from "react-icons/rx";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { IoTrashBin } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";

function WeatherApp() {
  const [isDark, setIsDark] = useState("");

  const [input, setInput] = useState("");
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [showCard, setShowCard] = useState(false);

  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });

  useEffect(() => {
    // to check for the state of the toggle for light mode and dark mode. Address it accordingly. If it is a real project will have to use redux to store global value so that all can access it.
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  const search = async (event, countryCity) => {
    // main api call to get value from the open weatherAPI.
    event.preventDefault();
    setShowCard(false);
    setWeather({ ...weather, loading: true });
    if (countryCity == null) {
      // if the value is not taken from the history, it will take from the input.
      countryCity = input;
    }
    const url = "https://api.openweathermap.org/data/2.5/weather";
    const api_key = cryptography.decrypt(GLOBALVARS.ENCRYPTED_KEY); // key is encrypted to ensure some level of security.
    await axios
      .get(url, {
        params: {
          q: countryCity,
          units: "metric",
          appid: api_key,
        },
      })
      .then((res) => {
        setInput(""); // clear input after searching.

        setWeather({ data: res.data, loading: false, error: false }); // set the state so that we can reference and display it.

        weatherHistory.push(res.data); // store the historical data, to show on the search history.
        setShowCard(true);
      })
      .catch((error) => {
        setWeather({ ...weather, data: {}, error: true });
        setInput("");
        setShowCard(false);
      });
  };

  const clear = async (event) => {
    //to clear the output of the keyed in user.
    setInput("");
  };
  const deleteEntry = async (event, index) => {
    event.preventDefault();

    let originalArray = weatherHistory;

    let newArray = [];
    for (let i = 0; i < originalArray.length; i++) {
      // loop through all the weather history, identify the right one to delete by the index.
      if (index !== i) {
        newArray.push(originalArray[i]);
      }
    }

    setWeatherHistory(newArray);
  };
  return (
    <div>
      <Form
        onSubmit={(e) => {
          search(e);
        }}
      >
        <Container fluid className="admin-container-search">
          <h3 className={isDark ? "app-name-dark" : "app-name"}>
            Today's Weather
          </h3>
          {/* <DarkModeToggle /> */}
          <Form>
            <Form.Check // prettier-ignore
              type="switch"
              id="custom-switch"
              label={isDark ? "🌙" : "🔆"} // to show the user is light more or dark mode.
              checked={isDark}
              onChange={({ target }) => setIsDark(target.checked)}
            />
          </Form>
          <Row className="searchComponent">
            <Col xs="auto" className="my-1">
              <Form.Select className="me-sm-2" id="inlineFormCustomSelect">
                <option value="Country">Country</option>
                <option value="City">City</option>
              </Form.Select>
            </Col>
            <Col xs="auto" className="my-1">
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter Country/City"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                ></Form.Control>
                <Button
                  variant="light"
                  type="button"
                  disabled={!input}
                  onClick={clear}
                >
                  <RxCross1 />
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  disabled={!input}
                  onClick={search}
                >
                  <FaSearch />
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </Form>{" "}
      <Container fluid className="cardContainer">
        {!showCard && weather.loading && (
          <>
            <br />
            <br />
            <Oval type="Oval" color="black" height={100} width={100} />
          </>
        )}
        {weather.loading ||
          (!showCard && weather.error && (
            <>
              <br />
              <br />
              <span className="error-message">
                <FontAwesomeIcon icon={faFrown} />
                <span style={{ fontSize: "20px" }}>
                  The City/Country that you are looking for does not exist
                </span>
              </span>
            </>
          ))}
        {showCard && weather.data && weather.data.main && (
          <Card
            bg={isDark ? "dark" : "light"}
            text={isDark ? "white" : "dark"}
            className="cardWeather"
          >
            <Card.Header>{new Date().toDateString()}</Card.Header>
            <Card.Body className="cardHeader">
              <Card.Title>
                {weather.data.name}, <span>{weather.data.sys.country}</span>
              </Card.Title>
              <Card.Text>
                <div className={isDark ? "icon-temp-dark" : "icon-temp"}>
                  <img
                    className=""
                    src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                    alt={weather.data.weather[0].description}
                  />
                  {Math.round(weather.data.main.temp)}
                  <sup className={isDark ? "deg-dark" : "deg"}>°C</sup>
                </div>
                <div className={isDark ? "des-wind-dark" : "des-wind"}>
                  <p>{weather.data.weather[0].description.toUpperCase()}</p>
                  <p>Wind Speed: {weather.data.wind.speed}m/s</p>
                </div>
                <div className={isDark ? "des-wind-dark" : "des-wind"}>
                  <p>{weather.data.weather[0].description.toUpperCase()}</p>
                  <p>Humidity: {weather.data.main.humidity}%</p>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        )}{" "}
      </Container>
      <Container fluid className="admin-container-search">
        <h3 className={isDark ? "app-name-dark" : "app-name"}>
          Search History
        </h3>
        {weatherHistory.length > 0 ? (
          <Table bordered hover size="sm" variant={isDark ? "dark" : "light"}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Country/City</th>
                <th>Delete</th>
                <th>Search Again</th>
              </tr>
            </thead>
            <tbody>
              {weatherHistory.map((weather, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{weather.name}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={(e) => deleteEntry(e, index)}
                      >
                        {" "}
                        <IoTrashBin />
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        onClick={(e) => search(e, weather.name)}
                      >
                        <CiSearch />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <p className={isDark ? "noHistoryDark" : "noHistory"}>
            No History Exists
          </p>
        )}
      </Container>
    </div>
  );
}

export default WeatherApp;
