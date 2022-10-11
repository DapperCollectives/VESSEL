import { useEffect, useState } from 'react';

export default function useFclUserBalance(provider) {
  const [userBalance, setUserBalance] = useState({});

  useEffect(
    () =>
      provider.currentUser().subscribe(async (user) => {
        if (!user.addr) {
          return setUserBalance(0);
        }

        const account = await provider
          .send([provider.getAccount(user.addr)])
          .then(provider.decode);

        const balance = account.balance / Math.pow(10, 8);

        return setUserBalance(balance);
      }),
    [provider]
  );

  return userBalance;
}
