import React, { ReactNode } from 'react';

import { default as StackMui } from '@mui/material/Stack';
import { Section } from 'layouts/Section';

interface TitlesProps {
  name: string;
  decoration?: React.ReactNode | React.ReactNode[];
  open?: boolean;
}
interface StackSectionProps {
  children: ReactNode[] | ReactNode;
  titles: TitlesProps[];
}

export const StackSection = (props: StackSectionProps) => {
  const { children, titles } = props;
  return (
    <StackMui spacing={3}>
      {Array.isArray(children) ? (
        children.map((child: ReactNode, index: number) => (
          <Section
            key={index}
            name={titles[index].name}
            decoration={titles[index].decoration}
            open={titles[index].open}
          >
            {child}
          </Section>
        ))
      ) : (
        <Section name={titles[0].name} decoration={titles[0].open}>
          {children}
        </Section>
      )}
    </StackMui>
  );
};
