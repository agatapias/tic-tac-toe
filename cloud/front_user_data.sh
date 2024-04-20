#!/bin/sh 

git clone https://github.com/agatapias/tic-tac-toe.git

cd tic-tac-toe/frontend/src

curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

npm install

npm start