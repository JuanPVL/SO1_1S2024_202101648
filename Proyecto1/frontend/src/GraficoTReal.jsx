import { useState, useEffect } from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js';
import { Col, Container, Row } from 'react-bootstrap';


ChartJS.register(ArcElement, Tooltip, Legend)

function Graficas() {
    const [data, setData] = useState({
        total: 0,
        used: 0,
        free: 0,
        porcUsed: 0,
        porcFree: 0
    });
    const [cpuData, setCpuData] = useState({
        total: 0,
        used: 0,
        free: 0,
        porcUsed: 0,
        porcFree: 0
    });

    const getRamData = async () => {
        try {
            const response = await fetch("/api/ram")
            const datos = await response.json();
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

    const getCpuData = async () => {
        try {
            const response = await fetch("/api/cpu")
            const datos = await response.json();
            console.log(datos);
            setCpuData({
                total: datos.cpu_total,
                used: datos.cpu_en_uso,
                free: datos.cpu_libre,
                porcUsed: datos.PorcUsed,
                porcFree: datos.PorcNotUsed
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getRamData();
            getCpuData();
        }, 500);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div id="App">
            <h1>
                <b>
                    MONITOREO EN TIEMPO REAL
                </b>
            </h1>
            <Container>
                <Row>
                    <Col>
                        <h1>MEMORIA RAM</h1>
                    </Col>
                    <Col>
                        <h1>CPU</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Pie
                            className='pie'
                            data={{
                                labels: ['Used', 'Free'],
                                datasets: [
                                    {
                                        data: [data.porcUsed, data.porcFree],
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
                    </Col>
                    <Col>
                        <Pie
                            className='pie'
                            data={{
                                labels: ['Used', 'Free'],
                                datasets: [
                                    {
                                        data: [cpuData.porcUsed, cpuData.porcFree],
                                        backgroundColor: [
                                            'rgba(51, 255, 175, 0.6)',
                                            'rgba(255, 149, 66, 0.6)',
                                        ],
                                        borderColor: [
                                            'rgba(51, 255, 175, 0.6)',
                                            'rgba(255, 149, 66, 0.6)',
                                        ],
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Graficas
