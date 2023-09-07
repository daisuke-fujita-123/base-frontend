import * as yup from 'yup';

import { Definition, fieldValidationDefinition } from './ValidationDefinition';

export const generate = (
  names: string[],
  requiredItemNames: string[] = []
): yup.ObjectSchema<Definition> => {
  const definition: Definition = {};

  names.forEach((value: string) => {
    if (!(value in fieldValidationDefinition)) {
      return;
    }
    let temp = fieldValidationDefinition[value];
    if (requiredItemNames.includes(value)) {
      temp = temp.required();
    } else {
      temp = temp.nullable();
    }
    // Numberのブランク許可
    if (temp instanceof yup.NumberSchema) {
      temp = temp
        .nullable()
        .transform((value, originalValue) =>
          String(originalValue).trim() === '' ? null : value
        );
    }
    definition[value] = temp;
  });

  return yup.object().shape(definition);
};

