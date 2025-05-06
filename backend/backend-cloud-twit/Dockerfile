# Usar una imagen base de Java con OpenJDK 17 (puedes cambiar la versión si es necesario)
FROM openjdk:17-jdk-slim as builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo pom.xml y descargar dependencias
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar el resto de los archivos del proyecto
COPY src ./src

# Construir el proyecto usando Maven
RUN mvn clean package -DskipTests

# Usar una imagen más ligera para el runtime (sin herramientas de desarrollo)
FROM openjdk:17-jdk-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo .jar generado desde la imagen builder
COPY --from=builder /app/target/backend-cloud-twit-0.0.1-SNAPSHOT.jar /app/backend-cloud-twit.jar

# Exponer el puerto que usará Spring Boot (por defecto es 8080)
EXPOSE 8002

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "backend-cloud-twit.jar"]
