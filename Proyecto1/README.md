# Proyecto 1
## Manual Tecnico
### Juan Pedro Valle Lema
### 202101648

## Frontend
El frontend se realizo con vite-react, en este tambien usamos ciertas dependencias que podian ser instaladas como charts-js2, visjs network y timeline y react router-dom.

Las dependencias vijs y chart-js2, nos permiten realizar nuestras graficas dentro de nuestro frontend, tanto para los piechart en tiempo real para observar el porcentaje de uso tanto de nuestra ram como nuestro cpu, para hacer nuestra grafica historica, para hacer nuestro grafico de la simulacion de procesos y por ultimo para realizar nuestros arboles de procesos en los que iniciamos desde nuestro proceso padre expandiendonos a los hijos.

Para realizar los cambios en nuestros graficos usamos tanto useEffect para los casos que cambian o se alteran durante la ejecucion, como useState.
Ejemplo en carga de grafico de ram

```

const [data, setData] = useState({
        total:0,
        used:0,
        free:0,
        porcUsed:0,
        porcFree:0
    });

    const getRamData = async () => {
        try {
            const response = await fetch(api/ram);
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
    
```

Router-dom nos permite realizar cambios entre diferentes vistas que tengamos en nuestro frontend, en este caso accedemos a estas por medio de una navbar.

### Configuracion Nginx

Se utilizo un archivo nginx.conf para poder exponer nuestro frontend en el puerto 80, este ademas nos permite trabajar de forma sencilla proxis para no tener que colocar la ruta de nuestro backend directamente en el front.
Un ejemplo de como se puede ver este archivo es el siguiente

```

server {
    listen 80
    root /usr/share/nginx/html
    index index.html
    
    location / {
        try_files $uri $uri/ /index.html
    }
    
    location /api {
        proxy_pass http://nombre_contenedor:puerto_backend
    }
}

```

## Modulos
Utilizamos tres modulos diferentes que son insertados en el Kernel de nuestra maquina de Linux.

#### Modulo de Ram
Este nos permite obtener el porcentaje de utilizacion y el porcentaje libre de ram que tenemos en tiempo real, por medio de este podemos realizar posteriormente lo que son nuestros graficos de tiempo real en el frontend y lo que es el grafico de uso historico.
Formato:

```

{
{"totalRam": 15664, 
"used": 13155, 
"free": 2509, 
"porcUsed": 83, 
"porcNotUsed": 17}
}

```

#### Modulo de CPU
Este nos permite obtener el porcentaje de utilizacion y el porcentaje libre de cpu que tenemos en tiempo real, por medio de este podemos realizar posteriormente lo que son nuestros graficos de tiempo real en el frontend y lo que es el grafico de uso historico.
Formato:

```

{
"cpu_total":47518943731316,
"cpu_en_uso":16862400000000,
"PorcUsed":35,
"PorcNotUsed":65
}

```

#### Modulo de Procesos
Este nos permite saber que procesos existen dentro de nuestro computador, devolviendolos un json en el que tenemos en formato de array todos los procesos, con informacion como su pid, sus hijos, si este tiene un padre entre otros datos.
Formato:

```

{
"processes":[
{"pid":1,
"name":"systemd",
"user": 0,
"state":1,
"ram":0,
"child":[
{"pid":499,
"name":"systemd-journal",
"state":1,
"pidPadre":1
}

```

### Backend
Para la realizacion del backend se utilizo el lenguaje de programacion GO. En este para la realizacion de lo que fue nuestra api utilizamos fiber. Para la realizacion de funciones como poder obtener los datos se utiliza os/exec, lo que nos permite ejecutar comando de consola y obtener su resultado. Para poder realizar el parseo de nuestros strings a formato json utilizamos una funcion de golang llamada unmarshall.Por ultimo tambien utilizamos librerias para realizar una conexion y carga de datos a los que es una base de datos realizada en MySQL.
Nuestro Backend se realizo para que estuviera corriendo en el puerto 3002, usando rutas como /ram, /cpu, /historical entre otras para realizar las funcionalidades necesarias y poder mostrar resultados en nuestro frontend.

### Base de Datos
Se utilizo MySQL como base de datos, esta fue obtenida por medio de una imagen de docker, con la que se realiza un volumen para que podamos tener persistencia de datos en nuestro programa si en algun momento reiniciamos nuestro contenedor, esta almacena los datos de porcentajes de uso y libre tanto de CPU como RAM y las fechas y horas en las que estos datos fueron recolectados.

### DOCKER
Utilizamos docker para realizar imagenes de cada uno de nuestros servicios es decir, Backend, Frontend y Base de Datos esto con el fin, de que se encontraran en dockerhub y posteriormente pudieramos realizar un docker compose, esto con el fin de utilizar nuestro programa en los que es ubuntu server 22.04
Docker nos permite evitar el problema de que nos funcione local pero luego si cambiamos de alguna o otra forma algo deje de servir. Ademas de esto el comando docker compose nos permite realizar una ejecucion de todos nuestros servicios a la vez. Para esto se debe realizar un dockerfile en cada servicio que tenemos y por ultimo un docker-compose.yaml

### FUNCIONALIDADES

#### Graficas en tiempo real
Estas son graficas que nos presentan los porcentajes de uso y libre del CPU y RAM por medio de un piechart.

#### Grafica Historica
Esta grafica nos permite saber el rendimiento de nuestro CPU y RAM por medio de un grafico lineal.

#### Simulador de procesos
Este nos permite crear un proceso desde nuestro frontend y en el mismo por medio de vis.js podremos observar sus estados, ya sea iniciado, en pausa o detenido.

#### Arbol de Procesos
Este nos permite seleccionar un PID padre de algun proceso y posteriormente por medio de vis.js podemos realizar un arbol partiendo de este PID padre hacia lo que son sus procesos hijos.

