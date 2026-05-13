#!/bin/bash

DEBS="rsync sshpass"

usage(){
	echo "Usage: $0 -s <SourceIPAddress> -p <rootPassword>"
	exit 1
}

while getopts :s:p: o; do
	case ${o} in
		s)
			SRC=${OPTARG}
			;;
		p)
			export SSHPASS=${OPTARG}
			;;
		*)
			echo "ERROR: invalid argument"
			usage
			;;
	esac
done

if [ -z "${SRC}" ]; then
	echo "ERROR: source IP address not set"
	usage
fi

if [ -z "${SRC}" ]; then
	echo "ERROR: root password not set"
	usage
fi

# Install requirements
for DEB in ${DEBS}; do
	dpkg -l ${DEB} &> /dev/null || apt-get -qy install ${DEB} &> /dev/null
	if [ $? -ne 0 ]; then
		echo "ERROR: cannot install ${DEB}"
		exit 1
	fi
done

# Check connectivity
echo | nc -w3 ${SRC} 22 &> /dev/null
if [ $? -ne 0 ]; then
	echo "ERROR: cannot reach ${SRC}"
	exit 1
fi

# Checking password
sshpass -e ssh -o StrictHostKeyChecking=no root@${SRC} ls / &> /dev/null
if [ $? -ne 0 ]; then
	echo "ERROR: cannot login to ${SRC}"
	exit 1
fi

# Installing requirements
sshpass -e ssh root@${SRC} apt-get -qy install rsync &> /dev/null
if [ $? -ne 0 ]; then
	echo "ERROR: cannot install rsync to ${SRC}"
	exit 1
fi


# Importing labs
echo "---------------------------------------------------------------------------"
echo " IMPORTING LABS"
echo "---------------------------------------------------------------------------"
sshpass -e rsync -av -e ssh root@${SRC}:/opt/unetlab/labs /opt/unetlab 
if [ $? -ne 0 ]; then
	echo "ERROR: failed to import labs"
	exit 1
fi

# Importing tmp
echo "---------------------------------------------------------------------------"
echo " IMPORTING ACTIVE LABS"
echo "---------------------------------------------------------------------------"
sshpass -e rsync -av -e ssh root@${SRC}:/opt/unetlab/tmp /opt/unetlab 
if [ $? -ne 0 ]; then
	echo "ERROR: failed to import active labs"
	exit 1
fi

# Importing addons
echo "---------------------------------------------------------------------------"
echo " IMPORTING ADDONS"
echo "---------------------------------------------------------------------------"
sshpass -e rsync -av -e ssh root@${SRC}:/opt/unetlab/addons /opt/unetlab 
if [ $? -ne 0 ]; then
	echo "ERROR: failed to import addons"
	exit 1
fi

# Force SRC database backup
echo "---------------------------------------------------------------------------"
echo " SRC DB BACKUP GENERATE"
echo "---------------------------------------------------------------------------" 
sshpass -e ssh -o StrictHostKeyChecking=no root@${SRC}  "/usr/bin/mysqldump --password=eve-ng --add-drop-database --skip-comments  --databases eve_ng_db guacdb > /tmp/remotedb.sql"
if [ $? -ne 0 ]; then
	echo "ERROR: failed to create remote db backup"
	exit 1
fi

# Importing database backup file
echo "---------------------------------------------------------------------------"
echo "  SRC DB BACKUP IMPORT"
echo "---------------------------------------------------------------------------" 
sshpass -e rsync -av -e ssh root@${SRC}:/tmp/remotedb.sql /opt/unetlab
if [ $? -ne 0 ]; then
	echo "ERROR: failed to import remote db backup file"
	exit 1
fi

# Restore database backup file
echo "---------------------------------------------------------------------------"
echo " SRC DB BACKUP RESTORE"
echo "---------------------------------------------------------------------------" 
cat /opt/unetlab/remotedb.sql | /usr/bin/mysql --password=eve-ng
if [ $? -ne 0 ]; then
	echo "ERROR: failed to restore database"
	exit 1
fi

# Hostname
echo "---------------------------------------------------------------------------"
echo " MIGRATION COMPLETED"
echo "---------------------------------------------------------------------------"


