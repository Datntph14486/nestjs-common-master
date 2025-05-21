rem .\install.bat

set REPOSITORY=10.100.30.100:5000
set IMAGE=kbsv-contract-api
set TAG=20230315_1147

@REM backup, modify .env ===================================================
COPY /y .env .env.bak
node ./auto-deployment/modify-env.js --data-source.host=10.100.30.103 --log.app-name=kbsv-contract-api-uat
@REM backup, modify .env ===================================================

@REM build nestjs ==========================================================
cmd /C npm run build
@REM build nestjs ==========================================================

docker rmi %REPOSITORY%/%IMAGE%:%TAG%
docker build -t %REPOSITORY%/%IMAGE%:%TAG% .
docker push %REPOSITORY%/%IMAGE%:%TAG%

node ./auto-deployment/modify-portainer.js --portainer_host=10.100.30.100 --portainer_port=9000 --portainer_user=admin --portainer_passwd=9WTNNLs*aVBp68GiEPaUx8_v*xfwpx*c --stack=kbsv-contract --image=%REPOSITORY%/%IMAGE%:%TAG%

@REM restore .env ==========================================================
COPY /y .env.bak .env 
DEL .env.bak
@REM restore .env ==========================================================