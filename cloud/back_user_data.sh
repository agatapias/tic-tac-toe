#!/bin/sh 

git clone https://github.com/agatapias/tic-tac-toe.git

cd tic-tac-toe/backend

sudo apt-get install software-properties-common
sudo apt-add-repository universe
sudo apt-get update
sudo apt-get install maven


sudo apt install openjdk-17-jre-headless

sudo update-alternatives --config java

mvn clean install



java -jar target/tictac-0.0.1-SNAPSHOT.jar

mvn spring-boot:run