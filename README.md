# Introduction 
guipmc-casuistica es el proyecto construido en angular 9 perteneciente al IMSS para el proyecto de PMC y es el front-end del sistema con base en micro servicios.

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Configuration
Para la configuración en los diversos ambientes QA, UAT y PROD solo se necesita configurar los proxy reverse por el equipo de NetIQ según corresponda cada ambiente. 

{
    "/pmc/**": {
        "target": "https://pmc-qa.imss.gob.mx",
        "pathRewrite": {
            "^/pmc": ""
        }
    },

    "/serviciosDigitales-rest": {
        "target": "http://serviciosdigitalesinterno-stage.imss.gob.mx/serviciosDigitales-rest",
        "secure": false,
        "pathRewrite": {
            "^/serviciosDigitales-rest": ""
        },
        "changeOrigin": true,
        "logLevel": "debug"
    },

    "/mspmcarchivos": {
        "target": "http://localhost:8030/mspmcarchivos",
        "secure": false,
        "pathRewrite": {
            "^/mspmcarchivos": ""
        },
        "changeOrigin": true,
        "logLevel": "debug"
    },
    "/cifrascontrol": {
        "target": "http://localhost:8033/cifrascontrol",

        "secure": false,
        "pathRewrite": {
            "^/cifrascontrol": ""
        },
        "changeOrigin": true,
        "logLevel": "debug"
    },
    "/mspmccatalogos": {
        "target": "http://localhost:8029/mspmccatalogos",
        "secure": false,
        "pathRewrite": {
            "^/mspmccatalogos": ""
        },
        "changeOrigin": true,
        "logLevel": "debug"
    },
    "/msmovimientos": {
        "target": "http://localhost:8037/msmovimientos",
        "secure": false,
        "pathRewrite": {
            "^/msmovimientos": ""
        },
        "changeOrigin": true,
        "logLevel": "debug"
    },
    "/msseguridad": {
        "target": "http://localhost:9010/msseguridad",
        "secure": false,
        "pathRewrite": {
            "^/msseguridad": ""
        },
        "changeOrigin": true,
        "logLevel": "debug"
    },
    "/msvalidacionlocal": {
        "target": "http://localhost:9011/msvalidacionlocal",
        "secure": false,
        "pathRewrite": {
            "^/msvalidacionlocal": ""
        },
        "changeOrigin": true,
        "logLevel": "debug"
    },
    "/msvalidacionAlmacenes": {
        "target": "http://localhost:8036/msvalidacionAlmacenes",
        "secure": false,
        "pathRewrite": {
            "^/msvalidacionAlmacenes": ""
        },
        "changeOrigin": true,
        "logLevel": "debug"
    },
    "/msvalidaciondupsus": {
        "target": "http://localhost:9012/msvalidaciondupsus",
        "secure": false,
        "pathRewrite": {
            "^/msvalidaciondupsus": ""
        },
        "changeOrigin": true,
        "logLevel": "debug"
    },
    "/mscambios": {
        "target": "http://localhost:9014/mscambios",
        "secure": false,
        "pathRewrite": {
            "^/mscambios": ""
        },
        "changeOrigin": true,
        "logLevel": "debug"
    }


}


Nota: Las ips y rutas de los servicios aquí descritas son desarrollo, se debe configurar cada ambiente según corresponda en el archivo guipmc-casuistica\proxy.config.json. 

# Build and Test
Para ejecutar el código en un ambiente de desarrollo solo ejecuta la siguiente sentencia: 
ng serve --proxy-config proxy.config.json

Para compilar el proyecto para despliegue en producción ejecutar la siguiente sentencia: 
ng build --deploy-url pmc/ --prod


# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)