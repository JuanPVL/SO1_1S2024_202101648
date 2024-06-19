import {useState,useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Col, Container, Row } from 'react-bootstrap';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '',
      },
    },
  };



function Historico() {
    const [data, setData] = useState([]);
    const [cpuData, setCpuData] = useState([]);

    const getRamData = async () => {
        try {
            const response = await fetch("/api/historicoram")
            //console.log(response);
            const datos = await response.json();
            console.log(datos);
            setData(datos);
        }
        catch (error) {
            console.error(error);
        }
    }

    const getCpuData = async () => {
        try {
            const response = await fetch("/api/historicocpu")
            //console.log(response);
            const datos = await response.json();
            console.log(datos);
            setCpuData(datos);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getRamData();
        getCpuData();
    }
    , []);


    return (
        <div id="App">
            <h1>HISTORICO USO RAM Y CPU</h1>
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
                <Line
                    className='historicoram'
                    data={{
                        labels: data.map((item) => item.Tiempo),
                        datasets: [
                            {
                                label: 'Used',
                                data: data.map((item) => item.PorcUsed),
                                fill: false,
                                backgroundColor: 'rgb(255, 99, 132)',
                                borderColor: 'rgba(255, 99, 132, 0.5)',
                            },
                        ],
                    }}
                    options={options}            
                />
                </Col>
                <Col>
                <Line
                    className='historicocpu'
                    data={{
                        labels: cpuData.map((item) => item.Tiempo),
                        datasets: [
                            {
                                label: 'Used',
                                data: cpuData.map((item) => item.PorcUsed),
                                fill: false,
                                backgroundColor: 'rgb(158, 253, 253)',
                                borderColor: 'rgba(158, 253, 253, 0.5)',
                            },
                        ],
                    }}
                    options={options}            
                />
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default Historico
