# Use Maven image to build the project
FROM maven:3.8.5-openjdk-17 AS build

#Set the working directory
WORKDIR /app

#Copy the pom.xml file
COPY dashboard/pom.xml .
RUN mvn dependency:go-offline

#Copy the source code
COPY dashboard/src ./src

#Build the project
RUN mvn clean package -DskipTests

#Use the Spring Boot image to run the application
FROM eclipse-temurin:17-jre

#Set the working directory
WORKDIR /app

#Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

#Expose the port
EXPOSE 8081

#Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]