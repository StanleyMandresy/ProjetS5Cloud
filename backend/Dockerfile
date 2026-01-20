# Étape 1 : build
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copier pom.xml et code source
COPY pom.xml .
COPY src ./src

# Compiler le projet et générer le JAR
RUN mvn clean package -DskipTests

# Étape 2 : runtime
FROM eclipse-temurin:17-jdk-alpine AS runtime
WORKDIR /app

# Copier le JAR généré depuis l'étape précédente
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]