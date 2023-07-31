import React, { ReactNode } from 'react';

import { PopSection } from 'layouts/Section';

interface TitlesProps {
  name: string;
  decoration?: React.ReactNode | React.ReactNode[];
  open?: boolean;
}
interface StackSectionProps {
  children: ReactNode[] | ReactNode;
  titles: TitlesProps[];
  isWarning?: boolean;
  isError?: boolean;
}

export const StackSection = (props: StackSectionProps) => {
  const { children, titles, isWarning, isError } = props;
  return (
    <>
      {Array.isArray(children) ? (
        children.map((child: ReactNode, index: number) => (
          <PopSection
            key={index}
            name={titles[index].name}
            decoration={titles[index].decoration}
            open={titles[index].open}
            isWarning={isWarning}
            isError={isError}
          >
            {child}
          </PopSection>
        ))
      ) : (
        <PopSection
          name={titles[0].name}
          decoration={titles[0].open}
          isWarning={isWarning}
          isError={isError}
        >
          {children}
        </PopSection>
      )}
    </>
  );
};

