#!/bin/bash
mkdir /eve-upg
mount -o loop $(ls -1rt /tmp/eve-pro-*iso | tail -1) /eve-upg
echo -e 'Package: *\nPin: origin *ubuntu*\nPin-Priority: -1\n' > /etc/apt/preferences
echo 'deb [trusted=yes] file:/eve-upg/packages ./' > /etc/apt/sources.list.d/local.list
apt update
apt dist-upgrade -y -o DPkg::Options::=--force-confdef
rm -f /etc/apt/preferences
rm -f /etc/apt/sources.list.d/local.list
umount /eve-upg
rm -fr /eve-upg
