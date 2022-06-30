#!/bin/zsh

# flow init --reset --service-private-key f8e188e8af0b8b414be59c4a1a15cc666c898fb34d94156e9b51e18bfde754a5

for i in {1..30}
do
    # Generate Private Key
    PRIVATEKEY=$(flow keys generate | grep '^Private Key \(.*\)' | tail -c 66 | grep '.*')
    PUBLICKEY=$(flow keys generate | grep '^Public Key \(.*\)' | tail -c 130 | grep '.*')
    echo "Private Key:\n$PRIVATEKEY"
    echo "Public  Key:\n$PUBLICKEY"
    # Create Account
    ADDR=$(echo $PUBLICKEY | xargs flow accounts create --key | grep Address | tail -c 19 | grep ".*")
    echo "Address: $ADDR\n"
    TIME=1
    # (echo "emulator-signer$i"; sleep $TIME; echo $ADDR; sleep $TIME; echo; sleep $TIME; echo; sleep $TIME; echo $PRIVATEKEY | xargs; sleep $TIME; echo 0; sleep $TIME) | flow config add account
    # echo "emulator-signer$i"; sleep $TIME; echo $ADDR; sleep $TIME; echo; sleep $TIME; echo; sleep $TIME; echo $PRIVATEKEY;

done