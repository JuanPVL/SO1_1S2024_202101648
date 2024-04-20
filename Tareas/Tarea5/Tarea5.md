# Ensayo
## Conferencia  Kubernetes: Tipos de Servicios y la Integración de Kafka con Strimzi

| Nombre | Carné |
| --- | --- |
| Juan Pedro Valle Lema | 202101648 |



---
---
Kubernetes es una plataforma portable y extensible de código abierto, utilizada para administrar cargas de trabajo y servicios. Este facilita la automatización y configuración declarativa, ademas, cuenta con un ecosistema grande y en rapido crecimiento. Kubernetes tiene varias caracteristicas que lo vuelven una herramienta muy util para desarrolladores. Primero este ofrece un entorno centrado en contenedores, segundo es una plataforma de microservicios, por ultimo, este es una plataforma portable en la nube. Este cuenta con diversos aspectos como los pods, estos son los objetos mas pequeños y básicos que pueden implementarse. Un pod es una representación de la instancia unica de un proceso en ejecución dentro de nuestro cluster. Luego tenemos los deployments que son objetos los cuales representan una aplicación dentro de nuestro cluster. Posteriormente tenemos los servicios de Kubernetes, estos son el objeto API que describe cómo podremos acceder a las aplicaciones, vistas como un conjunto de pods, y que puede describir puertos y balanceadores de carga. Dentro de Kubernetes existen diversos tipos de servicio, sin embargo podemos tomar en cuenta los tres más comunes. Primero, ClusterIP, esta nos muestra un servicio al cual solo podemos acceder por medio de un Cluster. Segundo, NodePort, este nos muestra un servicio al cual accedemos por medio de un puerto estatico en la IP de cada nodo. Por ultimo, LoadBalancer, este nos muestra el servicio a través del balanceador de carga del proveedor de nube que nos encontremos utilizando. 

Ingress, este es un objeto que nos permite controlar diversos aspectos de nuestra red dentro del cluster de Kubernetes. Ingress Controler, es una opcion que se refiere a un tipo de balanceador de carga especializado para esta plataforma, así como otros entornos que se encuentren relacionados con contenedores.

Por otro lado, tenemos a Kafka. Apache Kafka, es una plataforma creada para la transmisión de datos con la cual, podemos realizar acciones como publicar, almacenar, procesar flujos de eventos de forma inmediata y suscribirnos a los mismos. ZooKeper, es una aplicación encargada de gestionar los diversos recursos de kafka como sus brokers, enviando notificaciones a estos en caso surja un cambio como la creación de un topico, la caida de un broker, la recuperación de un broker, entre otros.

Kafka, se compone de tres componentes fundamentales. Primero los productores, estos son los encargados de escribir los mensajes que seran enviados a traves de Kafka. Segundo los consumidores, estos son los encargados de recibir, leer y procesar los mensajes que son enviados por los productores. Por ultimo, los brokers, que son los nodos que conforman un Cluster de Kafka, en los cuales se almacena y distribuye la data.

Por ultimo, tenemos Strimzi, este nos provee un conjunto de operadores para ejecutar un cluster de Kafka que se encuentre en Kubernetes, permitiendo así de forma sencilla tenre diversas configuraciones de despliegue. Dentro del desarrollo se puede usar minikube, para producción podriamos crear nuestro cluster en base en nuestras necesidades, haciendo uso de caracteristicas como rack awareness para distribuir los brockers por zonas de disponibildiad y Kubernteres taints y tolerations pra ejecutar Kafka por medio de nodos dedicados.

---

### Captura Inicio

![image](https://github.com/JuanPVL/SO1_1S2024_202101648/assets/98924809/ce780e07-8ac3-40e1-ae42-44c4a7ed848c)

![image](https://github.com/JuanPVL/SO1_1S2024_202101648/assets/98924809/d6a7310b-102f-402b-92e5-43df9b925b7d)


---

### Captura Final

![image](https://github.com/JuanPVL/SO1_1S2024_202101648/assets/98924809/762a743b-3d8a-4f96-b1ec-14cded2b5b42)

![image](https://github.com/JuanPVL/SO1_1S2024_202101648/assets/98924809/4b7a99be-46b5-4018-bb27-3a630dbcb968)


--- 
