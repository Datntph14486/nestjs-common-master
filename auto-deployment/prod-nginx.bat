SET host=10.100.120.58
SET user=root
SET identify_key=C:\Users\tutq\Desktop\rsa-key-20221121

SET src_folder=dist/ant-desgin-demo
SET root_folder=/app/docker_data/nginx
SET html_folder=cms

node ./auto-deployment/modify-ng-environment.js --apiUrl=/cms/manager
cmd /C ng build

ssh -i "%identify_key%" %user%@%host% mv %root_folder%/%html_folder% %root_folder%/%html_folder%.$(date +%%Y%%m%%d_%%H%%M%%S)

del upload_script.sh
echo cd %root_folder% >> upload_script.sh
echo ls >> upload_script.sh
echo mkdir %html_folder% >> upload_script.sh
echo put -r %src_folder% %html_folder% >> upload_script.sh

sftp -i "%identify_key%" -b upload_script.sh %user%@%host%
del upload_script.sh

ssh -i "%identify_key%" %user%@%host% docker restart nginx