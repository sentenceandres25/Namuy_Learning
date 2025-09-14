Servicio Nacional de Aprendizaje (SENA)
Tecnología en Análisis y Desarrollo de Software
Asignatura: GA1-220501092-AA1













Actividad: GA7-220501096-AA1-EV04 instalación y configuración de herramienta de versionamiento (Local / Web) 
Título del Proyecto: Acceso inclusivo a educación digital en sectores vulnerables de EE. UU. y Colombia mediante Namuy Learning LLC














Estudiante: Jimmy Andrés Ordóñez Beltrán
Instructor: Usein Gonzalez Zapata
Septiembre 13 del 2025
1. Introducción
La gestión del versionamiento de software constituye un pilar de la integración continua. En el presente documento se evidencia la instalación y configuración de Git a nivel local, su integración con Visual Studio Code (VS Code) y la conexión a un repositorio remoto alojado en GitHub. Se toma como base el proyecto existente Namuy_Learning, con la rama de trabajo solvinggeneralsissues, a partir del cual se verifican operaciones de confirmación (commit), publicación (push) y consulta de historial.
2. Objetivos
General. Implementar y documentar un entorno de versionamiento local-remoto con Git, VS Code y GitHub, dejando evidencia de su operación sobre el repositorio Namuy_Learning.
Específicos.
1.	Instalar y verificar Git en el equipo local.
2.	Configurar parámetros globales de Git (identidad, rama inicial, editor).
3.	Operar el repositorio Namuy_Learning en VS Code y confirmar cambios.
4.	Enlazar y publicar ramas en el remoto GitHub (primer push y verificación).
5.	Registrar evidencia mediante capturas de pantalla numeradas.
3. Alcance y requerimientos
•	SO: Windows 10/11.
•	Herramientas: Git for Windows, VS Code, cuenta en GitHub.
•	Proyecto: Repositorio existente sentenceandres25/Namuy_Learning (GitHub).
•	Seguridad: Se recomienda autenticación SSH (alternativa HTTPS con Git Credential Manager).
4. Herramientas utilizadas
•	Git for Windows: sistema de control de versiones distribuido.
•	Visual Studio Code: editor con integración nativa de Git.
•	GitHub: plataforma web para hospedaje del repositorio remoto.
5. Procedimiento — Instalación y configuración local (Git + VS Code)
5.1 Instalación de Git
1.	Descargar Git for Windows desde el sitio oficial e iniciar el asistente.
2.	Opciones recomendadas: editor por defecto Visual Studio Code; rama inicial main; PATH “Git from the command line…”; fin de línea “Checkout Windows-style, commit Unix-style”; Git Credential Manager habilitado.
Figura 1 — Instalador de Git: selección de editor y opciones recomendadas. 
 
5.2 Verificación de instalación y configuración inicial
Abrir la terminal integrada de VS Code (Terminal > New Terminal) y ejecutar:
git --version
git config --global user.name  "Jimmy Andrés Ordóñez Beltrán"
git config --global user.email "correo@ejemplo.com"
git config --global init.defaultBranch main
git config --global core.autocrlf true
git config --global core.editor "code --wait"
git config –list
Figura 2 — Verificación de Git: salida de git --version. 
 
Figura 3 — Configuración global: salida de git config --list. 
 
6. Procedimiento — Configuración remota (GitHub) y operación con Namuy_Learning
En la evidencia se trabaja directamente sobre el repositorio Namuy_Learning ya clonado y abierto en VS Code (rama activa solvinggeneralsissues).
6.1 Apertura del proyecto en VS Code
•	Abrir la carpeta del proyecto: Namuy_Learning.
•	Confirmar rama activa en la barra de estado (parte inferior): solvinggeneralsissues.
Figura 4 — VS Code con el proyecto Namuy_Learning abierto (archivo package.json visible y rama solvinggeneralsissues). 
 
6.2 Verificación de remoto y ramas
pwd
git status
git remote -v
git branch -vv



Figura 5 — Terminal integrada mostrando git remote -v con origin apuntando a GitHub. 
 
6.3 Publicación de ramas
•	Publicación de la rama principal (si existe localmente):
git switch main       # o: git checkout main
git pull --rebase origin main  # si ya existe en remoto
git push -u origin main
•	Publicación de la rama de trabajo actual (solvinggeneralsissues):
git switch solvinggeneralsissues   # si no está ya activa
git push -u origin solvinggeneralsissues
Figura 6 — Publicación exitosa (git push -u origin solvinggeneralsissues). 
 
6.4 Evidencia de cambios
1.	Crear la carpeta de documentación y el archivo de la evidencia:
mkdir -p docs
Crear en VS Code el archivo: docs/EV04_instalacion_configuracion.md pegando los apartados de este informe (Introducción, Objetivos, Procedimiento y Conclusiones) y guardar.
2) Confirmar y publicar:
git add docs/EV04_instalacion_configuracion.md
git commit -m "docs(EV04): instalación y configuración Git + VS Code + GitHub"
git push

7. Verificación del flujo de trabajo

Modificar un archivo existente (por ejemplo, README.md).

Confirmar y publicar:
git add README.md
git commit -m "docs: actualiza README con referencias EV04"
git push
Validar historial:
git log --oneline --graph --decorate -n 10
Figura 10 — Cambios detectados en Source Control antes del commit. (insertar)
Figura 11 — Historial de commits (git log --oneline --graph). (insertar)

8. Resultados

Se dejó operativo el entorno de versionamiento con Git y VS Code, vinculado al repositorio remoto de GitHub Namuy_Learning. Se publicaron ramas (main y solvinggeneralsissues), se agregó la documentación EV04 al repositorio y se verificó el historial de cambios en la plataforma web.

9. Conclusiones

La combinación de Git y VS Code facilita un flujo de trabajo local eficiente y seguro, mientras que GitHub provee el punto de colaboración y respaldo remoto. El repositorio Namuy_Learning queda integrado al proceso de versionamiento con capacidad de trazabilidad, publicación y revisión en línea, cumpliendo los requisitos de la EV04.

10. Anexos
10.1 .gitignore recomendado (mixto React + Python + VS Code)