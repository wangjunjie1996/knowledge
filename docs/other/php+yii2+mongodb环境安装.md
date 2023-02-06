# php+yii2+mongodb环境安装(ubuntu系统)
## php 7.1 安装
php 已经是 7.1 的无需安装
```shell
sudo apt update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php7.1-fpm php7.1-mcrypt php7.1-cli php7.1-xml php7.1-gd php7.1-imagick php7.1-recode php7.1-tidy php7.1-xmlrpc php7.1-mbstring php7.1-curl
```
确认安装成功 php -v

其他:  
```
常用扩展　
php7.2-fpm php7.2-mysql php7.2-curl php7.2-json php7.2-mbstring php7.2-xml  php7.2-intl  
其他扩展（按需安装）  
sudo apt-get install php7.2-gd
sudo apt-get install php7.2-soap
sudo apt-get install php7.2-gmp
sudo apt-get install php7.2-odbc
sudo apt-get install php7.2-pspell
sudo apt-get install php7.2-bcmath
sudo apt-get install php7.2-enchan
sudo apt-get install php7.2-imap
sudo apt-get install php7.2-ldap
sudo apt-get install php7.2-opcache
sudo apt-get install php7.2-readline 
sudo apt-get install php7.2-sqlite3
sudo apt-get install php7.2-xmlrpc
sudo apt-get install php7.2-bz2
sudo apt-get install php7.2-interbase
sudo apt-get install php7.2-pgsql
sudo apt-get install php7.2-recode
sudo apt-get install php7.2-sybase
sudo apt-get install php7.2-xsl
sudo apt-get install php7.2-cgi
sudo apt-get install php7.2-dba
sudo apt-get install php7.2-phpdbg
sudo apt-get install php7.2-snmp
sudo apt-get install php7.2-tidy
sudo apt-get install php7.2-zip
```
切换到 ```/etc/php/7.2/fpm/pool.d```  目录下  打开 ```www.conf```
看到这行  ```listen = /run/php/php7.2-fpm.sock``` 将其改成  ```listen =  127.0.0.1:8090```
让他监听本机8090端口

启动 ```php service php7.1-fpm start```

## nginx 安装
1. ```sudo apt-get install nginx```
2. 安装好之后，使用```nginx -v```查看版本号，接着使用```nginx -h```查看帮助。
3. 使用nginx命令直接运行，使用```nginx -s stop```快速停止。
Sudo nginx    ,     ```sudo nginx -s stop```
启动Nginx： 提示以下内容 still could not bind 解决

<img src="/img/ngixerr.png">

根据Nginx配置文件查看配置的端口（本文中使用的是80端口），然后根据端口查看端口占用情况  netstat -ntlp|grep 80
启动成功在浏览器输入 localhost:端口号
## Yii2
下载composer.phar，拷贝到bin下全局使用，直接使用 composer 命令．无需使用 php composer.phar 命令
1. curl -sS https://getcomposer.org/installer | php
2. mv composer.phar /usr/local/bin/composer
对于已经安装过Composer的，可以对其进行更新　composer self-update
3. sudo vim /etc/php/7.1/cli/php.ini
4. zlib.output_compression = ON
5. 为Composer 安装 composer asset 插件 ```composer global require "fxp/composer-asset-plugin:~1.4.1"```
6. 现在选择的应用程序模板之一，开始安装 Yii 2.0。  
安装基本的应用程序模板，运行下面的命令：  
```composer create-project yiisoft/yii2-app-basic basic 2.0.9```  
或者直接安装到指定目录：  
```composer create-project --prefer-dist yiisoft/yii2-app-basic /usr/local/WWW/```  
### 配置nginx使其支持php  
cd /etc/nginx/sites-available/ 找到自己nginx的配置文件修改server配置项
index index.php index.html index.htm; 添加支持php访问  
然后将.php文件的请求将被传送到后端的PHP-FPM模块
location ~* \.php$ { 
 fastcgi_pass  127.0.0.1:8090;
        fastcgi_param SCRIPT_FILENAME
                      $document_root$fastcgi_script_name;
        include       fastcgi_params;
}  
重启nginx  
sudo service nginx restart;  
浏览器 localhost:80 后显示如下，就是 yii2 部署 nginx 成功  
<img src="/img/nginxweb.png">


## Mongo 安装
1.Mongo安装可参考官网，两种安装方式，apt和下载包安装，先尝试apt吧，如果网络不行再下载https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/  

按照官方文档运行以下命令
```shell
1.wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
2.sudo apt-get install gnupg
3.wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
4.
Ubuntu 16.04 (Xenial) 运行：
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
  Ubuntu 18.04 (Bionic) 运行：
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
5.sudo apt-get update
6.sudo apt-get install -y mongodb-org=4.4.2 mongodb-org-server=4.4.2 mongodb-org-shell=4.4.2 mongodb-org-mongos=4.4.2 mongodb-org-tools=4.4.2
7.ps --no-headers -o comm 1
8.上条命令输出systemd 的运行 sudo systemctl start mongod
上条命令输出 init 的运行 sudo service mongod start
```
## php-mongo 扩展安装
php-mongodb的扩展安装文档

https://www.php.net/manual/zh/mongo.installation.php#mongo.installation.nix


