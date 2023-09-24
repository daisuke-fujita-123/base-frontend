import { ObjectSchema, ValidationError } from 'yup';

import { GridColDef } from '@mui/x-data-grid-pro';
import { InvalidModel } from './Datagrid';

export const convertFromSizeToWidth = (size: string | undefined): number => {
  if (size === undefined) return 80;
  if (size === 'ss') return 80;
  if (size === 's') return 100;
  if (size === 'm') return 150;
  if (size === 'l') return 300;
  return 80;
};

export const resolveGridWidth = (
  columns: GridColDef[],
  checkboxSelection?: boolean
): number => {
  const checkboxWidth = checkboxSelection ? 50 : 0;
  return (
    columns.reduce((acc, val) => acc + (val.width ? val.width : 0), 0) +
    checkboxWidth
  );
};

export const convertFromResolverToInvalids = (
  resolver: ObjectSchema<any>
): InvalidModel[] => {
  const defaultInvalids: InvalidModel[] = [];
  Object.keys(resolver.fields).forEach((x) => {
    const field = resolver.fields[x] as any;
    if (field.type === 'string') {
      const invalid = field.tests.map((y: any) => {
        return {
          field: x,
          type: y.OPTIONS.name,
          message: y.OPTIONS.message,
          ids: [],
        };
      });
      defaultInvalids.push(...invalid);
    }
    if (field.type === 'array') {
      const invalid = field.innerType.tests.map((y: any) => {
        return {
          field: x,
          type: y.OPTIONS.name,
          message: y.OPTIONS.message,
          ids: [],
        };
      });
      defaultInvalids.push(...invalid);
    }
  });
  // 相関バリデーションを追加
  resolver.tests.forEach((x) => {
    if (
      x.OPTIONS === undefined ||
      x.OPTIONS.name === undefined ||
      x.OPTIONS.message === undefined ||
      typeof x.OPTIONS.message !== 'string'
    )
      return;
    const invalid: InvalidModel = {
      field: x.OPTIONS.name,
      type: x.OPTIONS.name,
      message: x.OPTIONS.message,
      ids: [],
    };
    defaultInvalids.push(invalid);
  });
  return defaultInvalids;
};

export const removeIdFromInvalids = (invalids: InvalidModel[], id: string) => {
  invalids.forEach((x) => {
    x.ids = x.ids.filter((y) => y !== id);
  });
};

export const appendErrorToInvalids = (
  invalids: InvalidModel[],
  err: ValidationError[],
  id: string | number
) => {
  err.forEach((e) => {
    const invalid = invalids.find((x) => {
      if (e.path === undefined) return false;
      if (e.path === '') {
        // 相関チェックエラーはe.pathが空文字になる
        return x.type === e.type;
      } else {
        // 配列に対するバリデーションエラーは、インデックス付のパスになるため前方一致で判断
        return e.path.startsWith(x.field) && x.type === e.type;
      }
    });
    if (invalid === undefined) return;
    if (!invalid.ids.includes(id)) invalid.ids.push(id);
    invalid.message = e.message;
  });
};

export const convertFromInvalidToMessage = (
  invalids: InvalidModel[]
): string[] => {
  return invalids.filter((x) => x.ids.length !== 0).map((x) => x.message);
};
