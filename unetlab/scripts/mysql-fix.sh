#!/bin/bash
echo -ne "Checking MySQL Timezone "
grep -q default_time_zone /etc/mysql/mysql.conf.d/mysqld.cnf  &> /dev/null
if [ $? -ne 0 ]; then
	echo "default_time_zone='+00:00'" >> /etc/mysql/mysql.conf.d/mysqld.cnf
	systemctl restart mysql &> /dev/null
fi
echo -e "\033[0;32mdone\033[0m"
echo -ne "Checking MySQL Write Policy "
grep -q innodb_flush_log_at_trx_commit /etc/mysql/mysql.conf.d/mysqld.cnf  &> /dev/null
if [ $? -ne 0 ]; then
        echo "innodb_flush_log_at_trx_commit = 2 " >> /etc/mysql/mysql.conf.d/mysqld.cnf
        systemctl restart mysql &> /dev/null
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL connection pool "
grep -q max_connections /etc/mysql/mysql.conf.d/mysqld.cnf  &> /dev/null
if [ $? -ne 0 ]; then
        echo "max_connections=250" >> /etc/mysql/mysql.conf.d/mysqld.cnf
        systemctl restart mysql &> /dev/null
fi
echo -e "\033[0;32mdone\033[0m"
echo "ALTER USER 'root'@'localhost' IDENTIFIED BY 'eve-ng';" | mysql &> /dev/null
echo "CREATE USER IF NOT EXISTS 'eve-ng'@'localhost' IDENTIFIED BY 'eve-ng';" | mysql --host=localhost --user=root --password=eve-ng &> /dev/null
if [ $? -ne 0 ]; then
        echo -e "\033[0;31mfailed\033[0m"
        exit 1
fi
echo "GRANT ALL ON eve_ng_db.* TO 'eve-ng'@'localhost';" | mysql --host=localhost --user=root --password=eve-ng &> /dev/null
if [ $? -ne 0 ]; then
        echo -e "\033[0;31mfailed\033[0m"
        exit 1
fi

#Add system user for logrotate
PASS=$(grep -m 1 password  /etc/mysql/debian.cnf | sed -e 's/.* //')
echo "CREATE USER 'debian-sys-maint'@'localhost' IDENTIFIED BY '$PASS';" | mysql -u root --password=eve-ng mysql &> /dev/null
echo "GRANT ALL PRIVILEGES ON *.* TO 'debian-sys-maint'@'localhost' WITH GRANT OPTION;" | mysql -u root --password=eve-ng mysql &> /dev/null
echo "FLUSH PRIVILEGES;" | mysql -u root --password=eve-ng mysql &> /dev/null


echo -ne "Checking MySQL Pro Table... "
echo "select * from console ;" | mysql -u root --password=eve-ng eve_ng_db &> /dev/null 
if [ $? -ne 0 ]; then
        echo -ne "Creating lab and console table... "
        cat /opt/unetlab/schema/console.sql | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL Pro Table 2... "
echo "select spy from pods  ;" | mysql -u root --password=eve-ng eve_ng_db &> /dev/null
if [ $? -ne 0 ]; then
        echo -ne "Updating Pod table... "
	echo " alter table pods add spy integer ;"  | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null 
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL Edu Table... "
echo "select datestart from users;" | mysql -u root --password=eve-ng eve_ng_db &> /dev/null
if [ $? -ne 0 ]; then
	echo -e "Alter users table... "
	echo "alter table users add column datestart INT default -1 ;" | mysql -u root --password=eve-ng eve_ng_db &> /dev/null
	if [ $? -ne 0 ]; then
		echo -e "\033[0;31mfailed\033[0m"
		exit 1
	fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL console Table update 2... "
echo "select LabName from console ;" | mysql -u root --password=eve-ng eve_ng_db &> /dev/null 
if [ $? -ne 0 ]; then
	echo -ne "Update console table... "
	echo " alter table console add  name varchar(64) ;"  | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	echo " alter table console add  template varchar(64) ;"  | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	echo " alter table console add  LabName varchar(512) ;"  | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	echo " alter table console add  username varchar(64) ;"  | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	if [ $? -ne 0 ]; then
		echo -e "\033[0;31mfailed\033[0m"
		exit 1
	fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL console Table update 3... "
echo "show create table console ;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep LabName | grep -q 512  &> /dev/null
if [ $? -ne 0 ]; then
	echo -ne "Update console table LabName field length... "
	echo "alter table console MODIFY COLUMN LabName varchar(512) ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	if [ $? -ne 0 ]; then
		echo -e "\033[0;31mfailed\033[0m"
		exit 1
	fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL auth table... "
echo "show create table users;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep -q extauth  &> /dev/null
if [ $? -ne 0 ]; then
	echo "Updating..."
	echo "alter table users add extauth varchar(64) ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	echo "update users set extauth = 'internal';" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	if [ $? -ne 0 ]; then
		echo -e "\033[0;31mfailed\033[0m"
		exit 1
	fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL users table for quotas... "
echo "show create table users;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep -q ram  &> /dev/null
if [ $? -ne 0 ]; then
        echo "Updating..."
	echo "alter table users add column ram int default -1 ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	echo "alter table users add column cpu int default -1 ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	echo "alter table console add column ram int default 0 ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	echo "alter table console add column cpu float default 0 ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL users table for sticly... "
echo "show create table users;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep -q sticky &> /dev/null
if [ $? -ne 0 ]; then
        echo "Updating..."
	echo "alter table users add column sticky tinyint(1)  default 0 ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL cluster table... " 
echo "show create table cluster ;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep name  &> /dev/null
if [ $? -ne 0 ]; then
	cat /opt/unetlab/schema/cluster.sql | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL shared table... "
echo "show create table shared ;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep owner  &> /dev/null
if [ $? -ne 0 ]; then
        cat /opt/unetlab/schema/shared.sql | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
fi
echo -e "\033[0;32mdone\033[0m"


echo -ne "Checking MySQL extended cluster table... "
echo "show create table cluster ;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep cpu  &> /dev/null
if [ $? -ne 0 ]; then
	echo "Updating..."
	echo "alter table cluster add column cpu int default NULL ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	echo "alter table cluster add column ram bigint default NULL ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	echo "alter table cluster add column live_cpu int default NULL ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	echo "alter table cluster add column live_ram bigint default NULL ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	echo "alter table cluster add column live_swap bigint default NULL ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL extended II cluster table... "
echo "show create table cluster ;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep disk  &> /dev/null
if [ $? -ne 0 ]; then
        echo "Updating..."
        echo "alter table cluster add column swap bigint default NULL ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        echo "alter table cluster add column disk bigint default NULL ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        echo "alter table cluster add column disk_usage bigint default NULL ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL Default local sat..."
echo "select name from cluster where id = 0 ;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep "^master$"  &> /dev/null
if [ $? -ne 0 ]; then
	echo -ne "Add local.."
	echo "insert into cluster ( id , name ) values ( 0, 'master');"  | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	if [ $? -ne 0 ]; then
		echo -e "\033[0;31mfailed\033[0m"
		exit 1
	fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL console,user table for sat... "
echo "show create table console ;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep sat | grep -q 512  &> /dev/null
if [ $? -ne 0 ]; then
	 echo -ne "Update console table sat field..."
	 echo "alter table console add column sat int default 0 ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
	if [ $? -ne 0 ]; then
		echo -e "\033[0;31mfailed\033[0m"
		exit 1
	fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL users table for sat... "
echo "show create table users ;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep sat  &> /dev/null
if [ $? -ne 0 ]; then
         echo -ne "Update users table sat field..."
         echo "alter table users add column sat  int default -1 ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking MySQL console Table update live stats... "
echo "show create table console ;" | mysql -u root --password=eve-ng eve_ng_db 2>/dev/null | grep live_ram | grep -q 512  &> /dev/null
if [ $? -ne 0 ]; then
        echo -ne "Update console table  live fields ... "
        echo "alter table console ADD COLUMN live_cpu int default 0 ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
        echo "alter table console ADD COLUMN live_ram bigint default 0 ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
	echo "alter table console ADD COLUMN status varchar(64)  default 'unknown' ;" | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Checking disk_usage table... "
echo "select * from disk_usage ;" | mysql -u root --password=eve-ng eve_ng_db &> /dev/null
if [ $? -ne 0 ]; then
        echo -ne "Creating disk_updage table... "
        cat /opt/unetlab/schema/disk_usage.sql | mysql --host=localhost --user=root --password=eve-ng eve_ng_db &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e "\033[0;31mfailed\033[0m"
                exit 1
        fi
fi
echo -e "\033[0;32mdone\033[0m"

echo -ne "Set MySQL Timezone to UTC... "
echo "SET GLOBAL time_zone = '+00:00' ;" | mysql -u root --password=eve-ng mysql 2>/dev/null &> /dev/null
echo -ne "Recreate Guacdb Database"
echo -e "\033[0;32mdone\033[0m"
echo "\q" | mysql -u root --password=eve-ng guacdb &> /dev/null
if [ $? -ne 0 ]; then
	echo -ne "Creating database and users... "
	echo "CREATE DATABASE IF NOT EXISTS guacdb;" | mysql --host=localhost --user=root --password=eve-ng &> /dev/null
	if [ $? -ne 0 ]; then
		echo -e "\033[0;31mfailed\033[0m"
		exit 1
	fi
	echo "CREATE USER IF NOT EXISTS 'guacuser'@'localhost' IDENTIFIED BY 'eve-ng';" | mysql --host=localhost --user=root --password=eve-ng &> /dev/null
	if [ $? -ne 0 ]; then
		echo -e " create user \033[0;31mfailed\033[0m"
		exit 1
	fi
        echo "GRANT ALL ON guacdb.* TO 'guacuser'@'localhost';" | mysql --host=localhost --user=root --password=eve-ng &> /dev/null
        if [ $? -ne 0 ]; then
                echo -e " grant \033[0;31mfailed\033[0m"
                exit 1
        fi
	cat /opt/unetlab/schema/guacamole-1.0-*.sql | mysql --host=localhost --user=root --password=eve-ng guacdb &> /dev/null
	if [ $? -ne 0 ]; then
		echo -e " shema \033[0;31mfailed\033[0m"
		exit 1
	fi
	echo "SET @salt = UNHEX(SHA2(UUID(), 256)); UPDATE guacamole_user SET password_salt = @salt, password_hash = UNHEX(SHA2(CONCAT('eve-ng', HEX(@salt)), 256)) WHERE user_id =  1 ;" | mysql --user=root --password=eve-ng guacdb &> /dev/null
	if [ $? -ne 0 ]; then
		echo -e "set password \033[0;31mfailed\033[0m"
		exit 1
	fi

	echo -e "\033[0;32mdone\033[0m"
fi

