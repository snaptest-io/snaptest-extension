#!/bin/bash

cd $(dirname "$0")

TMP_FOLDER="dist"
cd ../$TMP_FOLDER

echo "Cleaning distributable directory at $(pwd)"
#rm -rf ./$TMP_FOLDER

