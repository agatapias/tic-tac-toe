#!/bin/sh 

git clone https://github.com/agatapias/tic-tac-toe.git

cd tic-tac-toe/backend

sudo apt-get install software-properties-common
sudo apt-add-repository universe
sudo apt-get update
sudo apt-get install maven

mvn spring-boot:run