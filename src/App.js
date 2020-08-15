import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import Infobox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData , prettyPrintStat } from './util';
import './App.css';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  // USEFFECT = EJECUTA UNA FUNCION EN BASE A UNA CONDICION DADA
  
  useEffect(() =>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])
  
  
  useEffect(() => {
    // cuando se deja en blanco la segunda parte de la coma 
    // significa que la funcion se ejecuta cuando el componente carga por primera vez , no cargara denuevo 
    // esta es una funcion async
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2 // AR, UK , USA
          })
        );
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    }
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === 'worldwide' 
                                  ? 'https://disease.sh/v3/covid-19/all'
                                  :`https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url).then(response => response.json())
    .then(data => {
      // toda la data de la api traigo del 
      // pais seleccionado
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);
      setCountryInfo(data);
    }) 
  };

  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        <div className="app__header">
          <h1>Covid 19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Recorrer por todos los paises  y mostrar un MenuItem por cada uno*/}
              { 
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          {/* Infoboxs title="Coronavirus cases" */}
          <Infobox 
            isRed
            onClick={(e) => setCasesType("cases")}
            active={casesType === "cases"}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.cases)}
            total={prettyPrintStat(countryInfo.todayCases)}
          />
          {/* Infoboxs title="Coronavirus recoveries" */}
          <Infobox 
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.recovered)}
            total={prettyPrintStat(countryInfo.todayRecovered)}     
          />
          {/* Infoboxs */}
          <Infobox
            isRed 
            onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.deaths)}
            total={prettyPrintStat(countryInfo.todayDeaths)}
          />
        </div>

        {/* Map */}
        <Map
        countries={mapCountries}
        casesType={casesType}
        center={mapCenter}
        zoom={mapZoom}        
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by Country</h3>
          <Table countries={tableData} />
            <h3 className="graph__title">Worldwide new {casesType}</h3>
          {/* Graph */}
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
