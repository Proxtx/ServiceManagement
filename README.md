# ServiceManagement

Manage you services like node apps, python scripts or anything else with this project

# setup

1. copy config.json.example to config.json
2. edit config.json with your own password and port
3. optional: edit the style configuration in config.json to match your style (this is usefull to seperate different service managements on different servers)
4. copy services.json.example to services.json and edit it (see `services.json attributes`)
5. Go to 'static' and `git clone  https://github.com/ajaxorg/ace-builds`
5. run npm i
6. run node .
7. open the port you specified


# services.json attributes

to create a service edit services.json. On the root json layer create an attribute with the name of the service. The value must be a json object containing the attributes path and run. There are more attributes you can add to your service: 

- path: the working directory of the service (for example: /home/Dev/Node/redditDownloaderGUI/)
- run: the command to run the service (for example: node .)
- autoStart: bool start the service when service management is started
- restart: bool restart the service on exit (/crash)
- git: bool run git pull every ten minutes?
- config: does the service have a different config file than config.json (for example services.json)
- open: url can this service be opened in a webbrowser? provide this field to add a open button at the button area
- comnbine: url if your project is build on framework (/combine) you can use this to list combine functions at the buttons area and configure them

# New in 2.0 Complete Rework

- Builds on framework
- Display all Logs
- Combine Api
- Display Combine values
- Edit combine functions with gui
- PC and mobile
- PWA
- git
- hot services.json reloading
- auto start
- auto restart
