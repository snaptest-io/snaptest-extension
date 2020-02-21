#!/bin/bash
#####################################################
# FE build & watch. (for development)
#
# Usage:
#
# ./watch.sh <environment>
#    <environment>: (optional) run an environment script in ./envs.  Defaults to "staging"
#
#####################################################

cd $(dirname "$0")

export WEBPACK_WATCH=True

if [ -n "$1" ] && [ -f ./envs/$1.sh ]
then
    source ./envs/$1.sh
fi

./clean.sh

cd ../
npx webpack --config ./build/webpack.js
