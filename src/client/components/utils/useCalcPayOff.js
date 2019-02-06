import { useEffect, useState } from 'react';
import Finance from 'financejs';

export const useCalcPayOff = (months, balance, interest_rate) => {
  const [minimum, setMinimum] = useState();
  const [totalPaid, setTotalPaid] = useState();
  const finance = new Finance();

  useEffect(() => {
    const newMinimum = finance.AM(balance, interest_rate, months, 1);
    const newTotalPaid = months * newMinimum;
    setMinimum(newMinimum);
    setTotalPaid(newTotalPaid);
  }, [months, balance, interest_rate]);

  return {
    minimum,
    totalPaid,
  };
};
