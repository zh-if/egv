#!/bin/sh
if [ "$1" = "" ] ; then exit ; fi
ls -l  /proc/$(fuser  -n file $1 2>/dev/null | sed -e 's/ *//')/fd | grep tmp | sed -e 's/.* //'
