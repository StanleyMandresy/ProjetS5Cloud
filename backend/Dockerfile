# Étape 1 : Build avec Maven
FROM maven:3.9.3-eclipse-temurin-17 AS build

WORKDIR /app

# Copier pom.xml et code source
COPY pom.xml .
COPY src ./src

# Compiler le projet et générer le JAR
RUN mvn clean package -DskipTests

# Étape 2 : Image runtime
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copier le JAR généré depuis l'étape précédente
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
