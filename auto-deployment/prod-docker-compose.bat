SET host=10.100.20.99
SET user=root
SET identify_key=C:\Users\tutq\Desktop\rsa-key-20221121

SET src_folder=.
SET root_folder=/root/docker/ms
SET image=kmp-admin
SET tag=20230201_0934

@REM fix Permissions for '...rsa-key-...' are too open =====================
COPY %identify_key% %USERPROFILE%\.SSH\tmp.pk
SET identify_key=%USERPROFILE%\.SSH\tmp.pk
@REM fix Permissions for '...rsa-key-...' are too open =====================

@REM modify .env ===========================================================
node ./auto-deployment/modify-env.js --data-source.host=10.100.20.99
@REM modify .env ===========================================================

@REM backup folder app =====================================================
SSH -i "%identify_key%" %user%@%host% mv %root_folder%/%image% %root_folder%/%image%.$(date +%%Y%%m%%d_%%H%%M%%S)
@REM backup folder app =====================================================

@REM tao file upload qua SFTP ==============================================
DEL upload_script.sh
DEL docker-compose.yml
(
    ECHO cd %root_folder%
    ECHO ls
    ECHO mkdir %image%
    ECHO put -r %src_folder%/src %image%/src
    ECHO put .dockerignore %image%
    ECHO put .env %image%
    ECHO put *.json %image%
    ECHO put Dockerfile %image%
    ECHO get docker-compose.yml
) >> upload_script.sh
@REM tao file upload qua SFTP ==============================================

@REM upload file can thiet =================================================
SFTP -i "%identify_key%" -b upload_script.sh %user%@%host%
DEL upload_script.sh
@REM upload file can thiet =================================================

@REM sua file docker-compose ===============================================
node %src_folder%/auto-deployment/modify-docker-compose.js --image=%image%:%tag%
(
    ECHO cd %root_folder%
    ECHO put docker-compose.yml .
) >> upload_script.sh
SFTP -i "%identify_key%" -b upload_script.sh %user%@%host%
DEL upload_script.sh
DEL docker-compose.yml
@REM sua file docker-compose ===============================================

@REM chay lenh bo sung tren server remote ==================================
SSH -i "%identify_key%" %user%@%host% docker rmi %image%:%tag%
SSH -i "%identify_key%" %user%@%host% docker build -t %image%:%tag% %root_folder%/%image%
SSH -i "%identify_key%" %user%@%host% docker compose -f %root_folder%/docker-compose.yml up -d
@REM SSH -i "%identify_key%" %user%@%host% docker logs -f --tail 100 %image%
@REM chay lenh bo sung tren server remote ==================================

@REM fix Permissions for '...rsa-key-...' are too open =====================
DEL %identify_key%
@REM fix Permissions for '...rsa-key-...' are too open =====================