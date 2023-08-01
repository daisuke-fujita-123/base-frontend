export const convertFromSizeToWidth = (size: string | undefined): number => {
  if (size === undefined) return 80;
  if (size === 'ss') return 80;
  if (size === 's') return 100;
  if (size === 'm') return 150;
  if (size === 'l') return 300;
  return 80;
};

export const disabledCell = (
  params: any,
  gridDisabled: boolean,
  getCellDisabled: any
): boolean => {
  if (gridDisabled) return true;
  if (getCellDisabled !== undefined) return getCellDisabled(params);
  return false;
};
