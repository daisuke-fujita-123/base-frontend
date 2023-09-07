// formatUtilityクラス
export const Format = (mes: string, param: any[]): string => {
  let result = mes;
  for (let i = 0; i < param.length; i++) {
    const index = '{' + i + '}';
    result = result.replace(index, param[i]);
  }
  return result;
};

