/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiButton, EuiHorizontalRule, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React, { memo, useCallback } from 'react';

import { RuleStepProps, RuleStep } from '../../types';
import * as CreateRuleI18n from '../../translations';
import { Field, Form, FormDataProvider, getUseField, UseField, useForm } from '../shared_imports';
import { AddItem } from '../add_item_form';
import { defaultRiskScoreBySeverity, severityOptions, SeverityValue } from './data';
import { defaultValue } from './default_value';
import { schema } from './schema';
import * as I18n from './translations';

const CommonUseField = getUseField({ component: Field });

export const StepAboutRule = memo<RuleStepProps>(({ isLoading, setStepData }) => {
  const { form } = useForm({
    schema,
    defaultValue,
    options: { stripEmptyFields: false },
  });

  const onSubmit = useCallback(async () => {
    const { isValid: newIsValid, data } = await form.submit();
    if (newIsValid) {
      setStepData(RuleStep.aboutRule, data, newIsValid);
    }
  }, [form]);

  return (
    <>
      <Form form={form} data-test-subj="stepAboutRule">
        <CommonUseField
          path="name"
          componentProps={{
            idAria: 'detectionEngineStepAboutRuleName',
            'data-test-subj': 'detectionEngineStepAboutRuleName',
            euiFieldProps: {
              compressed: true,
              fullWidth: false,
              disabled: isLoading,
            },
          }}
        />
        <CommonUseField
          path="description"
          componentProps={{
            compressed: true,
            idAria: 'detectionEngineStepAboutRuleDescription',
            'data-test-subj': 'detectionEngineStepAboutRuleDescription',
            euiFieldProps: {
              compressed: true,
              disabled: isLoading,
            },
          }}
        />
        <CommonUseField
          path="severity"
          componentProps={{
            idAria: 'detectionEngineStepAboutRuleSeverity',
            'data-test-subj': 'detectionEngineStepAboutRuleSeverity',
            euiFieldProps: {
              compressed: true,
              fullWidth: false,
              disabled: isLoading,
              options: severityOptions,
            },
          }}
        />
        <CommonUseField
          path="riskScore"
          componentProps={{
            idAria: 'detectionEngineStepAboutRuleRiskScore',
            'data-test-subj': 'detectionEngineStepAboutRuleRiskScore',
            euiFieldProps: {
              max: 100,
              min: 0,
              compressed: true,
              fullWidth: false,
              disabled: isLoading,
              options: severityOptions,
            },
          }}
        />
        <UseField
          path="references"
          component={AddItem}
          componentProps={{
            compressed: true,
            addText: I18n.ADD_REFERENCE,
            idAria: 'detectionEngineStepAboutRuleReferenceUrls',
            isDisabled: isLoading,
            dataTestSubj: 'detectionEngineStepAboutRuleReferenceUrls',
          }}
        />
        <UseField
          path="falsePositives"
          component={AddItem}
          componentProps={{
            compressed: true,
            addText: I18n.ADD_FALSE_POSITIVE,
            idAria: 'detectionEngineStepAboutRuleFalsePositives',
            isDisabled: isLoading,
            dataTestSubj: 'detectionEngineStepAboutRuleFalsePositives',
          }}
        />
        <CommonUseField
          path="tags"
          componentProps={{
            idAria: 'detectionEngineStepAboutRuleTags',
            'data-test-subj': 'detectionEngineStepAboutRuleTags',
            euiFieldProps: {
              compressed: true,
              fullWidth: true,
              isDisabled: isLoading,
            },
          }}
        />
        <FormDataProvider pathsToWatch="severity">
          {({ severity }) => {
            const newRiskScore = defaultRiskScoreBySeverity[severity as SeverityValue];
            const riskScoreField = form.getFields().riskScore;
            if (newRiskScore != null && riskScoreField.value !== newRiskScore) {
              riskScoreField.setValue(newRiskScore);
            }
            return null;
          }}
        </FormDataProvider>
      </Form>
      <EuiHorizontalRule margin="m" />
      <EuiFlexGroup alignItems="center" justifyContent="flexEnd" gutterSize="xs" responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiButton fill onClick={onSubmit} isDisabled={isLoading}>
            {CreateRuleI18n.CONTINUE}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
});
