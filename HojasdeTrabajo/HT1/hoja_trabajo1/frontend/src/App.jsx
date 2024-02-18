import {useState,useEffect} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {CatMod, Greet} from "../wailsjs/go/main/App";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js';

ChartJS.register(ArcElement,Tooltip,Legend)

function App() {
    const [data, setData] = useState({
        total:0,
        used:0,
        free:0,
        porcUsed:0,
        porcFree:0
    });

    const getRamData = async () => {
        try {
            const response = await CatMod();
            console.log(response);
            const datos = JSON.parse(response);
            console.log(datos);
            setData({
                total: datos.totalRam,
                used: datos.used,
                free: datos.free,
                porcUsed: datos.porcUsed,
                porcFree: datos.porcNotUsed
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getRamData();
        }, 500);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div id="App">
            <h1>RAM</h1>
            <h2>Total RAM: {data.total} Mb</h2>
            <h2>Percentage used: {data.porcUsed}%</h2>
            <h2>Percentage free: {data.porcFree}%</h2>
            <div style={{height: '30%', height: '30%', padding: '20px'}}>
            <Doughnut
                className='doughnut'
                data={{
                    labels: ['Used', 'Free'],
                    datasets: [
                        {
                            data: [data.used, data.free],
                            backgroundColor: [
                                'rgba(255, 165, 0, 0.6)',
                                'rgba(106, 90, 205, 0.6)',
                            ],
                            borderColor: [
                                'rgba(255, 165, 0, 1)',
                                'rgba(106, 90, 205, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                }}
            />
            </div>
        </div>
    )
}

export default App
