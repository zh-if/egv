#!/bin/bash
rclone_umount() {
	cd /tmp
        mountpoint -q /tmp/eve-bkp-storage
        if [ $? -eq 0 ]; then
                echo "Please wait, Flushing and data copy is in progress"
                sleep 5
                while /opt/unetlab/scripts/rclone rc core/stats | grep -q  transferring ; do
                        sleep 1
                done
                echo "Done"
                /opt/unetlab/scripts/rclone rc core/stats
                umount /tmp/eve-bkp-storage
                rm -d /tmp/eve-bkp-storage
		echo "!!!!!!!!!! Restore complete !!!!!!!!!!"
        fi
}

trap "rclone_umount" EXIT
parse_opt() {
	while [[ -n "$1" ]]; do
		case "$1" in
			-lab)
				opts[lab]=1
				opts[fix]=1;;
			-image)
				opts[image]=1
				opts[fix]=1;;
			-customs)
				opts[customs]=1
				opts[fix]=1;;
			-database)
				opts[database]=1
				opts[fix]=1;;
			-mirroring)
				opts[mirroring]=1;;
			-tmp-*)
				member=$(echo -n $1 | sed -e 's/^-tmp-//')
				opts[tmps]=${opts[tmps]}" "$member
				opts[fix]=1;;
			-path)
				cd $2
				shift
		esac
		shift
	done
}
get_cluster_network() {
        A=($(grep wg0 /proc/net/route));  echo ${A[1]} | sed -e 's/\(..\)/\1 /g' | while read A B C D  ; do echo $((16#$D)).$((16#$C)).$((16#$B)) ; done
}
check_cluster_online() {
        /opt/unetlab/wrappers/unl_wrapper -a showcluster 2>/dev/null | grep Offline
        if [ $? -eq 0 ]; then
                return 1
        fi
        return 0
}
get_cluster_members() {
        M=$(/opt/unetlab/wrappers/unl_wrapper -a showcluster 2>/dev/null | grep Online | sed -e 's/ .*//'| grep -v ^0$ )
        echo $M
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

declare -A opts
opts[lab]=0
opts[database]=0
opts[image]=0
opts[customs]=0
opts[mirroring]=0
opts[tmps]=""
opts[fix]=0

echo $0 $@
parse_opt $@
DATE=$(date +%Y%m%d-%H%M%S)

if [ ${opts[lab]} -eq 1  ]; then
	echo "Restore Labs"
	echo "------------"
	echo -n "Create file list...."
	LIST=$(find /opt/unetlab/labs/ -name "*.unl" -printf '%h/%f;%TY%Tm%Td%TH%TM.%Ts;%s\n' | grep -v "opt/unetlab/labs/index" | grep -v "opt/unetlab/labs/.index" | sort | awk -F\; '{print $1";"substr($2,0,15)";"$3}')
	GLIST=$(cat labs/files.txt | sort | grep -v "opt/unetlab/labs/index" | grep -v "opt/unetlab/labs/.index" |  awk -F \; '{print "^"$1"$"}')
	diff  -d -p <( echo "$LIST") <( cat labs/files.txt | grep -v "opt/unetlab/labs/index" | grep -v "opt/unetlab/labs/.index" | sort) | grep '^! \|^\+ ' | sed -e 's/^[!+] //' -e 's/;.*//' | sort -u | grep --color=never -f <(echo "$GLIST") > /tmp/lab-list-$DATE
	diff  -d -p <( echo "$LIST") <( cat labs/files.txt | grep -v "opt/unetlab/labs/index" | grep -v "opt/unetlab/labs/.index" | sort) | grep '^- \|^! '  | sed -e 's/^[-!] //' -e 's/;.*//' | sort -r -u | grep -v --color=never -f <(echo "$GLIST") > /tmp/lab-list-delete-$DATE
	echo [OK]
	echo -n "Restore Lab Archive...."
	rsync $QUICK -v --files-from=/tmp/lab-list-$DATE --exclude="/opt/unetlab/labs/index*" --exclude="/opt/unetlab/labs/.index*" labs/ /
	if [ $? -ne 0 ]; then
		echo [Failed]
		exit 1
	fi
	cat labs/files.txt | while IFS=\; read f d s ; do touch -m "$f" -t $d  ; done
	echo [OK]
	rm /tmp/lab-list-$DATE
	if [ ${opts[mirroring]} -eq 1  ]; then
		echo "Syncing Labs ( deletion on server )"
		find /opt/unetlab/labs/ -type s | xargs -I{} rm -v "{}"
		cat /tmp/lab-list-delete-$DATE  | xargs -I{} rm -v "{}"
		echo [OK]
	fi
	# Special Files
	cat labs/specials.cpio | cpio -iumv 
fi	
if [ ${opts[database]} -eq 1  ]; then
	echo "Restore Database"
	echo "----------------"
	gzip -cd database.gz  | mysql  --password=eve-ng mysql
	SATS=$(echo "select id,pubkey from cluster where id > 0 ;" | mysql -s --password=eve-ng eve_ng_db) 
	echo "$SATS" | while read i k; do \
		if [ -e /etc/wireguard/sat$i.conf ] ; then
			pk=$(grep Pub /etc/wireguard/sat$i.conf | sed -e 's/.* = //')
			SQL="update cluster set pubkey='$pk' where id=$i;" 
			echo $SQL |  mysql  --password=eve-ng  eve_ng_db
		fi
	done

fi
if [ ${opts[image]} -eq 1  ]; then
	echo "Restore Images"
        echo "--------------"
	echo -n "Create file list...."
	LIST=$(find /opt/unetlab/addons/qemu/ /opt/unetlab/addons/iol/bin/ /opt/unetlab/addons/dynamips/ -type d,f  -printf '%h/%f;%TY%Tm%Td%TH%TM.%Ts;%s\n'| sort | awk -F\; '{print $1";"substr($2,0,15)";"$3}')
	GLIST=$(cat images/files.txt |  awk -F \; '{print "^"$1"$"}')
	diff  -d -p <( echo "$LIST") <( cat images/files.txt | sort) | grep '^! \|^\+ ' | sed -e 's/^[!+] //' -e 's/;.*//' | sort -u | grep --color=never -f <(echo "$GLIST") > /tmp/image-list-$DATE
	diff  -d -p <( echo "$LIST") <( cat images/files.txt | sort) | grep '^- \|^! '  | sed -e 's/^[-!] //' -e 's/;.*//' | sort -r -u | grep -v --color=never -f <(echo "$GLIST") > /tmp/image-list-delete-$DATE

	echo [OK]
	echo -n "Restore Image Archive...."
	rsync $QUICK -v -d --files-from=/tmp/image-list-$DATE images/ /
	if [ $? -ne 0 ]; then
		echo [Failed]
		exit 1
	fi
	cat images/files.txt | while IFS=\; read f d s ; do touch -m "$f" -t $d  ; done
	echo [OK]
	rm /tmp/image-list-$DATE
	if [ ${opts[mirroring]} -eq 1  ]; then
		echo "Syncing Images ( deletion on server )"
		find /opt/unetlab/addons/qemu/ /opt/unetlab/addons/iol/bin/ /opt/unetlab/addons/dynamips/ -type l | xargs -I{} rm -v "{}"
		cat /tmp/image-list-delete-$DATE  | xargs -I{} rm -v -d "{}"
		echo [OK]
	fi
	# Special Files
	cat images/specials.cpio | cpio -iumv 
fi

running_check=0
for tmp in ${opts[tmps]}
do
	echo  "Restore Tmp $tmp"
	echo  "------------------"
	if [ $running_check -ne 1 ]; then
		echo -n "Check Running Qemu..."
		if ! check_running ; then
			echo [Failed]
			echo Running Qemu detected
			break ;
		fi
		echo [OK]
	fi
	running_check=1
	if [ $tmp  == "master" ] ; then
		echo -n "Create Master file list...."
		LIST=$(find /opt/unetlab/tmp/ -type d,f -printf '%h/%f;%TY%Tm%Td%TH%TM.%Ts;%s\n' | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" | sort | awk -F\; '{print $1";"substr($2,0,15)";"$3}')
		GLIST=$(cat tmp-master/files.txt | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" |  awk -F \; '{print "^"$1"$"}')
		diff  -d -p <( echo "$LIST") <( cat tmp-master/files.txt | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" | sort) | grep '^! \|^\+ ' | sed -e 's/^[!+] //' -e 's/;.*//' | sort -u | grep --color=never -f <(echo "$GLIST") > /tmp/tmp-master-list-$DATE
		diff  -d -p <( echo "$LIST") <( cat tmp-master/files.txt | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" | sort) | grep '^- \|^! '  | sed -e 's/^[-!] //' -e 's/;.*//' | sort -r -u | grep -v --color=never -f <(echo "$GLIST") > /tmp/tmp-master-list-delete-$DATE
		echo [OK]
		echo -n "Restore Tmp Master Archive...."
		cd .
		rsync -v -d --files-from=/tmp/tmp-master-list-$DATE --exclude="/opt/unetlab/tmp/index*" --exclude="/opt/unetlab/tmp/.index*" tmp-master/ /
		if [ $? -ne 0 ]; then
			echo [Failed]
			exit 1
		fi
		cat tmp-master/files.txt | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" | while IFS=\; read f d s ; do touch -m "$f" -t $d  ; done
		if [ ${opts[mirroring]} -eq 1  ]; then
			echo "Syncing Master tmp ( deletion on server )"
			find /opt/unetlab/tmp/ -type l,c,s | xargs -I{} rm -v "{}"
			cat /tmp/tmp-master-list-delete-$DATE | xargs -I{} rm -v -d "{}"
			echo [OK]
		fi
		rm /tmp/tmp-master-list-delete-$DATE
		rm /tmp/tmp-master-list-$DATE
		#Special Files
		cat tmp-master/specials.cpio | cpio -iumv 
	else 
		        echo -n "Check Cluster Online..."
		        if ! check_cluster_online ; then
		                echo [Failed] 
		                echo Offline sat detected
		                continue
		        else
	        	        echo [OK]
		        fi
			S=$(echo $tmp | sed -e 's/^sat//' )
			CN=$(get_cluster_network)
			echo -n "Create $tmp file list...."
			LIST=$(ssh -o ConnectTimeout=6 $CN.$S "find /opt/unetlab/tmp/ -type d,f -printf '%h/%f;%TY%Tm%Td%TH%TM.%Ts;%s\n' | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" | sort | awk -F\; '{print \$1\";\"substr(\$2,0,15)\";\"\$3}'")
			GLIST=$(cat tmp-sat$S/files.txt | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" |  awk -F \; '{print "^"$1"$"}' | grep -v "jail/lib\|jail/opt\|jail/usr")
			diff  -d -p <( echo "$LIST") <( cat tmp-sat$S/files.txt | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" | sort )  | grep '^! \|^\+ ' | sed -e 's/^[!+] //' -e 's/;.*//' | sort -u | grep --color=never -f <(echo "$GLIST") > /tmp/tmp-sat$S-list-$DATE
			diff  -d -p <( echo "$LIST") <( cat tmp-sat$S/files.txt | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" | sort ) | grep '^- \|^! '  | sed -e 's/^[-!] //' -e 's/;.*//' | sort -r -u | grep -v --color=never -f <(echo "$GLIST") > /tmp/tmp-sat$S-list-delete-$DATE
			echo [OK]
			echo -n "Restore Tmp Sat $S Archive...."
			cd .
			#echo rsync -v -d --files-from=/tmp/tmp-sat$S-list-$DATE tmp-sat$S/ $CN.$S:/
			#echo TO sync
			#cat /tmp/tmp-sat$S-list-$DATE
			#echo To del
			#cat /tmp/tmp-sat$S-list-delete-$DATE
			rsync -v -d --files-from=/tmp/tmp-sat$S-list-$DATE --exclude="/opt/unetlab/tmp/index*" --exclude="/opt/unetlab/tmp/.index*" tmp-sat$S/ $CN.$S:/ 
			if [ $? -ne 0 ]; then
				echo [Failed]
				break;
			fi
			cat tmp-sat$S/files.txt| grep -v "jail/lib\|jail/opt\|jail/usr" | grep -v "opt/unetlab/tmp/index" | grep -v "opt/unetlab/tmp/.index" |  ssh -o ConnectTimeout=6 $CN.$S "while IFS=\; read f d s ; do touch -m \"\$f\" -t \$d  ; done"
			if [ ${opts[mirroring]} -eq 1  ]; then
				echo "Syncing sat$S tmp ( deletion on server )"
				ssh -o ConnectTimeout=6 $CN.$S "find /opt/unetlab/tmp/ -type l,c,s | xargs -I{} rm -v \"{}\""
				cat /tmp/tmp-sat$S-list-delete-$DATE | grep -v "jail/lib\|jail/opt\|jail/usr" | ssh -o ConnectTimeout=6 $CN.$S " xargs -I{} rm -d -v \"{}\""
			fi
			#Special Files
			cat tmp-sat$S/specials.cpio | ssh -o ConnectTimeout=6 $CN.$S "  cpio -iumv"
			# remove prepared for iol
			ssh -o ConnectTimeout=6 $CN.$S " find /opt/unetlab/tmp -name iourc | sed -e 's/iourc/\.prepared/' | xargs rm"	
	fi

done
if [ ${opts[customs]} -eq 1  ]; then
        echo "Restore templates/icons/config-scripts"
        echo "-------------------------------------"
	LIST=$(find /opt/unetlab/config_scripts/ /opt/unetlab/html/templates /opt/unetlab/html/images/ -not -path "*.git*"  -not -path '*\/\**' -printf '%h/%f;%TY%Tm%Td%TH%TM.%Ts;%s\n' | sort | awk -F\; '{print $1";"substr($2,0,15)";"$3}')
	GLIST=$(cat customs/files.txt |  awk -F \; '{print "^"$1"$"}')
	diff  -d -p <( echo "$LIST") <( cat customs/files.txt | sort ) | grep '^! \|^\+ ' | sed -e 's/^[!+] //' -e 's/;.*//' | sort -u | grep --color=never -f <(echo "$GLIST") > /tmp/customs-list-$DATE
	diff  -d -p <( echo "$LIST") <( cat customs/files.txt | sort ) | grep '^- \|^! '  | sed -e 's/^[-!] //' -e 's/;.*//' | sort -r -u | grep -v --color=never -f <(echo "$GLIST") > /tmp/customs-list-delete-$DATE
        echo [OK]
	cd .
        rsync $QUICK -v --files-from=/tmp/customs-list-$DATE customs/ /
        if [ $? -ne 0 ]; then
                echo [Failed]
                exit 1
        fi
	cat customs/files.txt | while IFS=\; read f d s ; do touch -m "$f" -t $d  ; done
        echo [OK]
	if [ ${opts[mirroring]} -eq 1  ]; then
		echo "Syncing templates/icons/config-scripts ( deletion on server )"
		find /opt/unetlab/config_scripts/ /opt/unetlab/html/templates /opt/unetlab/html/images/ -not -path "*.git*"  -not -path '*\/\**'  -type l | xargs -I{} rm -v "{}"
		cat /tmp/customs-list-delete-$DATE  | xargs -I{} rm -v "$BCKPATH/customs{}"
	fi
	#Special Files
        cat customs/specials.cpio | cpio -iumv 
fi
if [ ${opts[fix]} -eq 1  ]; then
	echo "Fixing Permissions"
	echo "------------------"
	/opt/unetlab/wrappers/unl_wrapper -a fixpermissions
fi
