export const convertFromDataToDisplay = (date: Date | null | undefined) => {
  if (date === null) return undefined;
  if (date === undefined) return undefined;
  const converted = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // .split('/')
  // .join('-');
  return converted;
};

// export const convertFromDisplayToDate = (display: string | undefined) => {
//   if (display === undefined) return undefined;
//   const converted = date
//     .toLocaleDateString('ja-JP', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//     })
//     .split('/')
//     .join('-');
//   return converted;
// };

export const isInvalidDate = (date: Date) => Number.isNaN(date.getTime());

export const transformWareki = (date: Date): string => {
  if (isInvalidDate(date)) return '';
  const formatted = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'long',
  }).format(date);
  const splitted = formatted.split('/');
  const transformed = `${splitted[0]}年${splitted[1]}月${splitted[2]}日`;
  return transformed;
};

export const transformYyyymmdd = (date: Date): string => {
  if (isInvalidDate(date)) return '';
  const yyyymmdd = [
    String(date.getFullYear()),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ];
  const transformed = yyyymmdd.join('-');
  return transformed;
};
