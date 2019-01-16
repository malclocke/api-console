#!/bin/bash

NODE_OPTIONS=--max_old_space_size=2048 api-console build -t "RAML 1.0" -a drive-raml-api-v2-master/api.raml --verbose
cp -R build/. .
rm -rf build/
