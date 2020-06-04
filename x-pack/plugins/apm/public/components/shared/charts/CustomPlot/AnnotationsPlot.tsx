/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React from 'react';
import { VerticalGridLines } from 'react-vis';
import {
  EuiIcon,
  EuiToolTip,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { withTheme, EuiTheme } from '../../../../../observability/public';
import { Maybe } from '../../../../../typings/common';
import { Annotation } from '../../../../../common/annotations';
import { PlotValues, SharedPlot } from './plotUtils';
import { asAbsoluteDateTime } from '../../../../utils/formatters';

interface Props {
  annotations: Annotation[];
  plotValues: PlotValues;
  width: number;
  overlay: Maybe<HTMLElement>;
  theme: EuiTheme;
}

export const AnnotationsPlot = withTheme(({
  plotValues,
  annotations,
  theme,
}: Props) => {
  const tickValues = annotations.map((annotation) => annotation['@timestamp']);

  const style = {
    stroke: theme.euiColorSecondary,
    strokeDasharray: 'none',
  };

  return (
    <>
      <SharedPlot plotValues={plotValues}>
        <VerticalGridLines tickValues={tickValues} style={style} />
      </SharedPlot>
      {annotations.map((annotation) => (
        <div
          key={annotation.id}
          style={{
            position: 'absolute',
            left: plotValues.x(annotation['@timestamp']) - 8,
            top: -2,
          }}
        >
          <EuiToolTip
            title={asAbsoluteDateTime(annotation['@timestamp'], 'seconds')}
            content={
              <EuiFlexGroup>
                <EuiFlexItem grow={true}>
                  <EuiText>
                    {i18n.translate('xpack.apm.version', {
                      defaultMessage: 'Version',
                    })}
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>{annotation.text}</EuiFlexItem>
              </EuiFlexGroup>
            }
          >
            <EuiIcon type="dot" color={theme.euiColorSecondary} />
          </EuiToolTip>
        </div>
      ))}
    </>
  );
});
