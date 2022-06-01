import { useState, useEffect } from "react";

export default function useFclUser(provider) {
  const [user, setUser] = useState({});

  useEffect(
    () =>
      provider.currentUser().subscribe(async (user) => {
        if (!user.addr) {
          return setUser({ balance: 0 });
        }

        const account = await provider
          .send([provider.getAccount(user.addr)])
          .then(provider.decode);

        const balance = account.balance / Math.pow(10, 8);

        return setUser({ ...user, balance });
      }),
    [provider]
  );

  return user;
}
