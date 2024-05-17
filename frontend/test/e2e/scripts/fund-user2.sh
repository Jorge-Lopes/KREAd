#!/bin/sh

user1_address=$(docker exec e2e-agd-1 bash -c 'agd keys show user1 --keyring-backend=test --address')
user2_address=$(docker exec e2e-agd-1 bash -c 'agd keys show user2 --keyring-backend=test --address')
user1_balance=$(docker exec e2e-agd-1 bash -c 'agd query bank balances $(agd keys show user1 --keyring-backend=test --address) --denom uist')
user2_balance=$(docker exec e2e-agd-1 bash -c 'agd query bank balances $(agd keys show user2 --keyring-backend=test --address) --denom uist')
user1_ist=$(echo $user1_balance | sed -n 's/.*amount: "\([0-9]*\)".*/\1/p')
user2_ist=$(echo $user2_balance | sed -n 's/.*amount: "\([0-9]*\)".*/\1/p')

echo "User1 address: $user1_address"
echo "User1 balance: $user1_balance"
echo "User2 address: $user2_address"
echo "User2 balance: $user1_balance"

if [ "$user1_ist" -lt "1000000000" ]; then
    echo "User1 balance too low: $user1_ist"
    exit 1
fi

if [ "$user2_ist" -lt "10000000" ]; then
    echo "Funding user2 balance"
    docker exec e2e-agd-1 bash -c 'agd tx bank send user1 $(agd keys show user2 --keyring-backend=test --address) 15000000uist --keyring-backend=test --chain-id=agoriclocal --gas=auto --gas-adjustment=1.2 --yes -b block'
fi

exit
