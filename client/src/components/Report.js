import React from 'react';
import styled from 'styled-components';

const ReportContainer = styled.a`
  color: #19b58c;
  &:hover {
    text-decoration: underline;
  }
`;

export default function Report(props) {
  return (
    <ReportContainer href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </ReportContainer>
  );
}
