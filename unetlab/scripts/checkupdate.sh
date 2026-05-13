#!/bin/bash
eval $( grep HTTP /etc/systemd/system/docker.service.d/http-proxy.conf 2>/dev/null  )
eval $Environment
export http_proxy=$HTTP_PROXY
URL=$(apt-cache policy  | grep http://www.eve-ng.net/  | awk '{print $2}')/dists/jammy/main/binary-amd64/Packages
online_version=$(wget  --connect-timeout=2 -t 1 -o /dev/null -O - ${URL} | sed -n -e '/Package: eve-ng-pro$/,+1p' | grep Version| sed -e 's/.* //')
local_version=$(dpkg -s eve-ng-pro | grep Version | head -1 | sed -e 's/.* //')
echo ${online_version} > /opt/unetlab/html/themes/adminLTE/online_version
echo ${local_version} > /opt/unetlab/html/themes/adminLTE/local_version
