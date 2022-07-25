import type { ButtonProps } from '@ryanke/pandora';
import { Button } from '@ryanke/pandora';
import { useFormikContext } from 'formik';
import type { FC } from 'react';

/**
 * Wraps a button and disables when the form is not ready to be submitted.
 * Requires a form in context.
 */
export const Submit: FC<ButtonProps> = (props: ButtonProps) => {
  const form = useFormikContext();
  return (
    <Button {...props} disabled={!form.dirty || !form.isValid || form.isSubmitting}>
      {props.children}
    </Button>
  );
};
