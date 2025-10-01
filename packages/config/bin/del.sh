#!/bin/bash

set -e

build() {
    pnpm tsdown

    if [ -d "bin" ]; then
        cp -r bin/* dist/
    fi
}

case $1 in
    build) build ;;
    *) echo "Usage: $0 {build}" ;;
esac
