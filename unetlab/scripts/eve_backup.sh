#!/bin/bash
cleanup () {
	true
	#rm -f /tmp/customs-list-$DATE /tmp/customs-list-delete-$DATE /tmp/image-list-$DATE /tmp/image-list-delete-$DATE /tmp/lab-list-$DATE /tmp/lab-list-delete-$DATE /tmp/tmp-master-list-$DATE /tmp/tmp-master-list-delete-$DATE /tmp/tmp-sat$S-list-$DATE /tmp/tmp-sat$S-list-delete-$DATE /tmp/rclone.conf
}
trap "cleanup" EXIT
RCLONE="/opt/unetlab/scripts/rclone --config=/opt/unetlab/backup.cfg"
SRCLONE="/opt/unetlab/scripts/rclone --config=/tmp/rclone.cfg"
parse_opt() {
	while [[ -n "$1" ]]; do
		case "$1" in
			-lab) opts[lab]=1;;
			-database) opts[database]=1;;
			-image) opts[image]=1;;
			-tmp)  opts[tmp]=1;;
			-docker) opts[docker]=1;;
			-customs) opts[customs]=1;;
			-mirroring) opts[mirroring]=1;;
		esac
		shift
	done
}

rclone_checkserver() {
	REMOTE=$($RCLONE listremotes 2>/dev/null | head -1 )
	REMOTE_DIR=$($RCLONE config show | grep remote_dir | sed -e 's/.*= //')
	$RCLONE touch $REMOTE/$REMOTE_DIR/check
	if [ $? -ne 0 ]; then
		return 1
	fi
	$RCLONE deletefile $REMOTE/$REMOTE_DIR/check
	return 0
}

get_cluster_network() {
	A=($(grep wg0 /proc/net/route));  echo ${A[1]} | sed -e 's/\(..\)/\1 /g' | while read A B C D  ; do echo $((16#$D)).$((16#$C)).$((16#$B)) ; done
}

get_cluster_members() {
	M=$(/opt/unetlab/wrappers/unl_wrapper -a showcluster 2>/dev/null | grep Online | sed -e 's/ .*//'| grep -v ^0$ )
	echo $M
}

check_cluster_online() {
	/opt/unetlab/wrappers/unl_wrapper -a showcluster 2>/dev/null | grep Offline
	if [ $? -eq 0 ]; then
                return 1
	fi
	return 0
}

check_running() {
	mount | grep -q jail 
	if [ $? -eq 0 ]; then
		return 1
	fi
	CN=$(get_cluster_network)
	for S in $(get_cluster_members) ; do
		(ssh -o ConnectTimeout=1 $CN.$S mount 2>/dev/null || echo ssh-error) | grep -q 'jail\|ssh-error'
		if [ $? -eq 0 ]; then
			return 1
		fi
	done
	return 0
}

build_rclone_conf () {
	cat /opt/unetlab/backup.cfg > /tmp/rclone.cfg
	SATS=$(get_cluster_members)
	CN=$(get_cluster_network)
	for S in $SATS ; do
		cat >> /tmp/rclone.cfg << EOF
[SAT$S]
type = sftp
host = $CN.$S
user = root
key_file = /root/.ssh/id_rsa
use_insecure_cipher = true
md5sum_command = none
sha1sum_command = none
shell_type = unix
EOF
	done
}

backup_tmp() {
	# -not -path '*\/\**' -printf '%h/%f;D%TY%Tm%Td%Tk%TM.%Ts;%s\n' )
        # echo "$LIST" | awk -F \; '{print $1}' > /tmp/customs-list-$DATE
	echo -n "Populate empty dir"
	find /opt/unetlab/tmp/ -type d | xargs -I{} touch {}/.keepme
	echo [OK]
	echo -n "Create file list...."
	LIST=$(find /opt/unetlab/tmp/ -type d,f -printf '%h/%f;%TY%Tm%Td%TH%TM.%Ts;%s\n' | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" | sort | awk -F\; '{print $1";"substr($2,0,15)";"$3}')
	#SLIST=$(find /opt/unetlab/tmp/ -type l,s,c -printf '%h/%f\n')
	if $RCLONE cat $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-master/files.txt >/dev/null 2>&1 ; then
		RLIST=$($RCLONE cat $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-master/files.txt)
		GLIST=$(echo "$LIST" |  awk -F \; '{print "^"$1"$"}')
                echo files.txt present !!!
		diff  -d -p <( echo "$RLIST" | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index"  | sort ) <( echo "$LIST")  | grep '^! \|^\+ ' | sed -e 's/^[!+] //' -e 's/;.*//' | sort -u | grep --color=never -f <(echo "$GLIST") > /tmp/tmp-master-list-$DATE
		diff  -d -p <( echo "$RLIST" | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" | sort ) <( echo "$LIST")  | grep '^- \|^! ' | sed -e 's/^[-!] //' -e 's/;.*//' | sort -u -r | grep -v --color=never -f <(echo "$GLIST") > /tmp/tmp-master-list-delete-$DATE
                #cat /tmp/tmp-master-list-delete-$DATE  | xargs -I{} rm -d -v "$BCKPATH/tmp-master{}"
		cat /tmp/tmp-master-list-delete-$DATE  | xargs -I{}  $RCLONE delete $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-master{}
        else
                echo "$LIST" |  awk -F \; '{print $1}' > /tmp/tmp-master-list-$DATE
        fi
        echo [OK]
        echo "Create Tmp Master Archive...."
        #tar --no-recursion -T /tmp/tmp-master-list-$DATE  -czvf $BCKPATH/tmp-master.tar.gz
	#rsync $QUICK -v -d --files-from=/tmp/tmp-master-list-$DATE / $BCKPATH/tmp-master/
	$RCLONE copy --no-check-dest -v --create-empty-src-dirs  --files-from=/tmp/tmp-master-list-$DATE / $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-master/
        if [ $? -ne 0 ]; then
                echo [Failed]
		return
        fi
	#echo "$LIST"  > $BCKPATH/tmp-master/files.txt
	echo "$LIST" | $RCLONE rcat  $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-master/files.txt
        echo [OK]
	echo "Create Tmp Master Archive of special files"
	#find /opt/unetlab/tmp/ -type l,c | cpio -ov > $BCKPATH/tmp-master/specials.cpio
	find /opt/unetlab/tmp/ -type l,c | cpio -ov |  $RCLONE rcat  $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-master/specials.cpio
	echo [OK]
        #SATS
	CN=$(get_cluster_network)
        SATS=$(get_cluster_members)
        for S in $SATS ; do
		 echo -n "Populate empty dir"
                 ssh -o ConnectTimeout=6 $CN.$S "find /opt/unetlab/tmp/ -type d | xargs -I{} touch {}/.keepme"
                 echo [OK]
                 echo -n "Create file list Sat $S...."
		 LIST=$(ssh -o ConnectTimeout=6 $CN.$S "find /opt/unetlab/tmp/ -type d,f -printf '%h/%f;%TY%Tm%Td%TH%TM.%Ts;%s\n' | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index"  | sort | awk -F\; '{print \$1\";\"substr(\$2,0,15)\";\"\$3}'" )
		 #if [ -e $BCKPATH/tmp-sat$S/files.txt ] ; then
		 if $RCLONE cat $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-sat$S/files.txt >/dev/null 2>&1 ; then
			 RLIST=$($RCLONE cat $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-sat$S/files.txt)
			 GLIST=$(echo "$LIST" |  awk -F \; '{print "^"$1"$"}' | grep -v "jail/lib\|jail/opt\|jail/usr" )
			 diff  -d -p <( echo "$RLIST" | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index"  |sort ) <( echo "$LIST")  | grep '^! \|^\+ ' | sed -e 's/^[!+] //' -e 's/;.*//' | sort -u | grep --color=never -f <(echo "$GLIST") > /tmp/tmp-sat$S-list-$DATE
			 diff  -d -p <( echo "$RLIST" | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index"  |sort ) <( echo "$LIST")  |  grep '^- \|^! ' | sed -e 's/^[-!] //' -e 's/;.*//' | sort -u -r | grep -v --color=never -f <(echo "$GLIST") > /tmp/tmp-sat$S-list-delete-$DATE
			 #cat /tmp/tmp-sat$S-list-delete-$DATE  | xargs -I{} rm -d -v "$BCKPATH/tmp-sat$S{}"
			 cat /tmp/tmp-sat$S-list-delete-$DATE  | xargs -I{}  $RCLONE delete $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-sat$S{}
		 else
			 echo "$LIST" |  awk -F \; '{print $1}' > /tmp/tmp-sat$S-list-$DATE
		 fi
                 echo [OK]
                 echo "Create Tmp SAT $S Archive...."
                 #ssh -o ConnectTimeout=5 $CN.$S  tar --no-recursion -T /tmp/tmp-list-$DATE  -cvzf - > $BCKPATH/tmp-sat-$S.tar.gz
		 #rsync $QUICK -a -v -d --files-from=/tmp/tmp-sat$S-list-$DATE $CN.$S:/ $BCKPATH/tmp-sat$S/
		 $SRCLONE copy --no-check-dest -v  --create-empty-src-dirs  --files-from=/tmp/tmp-sat$S-list-$DATE SAT$S:/ $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-sat$S/
                 if [ $? -ne 0 ]; then
                         echo [Failed]
                         return
                 fi
		 #echo "$LIST" > $BCKPATH/tmp-sat$S/files.txt
		 echo "$LIST" | $RCLONE rcat  $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-sat$S/files.txt
                 echo [OK]
		 echo "Create Tmp SAT $S Archive of special files"
		 #ssh -o ConnectTimeout=6 $CN.$S "find /opt/unetlab/tmp/ -type l,c | grep -v \"jail/lib\|jail/opt\|jail/usr\" | cpio -ov" > $BCKPATH/tmp-sat$S/specials.cpio
		 ssh -o ConnectTimeout=6 $CN.$S "find /opt/unetlab/tmp/ -type l,c | grep -v \"jail/lib\|jail/opt\|jail/usr\" | cpio -ov" | $RCLONE rcat  $REMOTE/$REMOTE_DIR/$BCKPATH/tmp-sat$S/specials.cpio
		 echo [OK]
         done
 }

declare -A opts # assoc array
opts[lab]=0
opts[database]=0
opts[image]=0
opts[tmp]=0
opts[docker]=0
opts[customs]=0
opts[mirroring]=0

echo $0 $@
parse_opt "$@"


DATE=$(date +%Y%m%d-%H%M%S)
HOST=$(hostname) 
if [ ${opts[mirroring]} -eq 1  ]; then
	BCKPATH=eve-$HOST-mirror
	QUICK=""
else
	BCKPATH=eve-$HOST-$DATE
	QUICK=""
fi

for pid in $(pidof -x eve_backup.sh); do
    if [ $pid != $$ ]; then
        echo "[$(date)] : eve_backup.sh : Process is already running with PID $pid"
        exit 1
    fi
done 

rclone_checkserver
if [ $? -ne 0 ]; then
	echo Server not reponding...
	exit 1
fi

#echo $REMOTE
#echo $REMOTE_DIR

#exit 0

#diff  -d -p <( echo "$X")  <( echo "$Y")  | grep '!\+' | sed -e 's/! //' -e 's/;.*//' | sort -u 
#diff  -d -p <( echo "$X")  /tmp/Y  | grep '!\+' | sed -e 's/! //' -e 's/;.*//' | sort -u
if [ ${opts[lab]} -eq 1  ]; then
	$RCLONE mkdir $REMOTE/$REMOTE_DIR/$BCKPATH
	echo "Backup Lab:"
	echo "-----------"
	echo -n "Populate empty dir"
        find /opt/unetlab/labs/ -type d | xargs -I{} touch {}/.keepme
        echo [OK]
	echo -n "Create file list...."
	LIST=$(find /opt/unetlab/labs/ -name "*.unl" -printf '%h/%f;%TY%Tm%Td%TH%TM.%Ts;%s\n' | grep -v "opt/unetlab/labs/index" | grep -v "opt/unetlab/labs/.index" | sort | awk -F\; '{print $1";"substr($2,0,15)";"$3}')
        if $RCLONE cat $REMOTE/$REMOTE_DIR/$BCKPATH/labs/files.txt >/dev/null 2>&1 ; then
                echo files.txt present !!!
                RLIST=$($RCLONE cat $REMOTE/$REMOTE_DIR/$BCKPATH/labs/files.txt)
		GLIST=$(echo "$LIST" |  awk -F \; '{print "^"$1"$"}')
		diff  -d -p <( echo "$RLIST" | grep -v "opt/unetlab/labs/index" | grep -v "opt/unetlab/labs/.index" | sort ) <( echo "$LIST")  | grep '^! \|^\+ ' | sed -e 's/^[!+] //' -e 's/;.*//' | sort -u | grep --color=never -f <(echo "$GLIST") > /tmp/lab-list-$DATE
		diff  -d -p <( echo "$RLIST" | grep -v "opt/unetlab/labs/index" | grep -v "opt/unetlab/labs/.index" | sort ) <( echo "$LIST")  | grep '^- \|^! ' | sed -e 's/^[-!] //' -e 's/;.*//' | sort -u -r | grep -v --color=never -f <(echo "$GLIST") > /tmp/lab-list-delete-$DATE
		#cat /tmp/lab-list-delete-$DATE  | xargs -I{} rm -v "$BCKPATH/labs{}"
		cat /tmp/lab-list-delete-$DATE  | xargs -I{}  $RCLONE delete $REMOTE/$REMOTE_DIR/$BCKPATH/labs{}
	else
		echo "$LIST" |  awk -F \; '{print $1}' > /tmp/lab-list-$DATE
	fi
	echo [OK]
	echo "Create Lab Archive...."
	$RCLONE copy --no-check-dest -v --create-empty-src-dirs  --files-from=/tmp/lab-list-$DATE / $REMOTE/$REMOTE_DIR/$BCKPATH/labs/
        if [ $? -ne 0 ]; then
                echo [Failed]
                exit 1
        fi     
	echo "$LIST" | $RCLONE rcat  $REMOTE/$REMOTE_DIR/$BCKPATH/labs/files.txt
	echo [OK]
	rm /tmp/lab-list-$DATE
        echo "Create Lab Archive of special files"
        find /opt/unetlab/labs -type l | cpio -ov | $RCLONE rcat  $REMOTE/$REMOTE_DIR/$BCKPATH/labs/specials.cpio
        echo [OK]
fi
if [ ${opts[database]} -eq 1  ]; then
	$RCLONE mkdir $REMOTE/$REMOTE_DIR/$BCKPATH
        echo "Backup Database:"
	echo "----------------"
	echo -n "Create database Archive...."
	/usr/bin/mysqldump --password=eve-ng --add-drop-database --skip-comments  --databases eve_ng_db guacdb | gzip | $RCLONE rcat  $REMOTE/$REMOTE_DIR/$BCKPATH/database.gz
        if [ $? -ne 0 ]; then
                echo [Failed]
                exit 1
        fi      
	echo [OK]
fi
if [ ${opts[image]} -eq 1  ]; then
	$RCLONE mkdir $REMOTE/$REMOTE_DIR/$BCKPATH
        echo "Backup Images"
	echo "-------------"
	echo -n "Populate empty dir"
        find /opt/unetlab/addons/qemu/ /opt/unetlab/addons/iol/bin/ /opt/unetlab/addons/dynamips/ -type d | xargs -I{} touch {}/.keepme
        echo [OK]
	echo -n "Create file list...."
	LIST=$(find /opt/unetlab/addons/qemu/ /opt/unetlab/addons/iol/bin/ /opt/unetlab/addons/dynamips/ -type d,f  -printf '%h/%f;%TY%Tm%Td%TH%TM.%Ts;%s\n' | sort | awk -F\; '{print $1";"substr($2,0,15)";"$3}')
	if $RCLONE cat $REMOTE/$REMOTE_DIR/$BCKPATH/images/files.txt >/dev/null 2>&1 ; then	
		echo files.txt present !!!
		RLIST==$($RCLONE cat $REMOTE/$REMOTE_DIR/$BCKPATH/images/files.txt)
		GLIST=$(echo "$LIST" |  awk -F \; '{print "^"$1"$"}')
		diff  -d -p <( echo "$RLIST" | sort ) <( echo "$LIST")  | grep '^! \|^\+ ' | sed -e 's/^[!+] //' -e 's/;.*//' | sort -u | grep --color=never -f <(echo "$GLIST") > /tmp/image-list-$DATE
		diff  -d -p <( echo "$RLIST" | sort ) <( echo "$LIST")  | grep '^- \|^! '  | sed -e 's/^[-!] //' -e 's/;.*//' | sort -r -u | grep -v --color=never -f <(echo "$GLIST") > /tmp/image-list-delete-$DATE
		cat /tmp/image-list-delete-$DATE  | xargs -I{} $RCLONE delete $REMOTE/$REMOTE_DIR/$BCKPATH/images{}
	else
		echo "$LIST" |  awk -F \; '{print $1}' > /tmp/image-list-$DATE
	fi
        echo [OK]
	echo "Create Image Archive...."
	#tar -T /tmp/image-list-$DATE -czvf $BCKPATH/images.tar.gz
	$RCLONE copy --no-check-dest -v  --create-empty-src-dirs  --files-from=/tmp/image-list-$DATE / $REMOTE/$REMOTE_DIR/$BCKPATH/images/
	        if [ $? -ne 0 ]; then
                echo [Failed]
                exit 1
        fi
	echo "$LIST" | $RCLONE rcat  $REMOTE/$REMOTE_DIR/$BCKPATH/images/files.txt
	echo [OK]
	rm /tmp/image-list-$DATE
        echo "Create Images Archive of special files"
        find /opt/unetlab/addons/qemu/ /opt/unetlab/addons/iol/bin/ /opt/unetlab/addons/dynamips/ -type l | cpio -ov | $RCLONE rcat  $REMOTE/$REMOTE_DIR/$BCKPATH/images/specials.cpio
        echo [OK]
fi
if [ ${opts[tmp]} -eq 1  ]; then
	check_archive_dir $BCKPATH
	skip=0
        echo "Backup tmp:"
	echo "-----------"
	echo -n "Check Cluster Online..."
	if ! check_cluster_online ; then
		echo [Failed] 
		echo Offline sat detected
		skip=1
	else
		echo [OK]
	fi
	echo -n "Check Running Qemu..."
	if ! check_running ; then
		echo [Failed] 
		echo Running Qemu detected
		skip=1	
	else
		echo [OK]
	fi
	if [ $skip -ne 1 ] ; then
		build_rclone_conf
		backup_tmp 
	else 
		echo Skipping tmp backup
	fi
fi
if [ ${opts[customs]} -eq 1  ]; then
	$RCLONE mkdir $REMOTE/$REMOTE_DIR/$BCKPATH	
	echo "Backup templates/icons/config-scripts"
	echo "-------------------------------------"
	echo -n "Populate empty dir"
        find /opt/unetlab/config_scripts/ /opt/unetlab/html/templates /opt/unetlab/html/images/ -type d | xargs -I{} touch {}/.keepme
        echo [OK]
	LIST=$(find /opt/unetlab/config_scripts/ /opt/unetlab/html/templates /opt/unetlab/html/images/ -not -path "*.git*"  -not -path '*\/\**' -printf '%h/%f;%TY%Tm%Td%TH%TM.%Ts;%s\n' | sort | awk -F\; '{print $1";"substr($2,0,15)";"$3}')
	if $RCLONE cat $REMOTE/$REMOTE_DIR/$BCKPATH/customs/files.txt >/dev/null 2>&1 ; then
                echo files.txt present !!!
		RLIST=$($RCLONE cat $REMOTE/$REMOTE_DIR/$BCKPATH/customs/files.txt)
		GLIST=$(echo "$LIST" |  awk -F \; '{print "^"$1"$"}')
		diff  -d -p <( echo "$RLIST" | sort ) <( echo "$LIST")  | grep '^! \|^\+ ' | sed -e 's/^[!+] //' -e 's/;.*//' | sort -u | grep --color=never -f <(echo "$GLIST") > /tmp/customs-list-$DATE
		diff  -d -p <( echo "$RLIST" | sort ) <( echo "$LIST")  | grep '^- \|^! '  | sed -e 's/^[-!] //' -e 's/;.*//' | sort -r -u | grep -v --color=never -f <(echo "$GLIST") > /tmp/customs-list-delete-$DATE
                cat /tmp/customs-list-delete-$DATE  | xargs -I{} rm -v "$BCKPATH/customs{}"
		cat /tmp/customs-list-delete-$DATE  | xargs -I{} $RCLONE delete $REMOTE/$REMOTE_DIR/$BCKPATH/customs{}
        else
                echo "$LIST" | awk -F \; '{print $1}' > /tmp/customs-list-$DATE
        fi
        echo [OK]
	$RCLONE copy --no-check-dest -v --create-empty-src-dirs  --files-from=/tmp/customs-list-$DATE / $REMOTE/$REMOTE_DIR/$BCKPATH/customs/
        if [ $? -ne 0 ]; then
                echo [Failed]
                exit 1
        fi
	echo "$LIST" |  $RCLONE rcat  $REMOTE/$REMOTE_DIR/$BCKPATH/customs/files.txt
        echo [OK]
	echo "Create Customs Archive of special files"
        find /opt/unetlab/config_scripts/ /opt/unetlab/html/templates /opt/unetlab/html/images/ -not -path "*.git*"  -not -path '*\/\**'  -type l | cpio -ov  | $RCLONE rcat  $REMOTE/$REMOTE_DIR/$BCKPATH/customs/specials.cpio
        echo [OK]

fi
if [ ${opts[docker]} -eq 1  ]; then
        echo "Backup docker"
fi
echo "!!!!!!!!!! Backup complete !!!!!!!!!!"
sync

