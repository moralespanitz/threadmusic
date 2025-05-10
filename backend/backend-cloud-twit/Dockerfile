# Use a multi-stage build to reduce the final image size
FROM --platform=linux/amd64 maven:3.9.6-eclipse-temurin-17-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file to the working directory
COPY pom.xml .

# Download dependencies only.  This speeds up rebuilds if only application code changes.
RUN mvn -B dependency:go-offline

# Copy the source code to the working directory
COPY src ./src

# Package the application.  Skip tests to speed up the build.  You can remove this if you want tests to run.
RUN mvn -B clean package -DskipTests

# Use a minimal JRE image for the final runtime image
FROM --platform=linux/amd64 eclipse-temurin:17-jre-alpine

# Set the working directory for the runtime image
WORKDIR /app

# Copy the packaged application JAR file from the builder stage
COPY --from=builder /app/target/backend-cloud-twit-0.0.1-SNAPSHOT.jar /app/backend-cloud-twit.jar

# Expose the port that the application listens on
EXPOSE 8002

# Specify the command to run when the container starts
ENTRYPOINT ["java", "-jar", "backend-cloud-twit.jar"]
