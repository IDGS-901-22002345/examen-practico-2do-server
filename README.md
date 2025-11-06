# Comandos del proyecto

# ------------------------------------------------------------

# Iniciar el servidor en modo desarrollo

# ------------------------------------------------------------

# Este comando ejecuta el proyecto localmente usando Bun.

bun dev

# ------------------------------------------------------------

# Ejecutar el seed de base de datos

# ------------------------------------------------------------

# Carga los datos iniciales en la base de datos.

# Úsalo después de configurar o reiniciar la base de datos.

bun db-seed

# ------------------------------------------------------------

# Manejo de migraciones con Prisma

# ------------------------------------------------------------

# 1️ Crear una nueva migración

# ------------------------------------------------------------

# Genera una nueva migración basada en los cambios del archivo schema.prisma.

# Reemplaza (nombre_sin_espacio) con un nombre descriptivo, por ejemplo: add_user_table

bunx prisma migrate dev --name (nombre_sin_espacio)

# 2️ Aplicar migraciones pendientes

# ------------------------------------------------------------

# Verifica si hay migraciones que aún no se han aplicado

# y las ejecuta en la base de datos actual.

bunx prisma migrate deploy

# 3️ Generar los nuevos tipos de Prisma

# ------------------------------------------------------------

# Después de crear o aplicar migraciones, ejecuta este comando

# para regenerar los tipos TypeScript actualizados del esquema.

bunx prisma generate
