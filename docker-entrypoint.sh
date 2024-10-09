#!/bin/bash
dockerize -wait tcp://database:1502 -timeout 20s
pnpm start