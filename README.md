# Vision

Gitlab Monitoring UI
See Pipeline, Tag and last commit automatically

Vision is developed in Angular 8 with Nebular UI 4

Dev command
```bash
docker build -t vision-dev ./Dockerfile.dev
docker run -p 4200:4200 -v $PWD/src:/opt/app/src/ -v $PWD/package.json:/opt/app/package.json -v $PWD/angular.json:/opt/app/angular.json --name vision-dev -d vision-dev
```

Prod command
```
docker run -p 80:80 porthol/vision
```
On gitlab, go to profile, settings, access tokens, and generate one with all 'api', 'read_repository', 'read_registry'. 

On the UI give a the private token, on config popup. Write the name of the groups you want to follow.
You can exclude some repo on the config input.


Available on Docker HUB : https://hub.docker.com/r/porthol/vision

![Example of vision app](https://raw.githubusercontent.com/porthol/vision/develop/README_example.png?raw=true "Example of vision app")
