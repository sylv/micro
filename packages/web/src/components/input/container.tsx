import classNames from 'classnames';
import type { FormikContextType } from 'formik';
import { FormikContext } from 'formik';
import type { ReactNode } from 'react';
import { Fragment, useContext } from 'react';

interface InputChildPropsBase {
  label?: string;
  id?: string;
  type?: string;
  value?: string | number;
}

export type InputChildProps<Extending> = Omit<Extending, keyof InputChildPropsBase> & InputChildPropsBase;

export enum InputStyle {
  Default = 'bg-black border-dark-600 placeholder-gray-600 focus:border-purple-400',
  Error = 'bg-red-500/20 border-red-400 placeholder-red-400 focus:ring-1 focus:ring-red-400',
}

export interface InputContainerProps<T> {
  maxHeight?: boolean;
  className?: string;
  style?: InputStyle;
  isError?: boolean;
  childProps: T;
  children: (data: { childClasses: string } & T) => ReactNode;
}

export function InputContainer<T extends InputChildPropsBase>({
  children,
  className,
  isError,
  style = isError ? InputStyle.Error : InputStyle.Default,
  maxHeight = true,
  childProps,
  ...rest
}: InputContainerProps<T>) {
  const { id } = childProps;
  const { label, ...filteredProps } = childProps;
  const formik = useContext<FormikContextType<any>>(FormikContext);
  const errorMessage = !!(formik && id && formik.touched[id]) && (formik.errors[id] as string);
  if (errorMessage) style = InputStyle.Error;
  const childClasses = classNames(
    'w-full h-full px-3 py-2 rounded outline-none border transition duration-75',
    maxHeight && 'max-h-[calc(2.65em-2px)]',
    style,
    className
  );

  if (formik) {
    if (!id) {
      throw new Error('InputContainer with formik requires an id');
    }

    // add formik props like value and onFocus to the child
    const formikProps = formik.getFieldProps(id);
    Object.assign(filteredProps, formikProps);

    // otherwise undefined values cause switching between controlled/uncontrolled
    // and password fields show the plain text password in inspect element
    delete filteredProps.value;
  }

  return (
    <Fragment {...rest}>
      {label && (
        <label htmlFor={id} className="block text-gray-600 text-sm font-medium">
          {label}
        </label>
      )}
      {children({ childClasses, ...filteredProps } as any)}
      {errorMessage && <span className="text-red-400 text-xs font-mono mt-1 truncate">{errorMessage}</span>}
    </Fragment>
  );
}
