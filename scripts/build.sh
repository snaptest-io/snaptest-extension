#!/bin/bash
#####################################################
#  FE dashboard build.
#
# Usage:
#
# ./build <environment>
#    <environment>: (optional) run an environment script in ./envs.  Defaults to "staging"
#
#####################################################

cd $(dirname "$0")

if [ -n "$1" ] && [ -f ./envs/$1.sh ]
then
    source ./envs/$1.sh
fi

./clean.sh

cd ../

npx webpack --config ./build/webpack.js
