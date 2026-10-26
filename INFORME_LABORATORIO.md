# INFORME DE LABORATORIO: INTEGRACIÓN CONTINUA CON GITHUB Y CIRCLECI
**Asignatura:** DevOps / Ingeniería de Software  
**Institución:** ITM  
**Fecha:** 26 de Octubre de 2026  
**Estudiante:** Libardo  

---

## 1. INTRODUCCIÓN Y OBJETIVOS

### 1.1 Objetivo General
Configurar un flujo de trabajo de Integración Continua (CI/CD) automatizado utilizando **GitHub** como sistema de control de versiones y **CircleCI** como plataforma de integración en la nube, validando la construcción y calidad de una aplicación web interactiva.

### 1.2 Objetivos Específicos
1. Desarrollar una interfaz web interactiva basada en estándares HTML5, CSS3 y JavaScript moderno.
2. Controlar las versiones del proyecto mediante Git y publicar el código fuente en un repositorio remoto de GitHub.
3. Crear un archivo de configuración `.circleci/config.yml` que defina los flujos de trabajo (*workflows*) y trabajos (*jobs*) de verificación continua.
4. Conectar el repositorio de GitHub con la plataforma CircleCI y verificar la ejecución exitosa de los pipelines automatizados ante cada confirmación (*commit*).

---

## 2. DESARROLLO DEL LABORATORIO Y EVIDENCIAS (PANTALLAZOS)

### Paso 1: Creación y Verificación de la Aplicación Web
Se diseñó la aplicación **Aetheria // Orbit AI**, un centro de telemetría orbital con diseño moderno (*Glassmorphism*), radar de escaneo estelar, visualización de métricas en tiempo real y consola interactiva.

> **EVIDENCIA 1: Página web cargada y operativa en el navegador**
> 
> *(Inserta aquí la imagen `pantallazo_1_pagina_web.png`)*
> 
> *Descripción:* Se observa la interfaz gráfica cargada en el navegador, mostrando la cabecera con el estado de sincronización, el radar de barrido, las tarjetas de métricas de telemetría orbital y la matriz de análisis espectrográfico.

---

### Paso 2: Control de Versiones con Git en la Terminal Local
Se inicializó el repositorio local con `git init`, se verificó el estado de los archivos mediante `git status`, se agregaron al área de preparación (*staging*) con `git add .`, se realizó el commit inicial y se vinculó la rama `main` al origen remoto en GitHub con `git push -u origin main`.

> **EVIDENCIA 2: Ejecución de comandos Git en la terminal**
> 
> *(Inserta aquí la imagen `pantallazo_2_terminal_git.png`)*
> 
> *Descripción:* Registro de la consola de PowerShell evidenciando la secuencia completa de comandos `git init`, `git add .`, `git commit` y el envío exitoso de los objetos hacia el repositorio remoto en GitHub.

---

### Paso 3: Repositorio Publicado en GitHub
Una vez enviado el código, se verificó en la plataforma de GitHub que todos los archivos del proyecto estuvieran disponibles, incluyendo la carpeta de configuración `.circleci/` y el archivo `README.md` profesional con las insignias de estado.

> **EVIDENCIA 3: Vista del repositorio en GitHub con sus archivos**
> 
> *(Inserta aquí la imagen `pantallazo_3_github_repo.png`)*
> 
> *Descripción:* Interfaz web de GitHub que confirma la presencia de los archivos fuente (`index.html`, `style.css`, `app.js`), la carpeta oculta `.circleci/` y el README técnico.

---

### Paso 4: Conexión y Configuración del Proyecto en CircleCI
Se inició sesión en CircleCI mediante autenticación con GitHub (OAuth), se localizó el repositorio en el panel de **Projects** y se seleccionó la opción de configuración que utiliza el archivo existente en el repositorio: **"Fastest: Use the .circleci/config.yml in my repo"**.

> **EVIDENCIA 4: Detección y vinculación del proyecto en CircleCI**
> 
> *(Inserta aquí la imagen `pantallazo_4_circleci_setup.png`)*
> 
> *Descripción:* Pantalla de CircleCI detectando automáticamente la configuración del archivo `.circleci/config.yml` en la rama `main` y habilitando el botón de disparo inicial (*Trigger Pipeline*).

---

### Paso 5: Ejecución y Validación del Pipeline de CI/CD
El pipeline se ejecutó automáticamente ejecutando dos trabajos consecutivos:
1. `validate_and_test`: Levantó un contenedor Docker con Node.js y validó la sintaxis y tests del proyecto.
2. `package_artifacts`: Generó el archivo comprimido descargable (`.tar.gz`) almacenado en la pestaña *Artifacts*.

> **EVIDENCIA 5: Pipeline completado exitosamente (Estado: SUCCESS)**
> 
> *(Inserta aquí la imagen `pantallazo_5_circleci_success.png`)*
> 
> *Descripción:* Tablero de CircleCI indicando que el pipeline finalizó con estado verde (**SUCCESS**), con los dos trabajos (`validate_and_test` y `package_artifacts`) aprobados al 100% y el artefacto generado.

---

## 3. CONCLUSIONES

1. **Automatización:** La integración entre GitHub y CircleCI permite detectar errores de forma temprana antes de llevar el software a producción, ahorrando tiempo y garantizando calidad.
2. **Infraestructura como Código (IaC):** Definir el pipeline mediante un archivo declarativo `.circleci/config.yml` facilita que el proceso de despliegue y pruebas viaje junto con el código del proyecto.
3. **Trazabilidad:** Cada cambio realizado mediante un commit en Git queda registrado y auditado por la plataforma de CI/CD con su respectivo tiempo de ejecución y resultado.
