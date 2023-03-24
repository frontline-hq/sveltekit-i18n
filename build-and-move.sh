#!/bin/bash
yarn build
rm -r ./node_modules/@frontline-hq/sveltekit-i18n
cp -r ./package ./node_modules/@frontline-hq/sveltekit-i18n