import {Map, Placemark, YMaps} from "@pbe/react-yandex-maps";
import React from "react";


const App = () => {
    const [placemarks, setPlacemarks] = React.useState([]);

    const [isWeekend, setIsWeekend] = React.useState<boolean>(false);
    const [month, setMonth] = React.useState<number>(1);
    const [hours, setHours] = React.useState<number>(0);
    const [dayOfWeek, setDayOfWeek] = React.useState<number>(0);
    const [dayOfMonth, setDayOfMonth] = React.useState<number>(0);
    const [passCount, setPassCount] = React.useState<number>(0);

    const handleMapClick = (event: any) => {
        const coordinates = event.get('coords');
        let arr = [...placemarks];
        if (arr.length === 2) {
            arr = arr.slice(1);
        }
        // @ts-ignore
        setPlacemarks([...arr, coordinates]);
    }

    const predict = () => {
        if (placemarks.length != 2) {
            return;
        }

        // @ts-ignore
        const baseUrl = import.meta.env['VITE_API_URL'];
        console.log(baseUrl);
        fetch(`${baseUrl}/api/v1/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                passenger_count: passCount,
                pickup_longitude: placemarks[0][1],
                pickup_latitude: placemarks[0][0],
                dropoff_longitude: placemarks[1][1],
                dropoff_latitude: placemarks[1][0],
                month: month,
                day_of_month: dayOfMonth,
                hour: hours,
                day_of_week: dayOfWeek,
                pickup_weekends: isWeekend ? 1 : 0
            })
        })
            .then((r) => r.json())
            .then((data) => {
                const totalSeconds = data.total_seconds;
                const totalMinutes = Math.round(totalSeconds / 60);
                alert(`Время в пути составит: ${totalSeconds} секунд или ${totalMinutes} минут`);
            })
    }

    // @ts-ignore
    return (
        <>
            <YMaps>
                <Map defaultState={{center: [40.7142700, -74.0059700], zoom: 9}}
                     onClick={handleMapClick}
                     width='100%'
                     height='100vh'>
                    {placemarks.map((coordinates, index) => (
                        <Placemark
                            key={coordinates}
                            geometry={coordinates}
                            properties={{
                                hintContent: index === 0 ? 'Точка начала маршрута' : 'Точка окончания маршрута',
                            }}
                            modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                        />
                    ))}
                    <div style={{margin: "1rem 0"}}>
                        <span style={{fontSize: 32}}>Укажите параметры запроса:</span>
                        <br/>

                        <label style={{fontSize: 24}}>Выберите дату и время отправки:</label>
                        <input type="datetime-local" onChange={(e) => {
                            const dt = new Date(e.target.value);

                            setIsWeekend(dt.getDay() == 0 || dt.getDay() == 6);
                            setMonth(dt.getMonth() + 1);
                            setHours(dt.getHours());
                            setDayOfWeek(dt.getDay());
                            setDayOfMonth(dt.getUTCDate());
                        }}/>

                        <br/>

                        <label style={{fontSize: 24}}>Укажите количество пассажиров:</label>
                        <input type="number" onChange={(e) => {
                            setPassCount(+e.target.value);
                        }}/>

                        <br/>

                        <button style={{fontSize: 20}} onClick={predict}>
                            Расчитать время в пути
                        </button>
                    </div>
                </Map>

            </YMaps>

        </>

    );
}

export default App
