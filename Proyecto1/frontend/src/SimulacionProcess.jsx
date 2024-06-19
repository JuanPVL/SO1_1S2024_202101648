import {useState,useEffect,useRef} from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js';
import {  Network } from 'vis-network';
import { Col, Row } from 'react-bootstrap';

ChartJS.register(ArcElement,Tooltip,Legend)

function SimulacionP() {
    const [nodes, setNodes] = useState([
        {id:1, label:'No hay procesos', color:'#a3e9ff'},
    ]);
    const [edges, setEdges] = useState([
    ]);
    const [labelPid, setLabelPid] = useState('----')

    const nodesStart = [
        {id:1, label:'New', color:'#a3e9ff'},
        {id:2, label:'Ready', color:'#a3e9ff'},
        {id:3, label:'Running', color:'#85ff8c'},
    ]
    const edgesStart = [
        {from:1, to:2, color: '#000000'},
        {from:2, to:3, color: '#000000'},
    ]
    const nodesStop = [
        {id:1, label:'New', color:'#a3e9ff'},
        {id:2, label:'Ready', color:'#85ff8c'},
        {id:3, label:'Running', color:'#a3e9ff'},
    ]
    const edgesStop = [
        {from:1, to:2, color: '#000000'},
        {from:2, to:3,color: '#000000'},
        {from:3, to:2, color:'#0040b7', arrows:'to'},
    ]
    const nodesResume = [
        {id:1, label:'New', color:'#a3e9ff'},
        {id:2, label:'Ready', color:'#a3e9ff'},
        {id:3, label:'Running', color:'#85ff8c'},
    ]
    const edgesResume = [
        {from:1, to:2, color: '#000000'},
        {from:2, to:3, color: '#a3e9ff', arrows:'to'},
        {from:3, to:2, color:'#000000'},
    ]

    // const layout = {
    //     hierarchical: {
    //         direction: 'UD',
    //     }
    // }

    const startProcess = async () => {
        try {
            const response = await fetch("/api/start")
            const datos = await response.json();
            console.log(datos);
            setLabelPid(datos.Pid);
            setNodes(nodesStart);
            setEdges(edgesStart);
        } catch (error) {
            console.error(error);
        }
    }

    const stopProcess = async () => {
        try {
            const response = await fetch(`/api/stop?pid=${labelPid}`)
            const datos = await response.json();
            console.log(datos);
            setNodes(nodesStop);
            setEdges(edgesStop);
        } catch (error) {
            console.error(error);
        }
    }

    const resumeProcess = async () => {
        try {
            const response = await fetch(`/api/resume?pid=${labelPid}`)
            const datos = await response.json();
            console.log(datos);
            setNodes(nodesResume);
            setEdges(edgesResume);
        } catch (error) {
            console.error(error);
        }
    }

    const killProcess = async () => {
        try {
            const response = await fetch(`/api/kill?pid=${labelPid}`)
            const datos = await response.json();
            console.log(datos);
            setLabelPid('----');
            setNodes([
                {id:1, label:'No hay procesos', color:'#a3e9ff'},
            ]);
            setEdges([]);
        } catch (error) {
            console.error(error);
        }
    }



    const visNetwork = useRef(null);
    useEffect(() => {
        const network = new Network(visNetwork.current, {nodes:nodes,edges:edges}, {});
    },[visNetwork,nodes,edges])

    return (
        <div id="App">
            <h1>DIAGRAMA DE ESTADOS</h1>
            <Row>
                <Col>
                    <label>PID: </label>
                    <label>{labelPid}</label>
                    <button style={{color:'#068737',marginLeft:20,backgroundColor:'#ffffff',borderStyle:'solid',borderColor:'#0c0909',borderWidth:3}} onClick={() => startProcess()}> ● NEW</button>
                    <button style={{color:'#ffeb24',marginLeft:20,backgroundColor:'#ffffff',borderStyle:'solid',borderColor:'#0c0909',borderWidth:3}} onClick={() => stopProcess()}> ● STOP</button>
                    <button style={{color:'#7ffff7',marginLeft:20,backgroundColor:'#ffffff',borderStyle:'solid',borderColor:'#0c0909',borderWidth:3}} onClick={() => resumeProcess()}> ● RESUME</button>
                    <button style={{color:'#ff3838',marginLeft:20,backgroundColor:'#ffffff',borderStyle:'solid',borderColor:'#0c0909',borderWidth:3}} onClick={() => killProcess()}> ● KILL</button>
                </Col>
            </Row>
            <div ref={visNetwork} style={{height:'600px',width:'100%'}}></div>
        </div>
    )
}

export default SimulacionP
