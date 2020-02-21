#!/bin/bash

# Normalize cwd
cd $(dirname "$0")
cd ../

# Version key/value should be on his own line
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

DIST_FOLDER="dist"
ZIP_NAME="snaptest-package@$(echo $PACKAGE_VERSION)"
TMP_FOLDER=$ZIP_NAME

npm run build -- prod

echo "Zipping Assets..."
if [ -d "$TMP_FOLDER" ]; then
  rm -rf $TMP_FOLDER
fi

if [ -e "$ZIP_NAME" ]; then
  rm $ZIP_NAME
fi

mkdir -p $TMP_FOLDER/dist
cp -r $DIST_FOLDER/ $TMP_FOLDER/dist

zip -r $ZIP_NAME.zip ./$TMP_FOLDER

DIST_SHA256=$(shasum -a 256 $TMP_FOLDER/dist/* | shasum -a 256)

echo $DIST_SHA256
rm -rf $TMP_FOLDER

echo "Packaging complete. Checksum (SHA-256 of zip's inner /dist directory): $(echo $DIST_SHA256)"