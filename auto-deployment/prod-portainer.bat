rem .\install.bat

set REPOSITORY=10.100.120.51:5000
set IMAGE=kmp-admin
set TAG=20230203_1342

@REM build nestjs ==========================================================
cmd /C npm run build
@REM build nestjs ==========================================================

docker rmi %REPOSITORY%/%IMAGE%:%TAG%
docker build -t %REPOSITORY%/%IMAGE%:%TAG% .
docker push %REPOSITORY%/%IMAGE%:%TAG%

node modify-portainer.js --portainer_host=10.100.120.51 --portainer_port=9000 --portainer_user=admin --portainer_passwd=ZDnGnfbiDcHsn_TxHnAoxmAkx@E4LqyX --stack=kbsv-messaging-platform --image=%REPOSITORY%/%IMAGE%:%TAG%
