rem .\install.bat

@REM set variables =========================================================
set REPOSITORY=10.100.30.100:5000
set IMAGE=cms_be
set TAG=20230220_1120

set PORTAINER_HOST=10.100.30.100
set PORTAINER_PORT=9000
set PORTAINER_USER=admin
set PORTAINER_PASSWORD=9WTNNLs*aVBp68GiEPaUx8_v*xfwpx*c
set PORTAINER_STACK=cms-admin
@REM set variables =========================================================

@REM backup, modify .env ===================================================
CD ./config
COPY /y default.json default.json.bak
CD ..
node ./auto-deployment/modify-feather-config --mongodb=mongodb://cms_user:zwbPPYQ2@10.100.30.103:27017/kbsv_cms_db --minio.endPoint=10.100.13.95
@REM backup, modify .env ===================================================

@REM build image in local ==================================================
docker rmi %REPOSITORY%/%IMAGE%:%TAG%
docker build -t %REPOSITORY%/%IMAGE%:%TAG% .
docker push %REPOSITORY%/%IMAGE%:%TAG%
@REM build image in local ==================================================

@REM deploy portainer ======================================================
node ./auto-deployment/modify-portainer.js --portainer_host=%PORTAINER_HOST% --portainer_port=%PORTAINER_PORT% --portainer_user=%PORTAINER_USER% --portainer_passwd=%PORTAINER_PASSWORD% --stack=%PORTAINER_STACK% --image=%REPOSITORY%/%IMAGE%:%TAG%
@REM deploy portainer ======================================================

@REM restore .env ==========================================================
CD ./config
COPY /y default.json.bak default.json
DEL default.json.bak
CD ..
@REM restore .env ==========================================================
