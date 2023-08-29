import React, { ReactNode } from 'react';

import { PopSection } from 'layouts/Section';

interface StackModalSectionProps {
  children: ReactNode[] | ReactNode;
  titles: string[];
  isWarning?: boolean;
  isError?: boolean;
}

export const StackModalSection = (props: StackModalSectionProps) => {
  const { children, titles, isWarning, isError } = props;
  return (
    <>
      {Array.isArray(children) ? (
        children.map((child: ReactNode, index: number) => (
          <PopSection
            key={index}
            name={titles[index]}
            isWarning={isWarning}
            isError={isError}
          >
            {child}
          </PopSection>
        ))
      ) : (
        <PopSection name={titles[0]} isWarning={isWarning} isError={isError}>
          {children}
        </PopSection>
      )}
    </>
  );
};

