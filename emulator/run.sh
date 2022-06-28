#!/bin/sh
echo "Starting emulator ...\n\n"
/bin/emulator start --service-priv-key 59092d0231bce1e19f6c2f1fb99d7a27deee3b4ab34fa47db5bfdecd9860f308  &
sleep 2
echo "\n\nSeeding emulator ...\n\n"
/bin/deploy
echo "\n\nDone! ...\n\n"
sleep 100000d