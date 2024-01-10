'use client'
import axios from "axios";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

const features = {
    people: ["name", "gender", "height", "skin_color", "homeworld"],
}

const PeoplePage = () => {

    const { id } = useParams();

    const [data, setData] = useState({});
    const [error, setError] = useState(false);

    const handleSearchPeople = async (e) => {
        try {
            const response = await axios.get(`https://swapi.dev/api/people/${id}`);
            const result = await response.data;
            result.resource = "people"

            const planetResponse = await axios.get(result.homeworld);
            const planetResult = await planetResponse.data;
            result.homeworld = planetResult.name;

            console.log(result);
            setData(result);
            setError(false);
        } catch (error) {
            console.log(error);
            setData({});
            setError(true);
        }

    }

    useEffect(() => {
        handleSearchPeople();
    }, [])

    return (
        <main>
            {
                Object.keys(data).length > 0 ?

                    features[data.resource].map((item, index) => {
                        return (
                            <h1 key={index} style={{ margin: 0 }}>{item.toUpperCase()}: {data[item]}</h1>
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

export default PeoplePage;