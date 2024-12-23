# Etapa 1: Build
FROM postgres:15-alpine AS builder

# Instalar dependencias necesarias para compilar pgvector
RUN apk add --no-cache build-base clang llvm-dev git postgresql-dev

# Clonar el repositorio de pgvector
RUN git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git /usr/src/pgvector

# Compilar pgvector
RUN cd /usr/src/pgvector && \
    make && \
    make install

# Etapa 2: Producción
FROM postgres:15-alpine

# Copiar los binarios compilados desde la etapa anterior
COPY --from=builder /usr/local/lib/postgresql /usr/local/lib/postgresql
COPY --from=builder /usr/local/share/postgresql/extension /usr/local/share/postgresql/extension

# Crear directorio para scripts de inicialización
RUN mkdir -p /docker-entrypoint-initdb.d

# Agregar script SQL para crear la extensión pgvector
COPY init-db.sh /docker-entrypoint-initdb.d/init-db.sh
RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh

# Configuración segura por defecto
ENV POSTGRESQL_SHARED_PRELOAD_LIBRARIES=pgvector

# Volumen para datos persistentes
VOLUME ["/var/lib/postgresql/data"]
