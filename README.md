# ***Status Code 404: El Buen Sabor***

El delivery de comidas de la ciudad “El Buen Sabor” ofrece a sus clientes una amplia variedad de bebidas y de comidas de fabricación propia. Posee un horario de atención de lunes a domingos de 20:00 a 00:00, y de sábados y domingos de 11:00 a 15:00. Los clientes tienen a disposición un menú que describe para cada una de las comidas, el nombre, los ingredientes y el precio. Los clientes realizan sus pedidos en el mostrador del local mediante una PC o pueden hacerlo en forma remota desde su casa o su celular personal. 

### Integrantes 

- [Matías Barreto](https://github.com/MatiasBarreto93) 

- [Jonathan Videla](https://github.com/jonathanvidela94)

### Wireframes Proyecto
🔗 [El Buen Sabor - Figma](https://www.figma.com/file/3y2S3mpFNwlaaWTVIAhapU/Landing-Page?t=STa59lO90YlC98Zt-6)

### Languages and Tools:

<p align="left">
    <a href="https://git-scm.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="40" height="40"/></a>
    <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/></a>
    <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/></a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/></a>
    <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a>
    <a href="https://www.figma.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/figma/figma-icon.svg" alt="figma" width="40" height="40"/></a>
    <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/></a>
    <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/></a>
    <a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a>
    <a href="https://www.linux.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" alt="linux" width="40" height="40"/></a>
</p>

# Deployment

## Configuracion de Auth0

[![name](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Logo_de_Auth0.svg/640px-Logo_de_Auth0.svg.png)](https://auth0.com/)

1. Inicia sesión en tu cuenta de Auth0 en el panel de control de Auth0.

2. Haz clic en "Applications" (Aplicaciones) en el menú de la izquierda y luego en el botón "Create Application" (Crear Aplicación).

3. Selecciona "Single Page Web Applications" (Aplicaciones web de página única) como el tipo de aplicación.

4. Asigna un nombre descriptivo a tu aplicación en el campo "Name" (Nombre).

5. Haz clic en "Create" (Crear) para crear la aplicación.

6. Una vez creada la aplicación, serás redirigido a la página de configuración de la misma. En esta página, encontrarás el Client ID (ID de cliente) de tu aplicación.

7. En la pestaña de configuracion en Application URIs, colocar en "Allowed Callback URLs", Allowed Logout URLs" Y Allowed Web Origins", el puerto por defecto de VITE http://localhost:5173/ o continua con el paso 8 para usar un puerto distinto.

8. En el archivo package.json de la aplicación modifica lo siguiente y agrega el numero de puerto que quieras utilizar.
```bash
  "scripts": {
    "dev": "vite --port 8000"
    }
```

9. Una vez creada la SPA con React en Auth0, vamos a ir a dashboard en la pestaña de Applications , APIs y creamos una segun la documentacion para obtener la "API Audience".

10. Volvamos a la pestaña principal de Applications, APIs y vamos a seleccionar la API llamada "Auth0 Management API" y en la pestaña de "Machine to Machine Applications" vamos a autorizar nuestra API creada en el paso 9.

11. Para ejecutar el proyecto es necesario crear un archivo .env en la raiz del proyecto con lo siguientes campos

```bash
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=
VITE_AUTH0_API_CLIENT_ID=
VITE_AUTH0_API_CLIENT_SECRET=
VITE_AUTH0_API_AUDIENCE=
VITE_BACKEND_API_URL=
```

12. Vamos a dirijirnos a Applications y seleccionamos la SPA que acabamos de crear, en la pestaña de configuracion vamos a obtener nuestro "Domain" y "Client ID". Ejemplo:
```bash
Domain: dev-1kii45340wusnxas.us.auth0.com
Client ID: ZT3455o2r5UD19837KJ7Zk6CDMNS234r
```
13. Una vez colocado el "Domain" y "Client ID" en el archivo .env vamos a dirijirnos a Applications, APIs y vamos a copiar el campo "API Audience" de nuestra API creada en el paso 9 y la "API Audience" de "Auth0 Management API". Ejemplo:
```bash
API Audience de Auth0: dev-1kii45340wusnxas.us.auth0.com/api/v2/
API Audience nuestra Applicacion: https://elbuensabor
```

14.Vamos a ir Applications y seleccionar "API Explorer Application", y vamos a copiar el "Client ID" y el "Client Secret" (Checkee que la cadena de caracteres sea distinta a la Aplicacion SPA creada en el paso 6, estos datos son de la "API Auth0 Management"). Ejemplo:
```bash
API Client ID: BYC23asfdfg9lYs5298poisnmMJzaAPSg
API Client Secret: 34DF0EVCKLJA2iNPf8XlnB22-SAHZ5_198SJASDLKJ8oSA2DXDSQ_34KJDHF
```

15. Sin salir de la pestaña donde se encuentra API Explorer Application y luego de terminar de configurar el archivo .evn, vamos a ir a la pestaña de "APIs" y vamos a autorizar nuesta API creada en el paso 9.

16. Una vez termina de configurar el archivo .env vamos a dirijirnos en el dashboard al menu "User Management", "Roles" y vamos a crear los siguientes roles de esta forma:
```bash
(Name, Description)
Admin, Level 1 Access
Cajero, Level 2 Access
Cocinero, Level 3 Access
Repartidor Level 4 Access
Cliente, Level 5 Access
```

17.Luego de crear el "Rol" de Cliente vamos a hacerle click para entrar en su menu y obtener el "Role ID", guardalo para el proximo paso. Ejemplo:
```bash
Role ID: "rol_18JKLsNJtLlk2s23"
```

18. Una vez creado los roles y obtenido el "Role ID" de "Cliente", vamos a ir al dashboard al menu "Actions", "Flows" y vamos a seleccionar la opcion de "Post User Registration" y en "Custom" vamos a darle click al boton "+" para crear una regla para asignarle el rol de "Cliente" cuando un usuario se registra en nuestra pagina. El codigo seria el siguiente, con algunos datos del archivo .env previamente configurado:
```bash
exports.onExecutePostUserRegistration = async (event, api) => {

  const ManagementClient = require('auth0').ManagementClient;

  const management = new ManagementClient({
      domain: "AUTH0_DOMAIN",
      clientId: "AUTH0_API_CLIENT_ID",
      clientSecret: "AUTH0_API_CLIENT_SECRET",
  });

  const params =  { id : event.user.user_id};
  const data = { "roles" : ["ROLE ID: CLIENTE"]};

  try {
      const res = await management.assignRolestoUser(params, data)
  } catch (e) {
    console.log(e)
  } 
};
```

19. Una vez configurado lo del paso 18, haz click en "Save Draft" y luego en "Deploy" vamos a volver al menu de "Flows" y en la pestaña de "Custom" vamos a visualizar nuestra nueva regla, solo hace falta arrastrarla y colocarla entre "Start" y "Complete", por ultimo hacer click en "Deploy"

20. Configuracion de Auth0 terminada

## Documentacion Auth0

[Auth0 Documentation](https://auth0.com/docs)

[Auth0 SPA React Quickstart](https://auth0.com/docs/quickstart/spa/react/interactive)

[Auth0 APIs](https://auth0.com/docs/get-started/auth0-overview/set-up-apis)

[Auth0 Roles](https://auth0.com/docs/manage-users/access-control/configure-core-rbac/roles)

[Authentication and Authorization Flows](https://auth0.com/docs/get-started/authentication-and-authorization-flow)


[API AUTH0 MANAGEMENT](https://auth0.com/docs/api/management/v2)

## Ejecucion del proyecto

1. Clona el repositorio o descargalo como archivo ZIP y extraelo en una carpeta de tu eleccion
```bash
git clone https://github.com/MatiasBarreto93/El-Buen-Sabor-Front
```
2. Antes de continuar es necesario tener instalado [Node.js](https://nodejs.org/es) en el ordenador, si ya lo tienes instalado sigue con el siguiente paso.

3. Luego de configurar Auth0 y colocar el archivo .env en el directorio raiz del proyecto

4. Abre la terminal y asegurate estar en el directorio raiz del proyecto
```bash
D:\...\...\...\El-Buen-Sabor-Front> 
```

5. Ejecuta el siguiente comando:
```bash
npm install
```

Deberia ser algo similar a esto:
```bash
D:\...\...\...\El-Buen-Sabor-Front> npm install
```

6. Una vez instaladas todas las dependencias el proyecto esta listo para ejecutarse con el siguiente comando:
```bash
npm run dev
```

7. Fin de la configuracion
