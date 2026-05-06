# Backend Aulas UAGRM

API backend para la gestion de aulas, ubicaciones, carreras, materias, grupos de materia, horarios y auditorias, construida con Node.js, Express y SQL Server.

## Tecnologias

- Node.js
- Express
- SQL Server
- mssql
- dotenv
- cors
- nodemon

## Instalacion

```bash
npm install
```

## Ejecucion

Desarrollo:

```bash
npm run dev
```

Produccion:

```bash
npm start
```

## Variables de entorno

Crear el archivo `.env` en la raiz del proyecto:

```env
PORT=3001
DB_SERVER=MICHIBLACK
DB_INSTANCE=SQLEXPRESS
DB_DATABASE=uagrm_espacios2
DB_TRUSTED_CONNECTION=true
DB_TRUST_CERT=true
```

Si en algun momento usas autenticacion SQL, tambien puedes agregar:

```env
DB_USER=sa
DB_PASSWORD=tu_password
DB_PORT=1433
DB_ENCRYPT=false
```

## Base URL

```text
http://localhost:3001
```

## Mapa de integracion Frontend / Backend

Documento de referencia rapida para ver, por modulo, que envia el frontend y que espera recibir el backend.

### Convenciones generales

- El frontend consume el backend en `http://localhost:3001/api`.
- Los listados usan `GET`.
- Los formularios de alta usan `POST`.
- Los formularios de edicion usan `PUT` con el identificador en la URL.
- Algunas pantallas del frontend filtran en memoria y no via backend.
- En varias entidades el backend usa nombres de llave distintos a `id`.

### Resumen rapido

| Modulo | Llave principal backend |
|---|---|
| Ubicaciones | `id_ubicacion` |
| Tipos de espacio | `id_tipo_espacio` |
| Espacios | `id_espacio` |
| Carreras | `id_carrera` |
| Materias | `id_materia` |
| Grupos de materia | `id_grupo_materia` |
| Horarios de asignacion | `id_horario` |
| Usuarios | `id_usuario` |
| Registros de espacio | `id_registro` |
| Registros de asignacion | `id_registro` |

### 1. Ubicaciones

#### Endpoints backend
- `GET /api/ubicaciones`
- `GET /api/ubicaciones/:id`
- `POST /api/ubicaciones`
- `PUT /api/ubicaciones/:id`
- `DELETE /api/ubicaciones/:id`

#### Query params para GET /api/ubicaciones
- `?tipo=FACULTAD` - Filtrar por tipo
- `?search=INGENIERIA` - Buscar en nombre o descripcion
- `?activo=SI` - Filtrar por estado activo

#### Frontend envia
- `nombre`
- `tipo`
- `id_padre` opcional
- `descripcion` opcional
- `activo` opcional en create, obligatorio en update

#### Backend recibe
- `nombre`
- `tipo`
- `id_padre` opcional
- `descripcion` opcional
- `activo` opcional en create, obligatorio en update

#### Respuesta del backend
- `id_ubicacion`
- `nombre`
- `tipo`
- `id_padre`
- `nombre_padre`
- `descripcion`
- `activo`

#### Nota
- El frontend debe usar `id_ubicacion` como llave principal.
- Si no se envia `id_padre` al editar, el backend conserva el padre actual.

### 2. Tipos de espacio

#### Endpoints backend
- `GET /api/tipos-espacio`
- `GET /api/tipos-espacio/:id`
- `POST /api/tipos-espacio`
- `PUT /api/tipos-espacio/:id`
- `DELETE /api/tipos-espacio/:id`

#### Query params para GET /api/tipos-espacio
- `?search=AULA` - Buscar en nombre

#### Frontend envia
- `nombre`

#### Backend recibe
- `nombre`

#### Respuesta del backend
- `id_tipo_espacio`
- `nombre`

#### Nota
- El frontend debe usar `id_tipo_espacio` como llave principal.

### 3. Espacios

#### Endpoints backend
- `GET /api/espacios`
- `GET /api/espacios/:id`
- `POST /api/espacios`
- `PUT /api/espacios/:id`
- `DELETE /api/espacios/:id`

#### Query params para GET /api/espacios
- `?id_ubicacion=1` - Filtrar por ubicacion
- `?id_tipo_espacio=2` - Filtrar por tipo de espacio
- `?search=101` - Buscar en codigo o nombre
- `?estado=ACTIVO` - Filtrar por estado (ACTIVO, INACTIVO, MANTENIMIENTO)

#### Frontend envia
- `id_ubicacion`
- `id_tipo_espacio`
- `codigo`
- `nombre` opcional
- `capacidad` opcional
- `piso` opcional
- `uso_para_clases` opcional
- `latitud` opcional
- `longitud` opcional
- `estado` opcional en create, obligatorio en update
- `observaciones` opcional
- `id_usuario` obligatorio solo en update

#### Backend recibe
- `id_ubicacion`
- `id_tipo_espacio`
- `codigo`
- `nombre` opcional
- `capacidad` opcional
- `piso` opcional
- `uso_para_clases` opcional
- `latitud` opcional
- `longitud` opcional
- `estado` opcional en create, obligatorio en update
- `observaciones` opcional
- `id_usuario` obligatorio solo en update

#### Respuesta del backend
- `id_espacio`
- `id_ubicacion`
- `ubicacion`
- `id_tipo_espacio`
- `tipo_espacio`
- `codigo`
- `nombre`
- `capacidad`
- `piso`
- `uso_para_clases`
- `latitud`
- `longitud`
- `estado`
- `observaciones`
- `fecha_creacion`
- `fecha_actualizacion`

#### Nota
- El frontend debe usar `id_espacio` como llave principal.
- Los filtros de la pantalla de espacios hoy son locales en el navegador.

### 4. Carreras

#### Endpoints backend
- `GET /api/carreras`
- `GET /api/carreras/:id`
- `POST /api/carreras`
- `PUT /api/carreras/:id`
- `DELETE /api/carreras/:id`

#### Query params para GET /api/carreras
- `?search=SISTEMAS` - Buscar en nombre o sigla

#### Frontend envia
- `nombre`
- `sigla` opcional

#### Backend recibe
- `nombre`
- `sigla` opcional

#### Respuesta del backend
- `id_carrera`
- `nombre`
- `sigla`

#### Nota
- El frontend debe usar `id_carrera` como llave principal.

### 5. Materias

#### Endpoints backend
- `GET /api/materias`
- `GET /api/materias/:id`
- `POST /api/materias`
- `PUT /api/materias/:id`
- `DELETE /api/materias/:id`

#### Query params para GET /api/materias
- `?id_carrera=1` - Filtrar por carrera
- `?search=PROG` - Buscar en nombre o sigla

#### Frontend envia
- `id_carrera` opcional
- `sigla`
- `nombre`

#### Backend recibe
- `id_carrera` opcional
- `sigla`
- `nombre`

#### Respuesta del backend
- `id_materia`
- `id_carrera`
- `carrera`
- `sigla_carrera`
- `sigla`
- `nombre`

#### Nota
- El frontend debe usar `id_materia` como llave principal.

### 6. Grupos de materia

#### Endpoints backend
- `GET /api/grupos-materia`
- `GET /api/grupos-materia/:id`
- `POST /api/grupos-materia`
- `PUT /api/grupos-materia/:id`
- `DELETE /api/grupos-materia/:id`

#### Query params para GET /api/grupos-materia
- `?id_materia=1` - Filtrar por materia
- `?search=GRUPO` - Buscar en nombre o docente

#### Frontend envia
- `id_materia`
- `grupo`
- `docente` opcional
- `gestion` opcional
- `periodo` opcional
- `cantidad_estudiantes` opcional
- `activo` opcional en create, obligatorio en update

#### Backend recibe
- `id_materia`
- `grupo`
- `docente` opcional
- `gestion` opcional
- `periodo` opcional
- `cantidad_estudiantes` opcional
- `activo` opcional en create, obligatorio en update

#### Respuesta del backend
- `id_grupo_materia`
- `id_materia`
- `materia`
- `sigla_materia`
- `carrera`
- `grupo`
- `docente`
- `gestion`
- `periodo`
- `cantidad_estudiantes`
- `activo`

#### Nota
- El frontend debe usar `id_grupo_materia` como llave principal.

### 7. Horarios de asignacion

#### Endpoints backend
- `GET /api/horarios-asignacion`
- `GET /api/horarios-asignacion/:id`
- `POST /api/horarios-asignacion`
- `PUT /api/horarios-asignacion/:id`
- `DELETE /api/horarios-asignacion/:id`

#### Query params para GET /api/horarios-asignacion
- `?id_espacio=1` - Filtrar por espacio
- `?id_grupo_materia=2` - Filtrar por grupo de materia
- `?dia_semana=LUNES` - Filtrar por dia (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO)
- `?activo=SI` - Filtrar por estado

#### Frontend envia
- `id_espacio`
- `id_grupo_materia`
- `dia_semana`
- `hora_inicio`
- `hora_fin`
- `modalidad` opcional
- `observaciones` opcional
- `activo` opcional en create, obligatorio en update
- `id_usuario` obligatorio solo en update

#### Backend recibe
- `id_espacio`
- `id_grupo_materia`
- `dia_semana`
- `hora_inicio`
- `hora_fin`
- `modalidad` opcional
- `observaciones` opcional
- `activo` opcional en create, obligatorio en update
- `id_usuario` obligatorio solo en update

#### Respuesta del backend
- `id_horario`
- `id_espacio`
- `codigo_espacio`
- `espacio`
- `id_grupo_materia`
- `grupo`
- `sigla_materia`
- `materia`
- `dia_semana`
- `hora_inicio`
- `hora_fin`
- `modalidad`
- `observaciones`
- `activo`

#### Nota
- El frontend debe usar `id_horario` como llave principal.
- El backend genera auditoria automaticamente en updates.

### 8. Usuarios

#### Endpoints backend
- `GET /api/usuarios`
- `GET /api/usuarios/:id`
- `POST /api/usuarios`
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`

#### Frontend envia
- `id_grupo` opcional
- `nombre_completo`
- `correo` opcional
- `telefono` opcional
- `rol` opcional en create, obligatorio en update
- `activo` opcional en create, obligatorio en update

#### Backend recibe
- `id_grupo` opcional
- `nombre_completo`
- `correo` opcional
- `telefono` opcional
- `rol` opcional en create, obligatorio en update
- `activo` opcional en create, obligatorio en update

#### Respuesta del backend
- `id_usuario`
- `id_grupo`
- `nombre_completo`
- `correo`
- `telefono`
- `rol`
- `activo`

#### Nota
- El frontend debe usar `id_usuario` como llave principal.

### 9. Auditoria de espacios

#### Endpoints backend
- `GET /api/registros-espacio`
- `GET /api/registros-espacio/:id`

#### Query params para GET /api/registros-espacio
- `?id_espacio=1` - Filtrar por espacio
- `?id_usuario=2` - Filtrar por usuario
- `?search=UPDATE` - Buscar en detalle o accion

#### Respuesta del backend
- `id_registro`
- `id_espacio`
- `codigo_espacio`
- `espacio`
- `id_usuario`
- `usuario`
- `fecha`
- `accion`
- `detalle`

#### Nota
- Si quieres filtros por texto o por fecha desde el servidor, faltan query params en el backend.

### 10. Auditoria de asignaciones

#### Endpoints backend
- `GET /api/registros-asignacion`
- `GET /api/registros-asignacion/:id`

#### Query params para GET /api/registros-asignacion
- `?id_horario=1` - Filtrar por horario
- `?id_usuario=2` - Filtrar por usuario
- `?search=UPDATE` - Buscar en detalle o accion

#### Respuesta del backend
- `id_registro`
- `id_horario`
- `dia_semana`
- `hora_inicio`
- `hora_fin`
- `id_usuario`
- `usuario`
- `fecha`
- `accion`
- `detalle`

#### Nota
- Si quieres filtros por texto o por fecha desde el servidor, faltan query params en el backend.

### 11. Ruta raiz

#### Endpoint backend
- `GET /`

#### Respuesta esperada
- `message: "API UAGRM Espacios funcionando correctamente"`

### 12. Funcionalidades implementadas en el backend

✅ Filtros por `search` en listados generales (busqueda de texto).
✅ Filtros por `activo` y `estado` en listados generales.
✅ Filtros por relaciones, por ejemplo `id_carrera`, `id_ubicacion`, `id_tipo_espacio`, `id_materia`.
✅ Filtros por dia de semana en horarios.
✅ Filtros por usuario en auditorias.
✅ Filtros de auditoria por texto (busqueda en detalle y accion).

### 13. Funcionalidades que el frontend usa pero hoy estan solo en cliente

- Filtros de auditoria por fecha (no disponible en backend por tipo de dato timestamp).
- Resumen de dashboard con conteos.
- Relacion de nombres amigables en tablas, por ejemplo facultad o carrera ya resuelta desde otros listados.

## Formato general de respuesta

La API devuelve JSON. Los listados retornan arreglos y las rutas de detalle retornan un objeto.

Ejemplo de error:

```json
{
  "error": "Mensaje descriptivo"
}
```

## Nota importante sobre ubicaciones

- Para crear una ubicacion nueva, usa `POST /api/ubicaciones`.
- Para editar, usa `PUT /api/ubicaciones/:id`.
- Si por error el frontend envia `id_ubicacion` dentro del body en un `POST`, el backend lo interpreta como actualizacion para evitar duplicados.
- Si no envias `id_padre` al editar, el backend conserva el padre actual.

## Endpoints

---

# 1. Ubicaciones

## GET /api/ubicaciones
Devuelve todas las ubicaciones con su padre, si existe.

### Query params
- `?tipo=FACULTAD` - Filtrar por tipo
- `?search=INGENIERIA` - Buscar en nombre o descripcion
- `?activo=SI` - Filtrar por estado activo

### Ejemplos de uso
```
GET /api/ubicaciones
GET /api/ubicaciones?tipo=FACULTAD
GET /api/ubicaciones?search=INGENIERIA
GET /api/ubicaciones?activo=SI
GET /api/ubicaciones?tipo=FACULTAD&search=ING
```

### Respuesta de ejemplo
```json
[
  {
    "id_ubicacion": 1,
    "nombre": "FACULTAD DE INGENIERIA",
    "tipo": "FACULTAD",
    "id_padre": 10,
    "nombre_padre": "CIUDAD UNIVERSITARIA",
    "descripcion": "",
    "activo": "SI"
  }
]
```

## GET /api/ubicaciones/:id
Devuelve una ubicacion por ID.

### Respuesta de ejemplo
```json
{
  "id_ubicacion": 1,
  "nombre": "FACULTAD DE INGENIERIA",
  "tipo": "FACULTAD",
  "id_padre": 10,
  "nombre_padre": "CIUDAD UNIVERSITARIA",
  "descripcion": "",
  "activo": "SI"
}
```

## POST /api/ubicaciones
Crea una ubicacion.

### Body de ejemplo
```json
{
  "nombre": "FACULTAD DE INGENIERIA",
  "tipo": "FACULTAD",
  "id_padre": 10,
  "descripcion": "Facultad principal",
  "activo": "SI"
}
```

### Respuesta de ejemplo
```json
{
  "id_ubicacion": 25,
  "nombre": "FACULTAD DE INGENIERIA",
  "tipo": "FACULTAD",
  "id_padre": 10,
  "descripcion": "Facultad principal",
  "activo": "SI"
}
```

## PUT /api/ubicaciones/:id
Actualiza una ubicacion.

### Body de ejemplo
```json
{
  "nombre": "FACULTAD DE INGENIERIA",
  "tipo": "FACULTAD",
  "id_padre": 10,
  "descripcion": "Actualizada",
  "activo": "SI"
}
```

### Respuesta de ejemplo
```json
{
  "id_ubicacion": 25,
  "nombre": "FACULTAD DE INGENIERIA",
  "tipo": "FACULTAD",
  "id_padre": 10,
  "descripcion": "Actualizada",
  "activo": "SI"
}
```

## DELETE /api/ubicaciones/:id
Elimina una ubicacion.

### Respuesta de ejemplo
```json
{
  "message": "Ubicacion eliminada correctamente"
}
```

---

# 2. Tipos de espacio

## GET /api/tipos-espacio
### Query params
- `?search=AULA` - Buscar en nombre

### Ejemplos de uso
```
GET /api/tipos-espacio
GET /api/tipos-espacio?search=AULA
```

### Respuesta de ejemplo
```json
[
  {
    "id_tipo_espacio": 1,
    "nombre": "AULA"
  }
]
```

## GET /api/tipos-espacio/:id
### Respuesta de ejemplo
```json
{
  "id_tipo_espacio": 1,
  "nombre": "AULA"
}
```

## POST /api/tipos-espacio
### Body de ejemplo
```json
{
  "nombre": "AULA"
}
```

### Respuesta de ejemplo
```json
{
  "id_tipo_espacio": 1,
  "nombre": "AULA"
}
```

## PUT /api/tipos-espacio/:id
### Body de ejemplo
```json
{
  "nombre": "LABORATORIO"
}
```

### Respuesta de ejemplo
```json
{
  "id_tipo_espacio": 1,
  "nombre": "LABORATORIO"
}
```

## DELETE /api/tipos-espacio/:id
### Respuesta de ejemplo
```json
{
  "message": "Tipo de espacio eliminado correctamente"
}
```

---

# 3. Espacios

## GET /api/espacios
Devuelve todos los espacios con ubicacion y tipo.

### Query params
- `?id_ubicacion=1` - Filtrar por ubicacion
- `?id_tipo_espacio=2` - Filtrar por tipo de espacio
- `?search=101` - Buscar en codigo o nombre
- `?estado=ACTIVO` - Filtrar por estado (ACTIVO, INACTIVO, MANTENIMIENTO)

### Ejemplos de uso
```
GET /api/espacios
GET /api/espacios?id_ubicacion=5
GET /api/espacios?id_tipo_espacio=1
GET /api/espacios?search=101
GET /api/espacios?estado=ACTIVO
GET /api/espacios?id_ubicacion=5&estado=ACTIVO
GET /api/espacios?id_ubicacion=5&search=AULA&estado=ACTIVO
```

### Respuesta de ejemplo
```json
[
  {
    "id_espacio": 1,
    "id_ubicacion": 5,
    "ubicacion": "FACULTAD DE INGENIERIA",
    "id_tipo_espacio": 1,
    "tipo_espacio": "AULA",
    "codigo": "A-101",
    "nombre": "AULA 101",
    "capacidad": 40,
    "piso": "1",
    "uso_para_clases": "SI",
    "latitud": null,
    "longitud": null,
    "estado": "ACTIVO",
    "observaciones": "Grupo de relevamiento: 3",
    "fecha_creacion": "2026-05-06T12:00:00.000Z",
    "fecha_actualizacion": "2026-05-06T12:00:00.000Z"
  }
]
```

## GET /api/espacios/:id
### Respuesta de ejemplo
```json
{
  "id_espacio": 1,
  "id_ubicacion": 5,
  "ubicacion": "FACULTAD DE INGENIERIA",
  "id_tipo_espacio": 1,
  "tipo_espacio": "AULA",
  "codigo": "A-101",
  "nombre": "AULA 101",
  "capacidad": 40,
  "piso": "1",
  "uso_para_clases": "SI",
  "latitud": null,
  "longitud": null,
  "estado": "ACTIVO",
  "observaciones": "Grupo de relevamiento: 3",
  "fecha_creacion": "2026-05-06T12:00:00.000Z",
  "fecha_actualizacion": "2026-05-06T12:00:00.000Z"
}
```

## POST /api/espacios
Crea un espacio.

### Body de ejemplo
```json
{
  "id_ubicacion": 5,
  "id_tipo_espacio": 1,
  "codigo": "A-101",
  "nombre": "AULA 101",
  "capacidad": 40,
  "piso": "1",
  "uso_para_clases": "SI",
  "latitud": null,
  "longitud": null,
  "estado": "ACTIVO",
  "observaciones": "Grupo de relevamiento: 3"
}
```

### Respuesta de ejemplo
```json
{
  "id_espacio": 1,
  "id_ubicacion": 5,
  "id_tipo_espacio": 1,
  "codigo": "A-101",
  "nombre": "AULA 101",
  "capacidad": 40,
  "piso": "1",
  "uso_para_clases": "SI",
  "latitud": null,
  "longitud": null,
  "estado": "ACTIVO",
  "observaciones": "Grupo de relevamiento: 3",
  "fecha_creacion": "2026-05-06T12:00:00.000Z",
  "fecha_actualizacion": "2026-05-06T12:00:00.000Z"
}
```

## PUT /api/espacios/:id
Actualiza un espacio y genera auditoria automaticamente.

### Body de ejemplo
```json
{
  "id_ubicacion": 5,
  "id_tipo_espacio": 1,
  "codigo": "A-101",
  "nombre": "AULA 101",
  "capacidad": 45,
  "piso": "1",
  "uso_para_clases": "SI",
  "latitud": -17.783,
  "longitud": -63.182,
  "estado": "ACTIVO",
  "observaciones": "Capacidad corregida",
  "id_usuario": 1
}
```

### Respuesta de ejemplo
```json
{
  "id_espacio": 1,
  "id_ubicacion": 5,
  "id_tipo_espacio": 1,
  "codigo": "A-101",
  "nombre": "AULA 101",
  "capacidad": 45,
  "piso": "1",
  "uso_para_clases": "SI",
  "latitud": -17.783,
  "longitud": -63.182,
  "estado": "ACTIVO",
  "observaciones": "Capacidad corregida",
  "fecha_creacion": "2026-05-06T12:00:00.000Z",
  "fecha_actualizacion": "2026-05-06T12:15:00.000Z"
}
```

## DELETE /api/espacios/:id
### Respuesta de ejemplo
```json
{
  "message": "Espacio eliminado correctamente"
}
```

---

# 4. Carreras

## GET /api/carreras
### Query params
- `?search=SISTEMAS` - Buscar en nombre o sigla

### Ejemplos de uso
```
GET /api/carreras
GET /api/carreras?search=SISTEMAS
GET /api/carreras?search=SIS
```

### Respuesta de ejemplo
```json
[
  {
    "id_carrera": 1,
    "nombre": "INGENIERIA DE SISTEMAS",
    "sigla": "SIS"
  }
]
```

## GET /api/carreras/:id
### Respuesta de ejemplo
```json
{
  "id_carrera": 1,
  "nombre": "INGENIERIA DE SISTEMAS",
  "sigla": "SIS"
}
```

## POST /api/carreras
### Body de ejemplo
```json
{
  "nombre": "INGENIERIA DE SISTEMAS",
  "sigla": "SIS"
}
```

### Respuesta de ejemplo
```json
{
  "id_carrera": 1,
  "nombre": "INGENIERIA DE SISTEMAS",
  "sigla": "SIS"
}
```

## PUT /api/carreras/:id
### Body de ejemplo
```json
{
  "nombre": "INGENIERIA DE SISTEMAS",
  "sigla": "SIS"
}
```

### Respuesta de ejemplo
```json
{
  "id_carrera": 1,
  "nombre": "INGENIERIA DE SISTEMAS",
  "sigla": "SIS"
}
```

## DELETE /api/carreras/:id
### Respuesta de ejemplo
```json
{
  "message": "Carrera eliminada correctamente"
}
```

---

# 5. Materias

## GET /api/materias
### Query params
- `?id_carrera=1` - Filtrar por carrera
- `?search=PROG` - Buscar en nombre o sigla

### Ejemplos de uso
```
GET /api/materias
GET /api/materias?id_carrera=1
GET /api/materias?search=PROG
GET /api/materias?id_carrera=1&search=PROG
```

### Respuesta de ejemplo
```json
[
  {
    "id_materia": 1,
    "id_carrera": 1,
    "carrera": "INGENIERIA DE SISTEMAS",
    "sigla_carrera": "SIS",
    "sigla": "SIS-101",
    "nombre": "PROGRAMACION I"
  }
]
```

## GET /api/materias/:id
### Respuesta de ejemplo
```json
{
  "id_materia": 1,
  "id_carrera": 1,
  "carrera": "INGENIERIA DE SISTEMAS",
  "sigla_carrera": "SIS",
  "sigla": "SIS-101",
  "nombre": "PROGRAMACION I"
}
```

## POST /api/materias
### Body de ejemplo
```json
{
  "id_carrera": 1,
  "sigla": "SIS-101",
  "nombre": "PROGRAMACION I"
}
```

### Respuesta de ejemplo
```json
{
  "id_materia": 1,
  "id_carrera": 1,
  "sigla": "SIS-101",
  "nombre": "PROGRAMACION I"
}
```

## PUT /api/materias/:id
### Body de ejemplo
```json
{
  "id_carrera": 1,
  "sigla": "SIS-101",
  "nombre": "PROGRAMACION I"
}
```

### Respuesta de ejemplo
```json
{
  "id_materia": 1,
  "id_carrera": 1,
  "sigla": "SIS-101",
  "nombre": "PROGRAMACION I"
}
```

## DELETE /api/materias/:id
### Respuesta de ejemplo
```json
{
  "message": "Materia eliminada correctamente"
}
```

---

# 6. Grupos de materia

## GET /api/grupos-materia
### Query params
- `?id_materia=1` - Filtrar por materia
- `?search=GRUPO` - Buscar en nombre o docente

### Ejemplos de uso
```
GET /api/grupos-materia
GET /api/grupos-materia?id_materia=1
GET /api/grupos-materia?search=GRUPO
GET /api/grupos-materia?id_materia=1&search=JUAN
```

### Respuesta de ejemplo
```json
[
  {
    "id_grupo_materia": 1,
    "id_materia": 1,
    "materia": "PROGRAMACION I",
    "sigla_materia": "SIS-101",
    "carrera": "INGENIERIA DE SISTEMAS",
    "grupo": "A",
    "docente": "JUAN PEREZ",
    "gestion": "2026",
    "periodo": "I",
    "cantidad_estudiantes": 35,
    "activo": "SI"
  }
]
```

## GET /api/grupos-materia/:id
### Respuesta de ejemplo
```json
{
  "id_grupo_materia": 1,
  "id_materia": 1,
  "materia": "PROGRAMACION I",
  "sigla_materia": "SIS-101",
  "carrera": "INGENIERIA DE SISTEMAS",
  "grupo": "A",
  "docente": "JUAN PEREZ",
  "gestion": "2026",
  "periodo": "I",
  "cantidad_estudiantes": 35,
  "activo": "SI"
}
```

## POST /api/grupos-materia
### Body de ejemplo
```json
{
  "id_materia": 1,
  "grupo": "A",
  "docente": "JUAN PEREZ",
  "gestion": "2026",
  "periodo": "I",
  "cantidad_estudiantes": 35,
  "activo": "SI"
}
```

### Respuesta de ejemplo
```json
{
  "id_grupo_materia": 1,
  "id_materia": 1,
  "grupo": "A",
  "docente": "JUAN PEREZ",
  "gestion": "2026",
  "periodo": "I",
  "cantidad_estudiantes": 35,
  "activo": "SI"
}
```

## PUT /api/grupos-materia/:id
### Body de ejemplo
```json
{
  "id_materia": 1,
  "grupo": "A",
  "docente": "JUAN PEREZ",
  "gestion": "2026",
  "periodo": "I",
  "cantidad_estudiantes": 40,
  "activo": "SI"
}
```

### Respuesta de ejemplo
```json
{
  "id_grupo_materia": 1,
  "id_materia": 1,
  "grupo": "A",
  "docente": "JUAN PEREZ",
  "gestion": "2026",
  "periodo": "I",
  "cantidad_estudiantes": 40,
  "activo": "SI"
}
```

## DELETE /api/grupos-materia/:id
### Respuesta de ejemplo
```json
{
  "message": "Grupo de materia eliminado correctamente"
}
```

---

# 7. Horarios de asignacion

## GET /api/horarios-asignacion
### Query params
- `?id_espacio=1` - Filtrar por espacio
- `?id_grupo_materia=2` - Filtrar por grupo de materia
- `?dia_semana=LUNES` - Filtrar por dia (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO)
- `?activo=SI` - Filtrar por estado

### Ejemplos de uso
```
GET /api/horarios-asignacion
GET /api/horarios-asignacion?id_espacio=1
GET /api/horarios-asignacion?dia_semana=LUNES
GET /api/horarios-asignacion?activo=SI
GET /api/horarios-asignacion?id_espacio=1&dia_semana=LUNES&activo=SI
```

### Respuesta de ejemplo
```json
[
  {
    "id_horario": 1,
    "id_espacio": 1,
    "codigo_espacio": "A-101",
    "espacio": "AULA 101",
    "id_grupo_materia": 1,
    "grupo": "A",
    "sigla_materia": "SIS-101",
    "materia": "PROGRAMACION I",
    "dia_semana": "LUNES",
    "hora_inicio": "08:00:00",
    "hora_fin": "10:00:00",
    "modalidad": "PRESENCIAL",
    "observaciones": "",
    "activo": "SI"
  }
]
```

## GET /api/horarios-asignacion/:id
### Respuesta de ejemplo
```json
{
  "id_horario": 1,
  "id_espacio": 1,
  "codigo_espacio": "A-101",
  "espacio": "AULA 101",
  "id_grupo_materia": 1,
  "grupo": "A",
  "sigla_materia": "SIS-101",
  "materia": "PROGRAMACION I",
  "dia_semana": "LUNES",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00",
  "modalidad": "PRESENCIAL",
  "observaciones": "",
  "activo": "SI"
}
```

## POST /api/horarios-asignacion
### Body de ejemplo
```json
{
  "id_espacio": 1,
  "id_grupo_materia": 1,
  "dia_semana": "LUNES",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00",
  "modalidad": "PRESENCIAL",
  "observaciones": "",
  "activo": "SI"
}
```

### Respuesta de ejemplo
```json
{
  "id_horario": 1,
  "id_espacio": 1,
  "id_grupo_materia": 1,
  "dia_semana": "LUNES",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00",
  "modalidad": "PRESENCIAL",
  "observaciones": "",
  "activo": "SI"
}
```

## PUT /api/horarios-asignacion/:id
Actualiza un horario y crea automaticamente un registro en `registro_asignacion`.

### Body de ejemplo
```json
{
  "id_espacio": 1,
  "id_grupo_materia": 1,
  "dia_semana": "LUNES",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00",
  "modalidad": "PRESENCIAL",
  "observaciones": "Cambio de horario",
  "activo": "SI",
  "id_usuario": 1
}
```

### Respuesta de ejemplo
```json
{
  "id_horario": 1,
  "id_espacio": 1,
  "id_grupo_materia": 1,
  "dia_semana": "LUNES",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00",
  "modalidad": "PRESENCIAL",
  "observaciones": "Cambio de horario",
  "activo": "SI"
}
```

## DELETE /api/horarios-asignacion/:id
### Respuesta de ejemplo
```json
{
  "message": "Horario eliminado correctamente"
}
```

---

# 8. Usuarios

## GET /api/usuarios
### Respuesta de ejemplo
```json
[
  {
    "id_usuario": 1,
    "id_grupo": null,
    "nombre_completo": "ADMIN SISTEMA",
    "correo": "admin@uagrm.edu.bo",
    "telefono": "",
    "rol": "ADMIN",
    "activo": "SI"
  }
]
```

## GET /api/usuarios/:id
### Respuesta de ejemplo
```json
{
  "id_usuario": 1,
  "id_grupo": null,
  "nombre_completo": "ADMIN SISTEMA",
  "correo": "admin@uagrm.edu.bo",
  "telefono": "",
  "rol": "ADMIN",
  "activo": "SI"
}
```

## POST /api/usuarios
### Body de ejemplo
```json
{
  "id_grupo": null,
  "nombre_completo": "ADMIN SISTEMA",
  "correo": "admin@uagrm.edu.bo",
  "telefono": "70000000",
  "rol": "ADMIN",
  "activo": "SI"
}
```

### Respuesta de ejemplo
```json
{
  "id_usuario": 1,
  "id_grupo": null,
  "nombre_completo": "ADMIN SISTEMA",
  "correo": "admin@uagrm.edu.bo",
  "telefono": "70000000",
  "rol": "ADMIN",
  "activo": "SI"
}
```

## PUT /api/usuarios/:id
### Body de ejemplo
```json
{
  "id_grupo": null,
  "nombre_completo": "ADMIN SISTEMA",
  "correo": "admin@uagrm.edu.bo",
  "telefono": "70000000",
  "rol": "ADMIN",
  "activo": "SI"
}
```

### Respuesta de ejemplo
```json
{
  "id_usuario": 1,
  "id_grupo": null,
  "nombre_completo": "ADMIN SISTEMA",
  "correo": "admin@uagrm.edu.bo",
  "telefono": "70000000",
  "rol": "ADMIN",
  "activo": "SI"
}
```

## DELETE /api/usuarios/:id
### Respuesta de ejemplo
```json
{
  "message": "Usuario eliminado correctamente"
}
```

---

# 9. Registros de espacio

## GET /api/registros-espacio
### Query params
- `?id_espacio=1` - Filtrar por espacio
- `?id_usuario=2` - Filtrar por usuario
- `?search=UPDATE` - Buscar en detalle o accion

### Ejemplos de uso
```
GET /api/registros-espacio
GET /api/registros-espacio?id_espacio=1
GET /api/registros-espacio?id_usuario=1
GET /api/registros-espacio?search=UPDATE
GET /api/registros-espacio?id_espacio=1&id_usuario=1
GET /api/registros-espacio?id_espacio=1&search=capacidad
```

### Respuesta de ejemplo
```json
[
  {
    "id_registro": 1,
    "id_espacio": 1,
    "codigo_espacio": "A-101",
    "espacio": "AULA 101",
    "id_usuario": 1,
    "usuario": "ADMIN SISTEMA",
    "fecha": "2026-05-06T12:15:00.000Z",
    "accion": "UPDATE",
    "detalle": "ACTUALIZACION ESPACIO A-101. Antes: estado=ACTIVO, capacidad=40, lat=NULL, lon=NULL. Despues: estado=ACTIVO, capacidad=45, lat=-17.783, lon=-63.182."
  }
]
```

## GET /api/registros-espacio/:id
### Respuesta de ejemplo
```json
{
  "id_registro": 1,
  "id_espacio": 1,
  "codigo_espacio": "A-101",
  "espacio": "AULA 101",
  "id_usuario": 1,
  "usuario": "ADMIN SISTEMA",
  "fecha": "2026-05-06T12:15:00.000Z",
  "accion": "UPDATE",
  "detalle": "ACTUALIZACION ESPACIO A-101. Antes: estado=ACTIVO, capacidad=40, lat=NULL, lon=NULL. Despues: estado=ACTIVO, capacidad=45, lat=-17.783, lon=-63.182."
}
```

---

# 10. Registros de asignacion

## GET /api/registros-asignacion
### Query params
- `?id_horario=1` - Filtrar por horario
- `?id_usuario=2` - Filtrar por usuario
- `?search=UPDATE` - Buscar en detalle o accion

### Ejemplos de uso
```
GET /api/registros-asignacion
GET /api/registros-asignacion?id_horario=1
GET /api/registros-asignacion?id_usuario=1
GET /api/registros-asignacion?search=UPDATE
GET /api/registros-asignacion?id_horario=1&id_usuario=1
GET /api/registros-asignacion?id_horario=1&search=horario
```

### Respuesta de ejemplo
```json
[
  {
    "id_registro": 1,
    "id_horario": 1,
    "dia_semana": "LUNES",
    "hora_inicio": "08:00:00",
    "hora_fin": "10:00:00",
    "id_usuario": 1,
    "usuario": "ADMIN SISTEMA",
    "fecha": "2026-05-06T12:20:00.000Z",
    "accion": "UPDATE",
    "detalle": "ACTUALIZACION HORARIO 1. Antes: LUNES 08:00:00-10:00:00. Despues: LUNES 08:00:00-10:00:00."
  }
]
```

## GET /api/registros-asignacion/:id
### Respuesta de ejemplo
```json
{
  "id_registro": 1,
  "id_horario": 1,
  "dia_semana": "LUNES",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00",
  "id_usuario": 1,
  "usuario": "ADMIN SISTEMA",
  "fecha": "2026-05-06T12:20:00.000Z",
  "accion": "UPDATE",
  "detalle": "ACTUALIZACION HORARIO 1. Antes: LUNES 08:00:00-10:00:00. Despues: LUNES 08:00:00-10:00:00."
}
```

## Ruta raiz

## GET /
### Respuesta de ejemplo
```json
{
  "message": "🏫 API UAGRM Espacios funcionando correctamente"
}
```

## Códigos de estado habituales

- `200` OK
- `201` Created
- `400` Bad Request
- `404` Not Found
- `500` Internal Server Error

## Recomendaciones para el frontend

- Usa `PUT` para editar registros existentes.
- En `espacios` y `horarios-asignacion`, envia `id_usuario` cuando hagas una actualizacion para que se genere la auditoria.
- Para ubicaciones, envia `id_padre` solo si realmente deseas cambiar el padre.
- Para auditorias, no insertes manualmente desde formulario; solo consume los endpoints de consulta.

## Ejemplo rapido de flujo

1. Crear una carrera con `POST /api/carreras`.
2. Crear una materia con `POST /api/materias` usando `id_carrera`.
3. Crear un grupo de materia con `POST /api/grupos-materia` usando `id_materia`.
4. Crear un horario con `POST /api/horarios-asignacion` usando `id_espacio` e `id_grupo_materia`.
5. Editar un espacio o un horario con `PUT` y `id_usuario` para generar auditoria.
