#!/bin/bash
yarn build
rm -r ./node_modules/@frontline-hq/sveltekit-i18n
rm -r ./node_modules/.vite
cp -r ./package ./node_modules/@frontline-hq/sveltekit-i18n