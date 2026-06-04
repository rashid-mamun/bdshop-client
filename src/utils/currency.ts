export const formatBDT = (amount: number | null | undefined) =>
  `BDT ${Number(amount || 0).toLocaleString('en-BD')}`;
