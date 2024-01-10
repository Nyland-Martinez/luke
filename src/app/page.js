'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

const features = {
  people: ["name", "gender", "height", "skin_color", "homeworld", "birth_year", "eye_color", "hair_color", "mass"],
  films: ["title", "episode_id", "opening_crowl", "director", "producer", "release_date"],
  starships: ["MGLT", "cargo_capacity", "consumables", "cost_in_credits", "created", "crew", "edited", "hyperdrive_rating", "length", "manufacturer", "max_atmosphering_speed", "model", "name", "passengers"],
  vehicles: ["cargo_capacity", "consumables", "cost_in_credits", "created", "crew", "edited", "length", "manufacturer", "max_atmosphering_speed", "model", "name", "passengers"],
  species: ["average_height", "average_lifespan", "classification", "created", "designation", "edited", "eye_colors", "hair_colors", "language", "name"],
  planets: ["gravity", "name", "orbital_period", "population"]
}


export default function Home() {

  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const [data, setData] = useState({});
  const [error, setError] = useState(false);


  const getResources = async () => {
    try {
      const response = await axios.get("https://swapi.dev/api/");
      const result = await response.data;
      console.log(result);
      const resourcesList = Object.keys(result);
      console.log(resourcesList);
      const resourceOptions = resourcesList.map((item) => {
        return (
          { label: item, url: result[item] }
        )
      })
      console.log(resourceOptions);
      setResources(resourceOptions);
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    getResources();
  }, [])


  const handleSearchResource = async (e) => {
    e.preventDefault();
    console.log(selectedId, selectedResource);
    try {
      const response = await axios.get(`${selectedResource}${selectedId}`);
      const result = await response.data;
      result.resource = selectedResource.split("/").at(-2);
      if (result.resource === "people") {
        const planetResponse = await axios.get(result.homeworld);
        const planetResult = await planetResponse.data;
        result.homeworld = planetResult.name;
      }
      console.log(result);
      setData(result);
      setError(false);
    } catch (error) {
      console.log(error);
      setData({});
      setError(true);
    }

  }


  return (
    <main className={styles.main}>
      <div>
        <form onSubmit={handleSearchResource}>
          <label htmlFor="resourceInput">Search For:</label>
          <select
            name="resourceIpt"
            id="resourceInput"
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
          >
            <option value="" disabled>Select Resource</option>
            {
              resources.map((item, index) => {
                return (
                  <option value={item.url} key={index}>{item.label.toUpperCase()}</option>
                )
              })
            }
          </select>
          <label htmlFor="idInput" style={{ marginLeft: 8 }}>id:</label>
          <input
            type="number"
            name="idIpt"
            id="idInput"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          />
          <button type="submit" style={{ marginLeft: 8, backgroundColor:'grey', color:'white'}}>Buscar</button>
        </form>
      </div>
      <hr />
      {
        Object.keys(data).length > 0 ?

          features[data.resource].map((item, index) => {
            return (
              <h4 key={index} style={{ margin: 0 }}>{item.toUpperCase()}: {data[item]}</h4>
            )
          })
          :
          null
      }
      {
        error &&
        <Fragment>
          <h1> Estos no son los droides que estas buscando</h1>
          <img src="https://upload.wikimedia.org/wikipedia/en/c/c5/Obiwan1.jpg" alt="obi" />
        </Fragment>
      }

    </main>
  )

}