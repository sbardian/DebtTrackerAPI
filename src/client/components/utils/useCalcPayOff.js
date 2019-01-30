import { useEffect, useState } from 'react';

export const useCalcPayOff = (balance, interest_rate) => {
  useEffect(() => {
    let currentMonths = 0;
    let currentTotalPaid = 0;
    let currentTotalInterest = 0;
    let newBalance = balance;
    let x = 0;
    const monthlyInterestRate = (interest_rate / 365) * 30;
    const interest = (monthlyInterestRate * newBalance) / 100;
    let monthlyPayment = payment || balance * 0.023;
    monthlyPayment = monthlyPayment < 25 ? 25 : monthlyPayment;
    const paid = monthlyPayment - interest;
    do {
      currentTotalInterest += interest;
      currentTotalPaid = currentTotalPaid + interest + paid;
      x += paid;
      newBalance -= paid;
      currentMonths += 1;
      if (paid * currentMonths > balance) {
        currentTotalPaid =
          currentTotalPaid -
          (currentTotalPaid - balance) +
          currentTotalInterest;
      }
    } while (x <= balance);
    if(!payment) {
      const currentSinglePaymentMax =
        balance + (balance * monthlyInterestRate) / 100 + 1;
      return {
        currentSinglePaymentMax,
        monthlyPayment,
        currentMonths,
        currentTotalPaid,
      }
    }
    return {
      currentMonths,
      currentTotalPaid,
      monthlyPayment,
    }
  }
};
