import React, { FormEvent, ReactElement, ReactNode, createContext, useCallback, useContext } from 'react';
import { Controller, ControllerFieldState, ControllerRenderProps, DefaultValues, FieldPath, FieldPathValue, FieldValues, Resolver, ResolverResult, UnpackNestedValue, UseFormStateReturn, useForm as rhUseForm, UseFormReturn as rhUseFormReturn } from 'react-hook-form';
import classnames from 'classnames';
import { validate } from 'valirator';

import { Hint, Text } from 'components/custom/typography';
import { CP } from 'components/types.tx';

import { InvariantContext } from 'utils/context';

import s from './s.module.scss';

const ConditionalWrapper = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children);

type SchemeType = {
  [field: string]: Record<string, any>;
};

type FormContext = {
  scheme?: SchemeType;
};

type UseFormReturn<V extends FieldValues = FieldValues> = rhUseFormReturn<V> & {
  updateValue: (fieldName: FieldPath<V>, value: UnpackNestedValue<FieldPathValue<V, FieldPath<V>>>) => void;
  submit: () => void | Promise<void>;
};

type InternalContextType<V extends FieldValues = FieldValues> = {
  form: UseFormReturn<V>;
};

const InternalContext = createContext<InternalContextType>(InvariantContext('Form'));

function VFormEmptyResolver(values: FieldValues): ResolverResult {
  return {
    values,
    errors: {},
  };
}

export async function VFormValidationResolver(values: FieldValues, context?: FormContext): Promise<ResolverResult> {
  const validationResult = await validate(context?.scheme, values);
  const errors = validationResult.getErrors();

  return {
    values,
    errors: Object.keys(errors).reduce((res, path) => {
      const errKey = Object.keys(errors[path])[0];

      if (errKey) {
        res[path] = {
          type: errKey,
          message: errors[path][errKey],
        };
      }

      return res;
    }, {} as Record<string, any>),
  };
}

type useFormProps<V extends FieldValues = FieldValues> = {
  validationScheme?: SchemeType;
  defaultValues?: DefaultValues<V>;
  onSubmit: (values: V) => any | Promise<any>;
};

export function useForm<V extends FieldValues = FieldValues>(props: useFormProps<V>): UseFormReturn<V> {
  const { validationScheme, defaultValues, onSubmit } = props;

  const resolver = (validationScheme ? VFormValidationResolver : VFormEmptyResolver) as Resolver<V, FormContext>;

  const rhForm = rhUseForm<V, FormContext>({
    mode: 'all',
    resolver,
    context: {
      scheme: validationScheme,
    },
    defaultValues,
    shouldUnregister: true,
  });

  const submit = rhForm.handleSubmit(onSubmit);

  const updateValue = (fieldName: FieldPath<V>, value: UnpackNestedValue<FieldPathValue<V, FieldPath<V>>>) => {
    // @ts-expect-error too hard to fix
    rhForm.setValue(fieldName, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // @ts-expect-error too hard to fix
  return Object.assign(rhForm, {
    updateValue,
    submit,
  });
}

export type FormProps<V extends FieldValues = FieldValues> = {
  form: UseFormReturn<V>;
  disabled?: boolean;
};

export function Form<V extends FieldValues = FieldValues>(props: CP<FormProps<V>>) {
  const { children, className, form, disabled = false } = props;

  const handleSubmit = useCallback(
    (ev: FormEvent) => {
      ev.preventDefault();
      form.submit();
    },
    [form.submit],
  );

  const value: InternalContextType = {
    form: form as any,
  };

  return (
    <InternalContext.Provider value={value as InternalContextType}>
      <form className={classnames(s.form, className, disabled && s.disabled)} onSubmit={handleSubmit}>
        {children}
      </form>
    </InternalContext.Provider>
  );
}

export type FieldLabelProps = {
  label: ReactNode;
  hint?: ReactNode;
  extra?: ReactNode;
};

export function FieldLabel(props: CP<FieldLabelProps>) {
  const { children, className, label, hint, extra } = props;

  return (
    <div className={classnames('flex flow-row row-gap-8', className)}>
      <div className="flex flow-col col-gap-4 justify-space-between">
        <div className="flex flow-col col-gap-4 align-center">
          <Hint text={hint}>
            {typeof label === 'string' ? (
              <Text type="small" weight="semibold" color="secondary">
                {label}
              </Text>
            ) : (
              label
            )}
          </Hint>
        </div>
        {extra}
      </div>
      {children}
    </div>
  );
}

export type FormErrorProps = {
  name: string;
  children?: ReactElement;
};

export function FormError(props: CP<FormErrorProps>) {
  const { children, name } = props;
  const { form } = useContext(InternalContext);

  const err = form.formState.errors[name];

  if (!err) {
    return null;
  }

  return (
    <Text type="small" weight="semibold" color="red">
      {err.message ?? children}
    </Text>
  );
}

export type FormItemRender = {
  field: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
};

export type FormItemProps = {
  name: string;
  label?: string;
  labelProps?: Omit<FieldLabelProps, 'label'>;
  showError?: boolean;
  children: (field: FormItemRender) => ReactElement;
};

export function FormItem(props: CP<FormItemProps>) {
  const { children, name, label, labelProps = {}, showError = true, className } = props;
  const { form } = useContext(InternalContext);

  return (
    <ConditionalWrapper
      condition={!!label}
      wrapper={children => (
        <FieldLabel label={label} className={className} {...labelProps}>
          {children}
        </FieldLabel>
      )}>
      <Controller name={name} control={form.control} render={children} shouldUnregister />
      {showError && <FormError name={name} />}
    </ConditionalWrapper>
  );
}
