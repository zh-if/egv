IMAGE=/tmp/EVE.iso
OLD_IMAGE=/tmp/ubuntu-18.04.4-server-amd64.iso
MBR_FILE=/tmp/ubuntu_isohybrid_mbr.img
dd if="$OLD_IMAGE" bs=1 count=446 of="$MBR_FILE"
BUILD=/tmp/eve-iso

xorriso -as mkisofs -r -V "Custom Ubuntu Install CD" \
            -cache-inodes -J -l \
            -isohybrid-mbr "$MBR_FILE" \
            -c isolinux/boot.cat \
            -b isolinux/isolinux.bin \
               -no-emul-boot -boot-load-size 4 -boot-info-table \
	       -eltorito-alt-boot \
            -e boot/grub/efi.img \
               -no-emul-boot -isohybrid-gpt-basdat \
            -o "$IMAGE" \
            "$BUILD"

rm "$MBR_FILE"
