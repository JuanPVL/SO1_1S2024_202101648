import {useState,useEffect,useRef} from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { Col, Row } from 'react-bootstrap';


function ArbolProcesos() {
    const [pids, setPids] = useState([]);
    const [selectedPid, setSelectedPid] = useState(0);
    const [nodes, setNodes] = useState(new DataSet([]));
    const [edges, setEdges] = useState(new DataSet([]));

    const layout = {
        hierarchical: {
            enabled:true,
            levelSeparation: 150,
            nodeSpacing: 500,
            treeSpacing: 500,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'UD',        // UD, DU, LR, RL
            sortMethod: 'directed',  // hubsize, directed
            // shakeTowards: 'leaves'  // roots, leaves
          }
    }



    const getProcesosJ = async () => {
        try {
            const response = await fetch("/api/process")
            const datos = await response.json();
            //console.log(datos);
            //console.log(datos.processes.map((p) => p.pid));
            setPids(datos.processes.map((p) => p.pid));
        } catch (error) {
            console.error(error);
        }
    } 

    const hacerArbolPid = async () => {
        try {
            nodes.clear();
            edges.clear();
            const response = await fetch("/api/process")
            const datos = await response.json();
            console.log(datos);
            if (selectedPid != 0) {
                datos.processes.map((p) => {
                    if (p.pid == selectedPid) {
                        console.log("llegue con pid=",p.pid);
                        nodes.add({id: p.pid, label: `${p.name}\n${p.pid}`, color: '#a3e9ff'})
                        if (p.child.length > 0) {
                            p.child.map((c) => {
                                nodes.add({id: c.pid, label: `${c.name}\n${c.pid}`, color: '#a3e9ff'})
                                edges.add({from: c.pidPadre, to: c.pid, color: '#000000'})
                            })
                        }
                        setNodes(nodes);
                        setEdges(edges);
                    }
                })
            }
        } catch (error) {
            console.error(error);
        }
    }

    const visNetwork = useRef(null);
    useEffect(() => {
        const network = new Network(visNetwork.current, {nodes:nodes,edges:edges}, {layout:layout});
    },[visNetwork,nodes,edges])

    useEffect(() => {
        getProcesosJ();
    },[])

    return (
        <div id="App">
            <h1>Arbol de Procesos</h1>
            <Row>
                <Col>
                <select style={{width:500,marginLeft:50}} name="select" id="select" value={selectedPid} onChange={e => setSelectedPid(e.target.value)}>
                    <option value="0">Seleccione un proceso</option>
                    {pids.map((pid) => (
                        <option key={pid} value={pid}>{pid}</option>
                    ))}
                </select>
                <button style={{marginLeft:10}} onClick={() => hacerArbolPid()}>Hacer Arbol</button>
                </Col>
            </Row>
            <div ref={visNetwork} style={{height:'800px',width:'100%'}}></div>
        </div>
    )
}

export default ArbolProcesos
