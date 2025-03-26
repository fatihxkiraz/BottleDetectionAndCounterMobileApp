#!/bin/bash

# Run backend and frontend concurrently
(trap 'kill 0' SIGINT; 
 (cd backend && python main.py) & 
 (npx expo start --tunnel) & 
 wait)
