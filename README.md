# VIC Gov Exposure Site Test

**[Live Example](http://diego-navy.bnr.la/)**

## Server
1. Retrieves link to latest exposure site .csv from Data Vic via Data Vic API
2. Retrieves latest exposure site csv from supplied link
3. Geocodes listed addresses via Google Maps Geocode API
4. Saves geocoded list to sites.json

## Client
Loads + displays sites stored in sites.json via Google Maps API