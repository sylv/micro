import {
  useMutation,
  type AnyVariables,
  type DocumentInput,
  type OperationContext,
  type UseMutationResponse,
} from "@urql/preact";
import { useCallback } from "preact/hooks";
import { getErrorMessage } from "../helpers/get-error-message.helper";
import { createToast } from "../components/toast/store";
import { ToastStyle } from "../components/toast/toast";

export const useErrorMutation = <Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  handleErrors?: boolean,
): UseMutationResponse<Data, Variables> => {
  const [data, mutation] = useMutation(query);
  const wrappedMutation = useCallback(
    async (variables: Variables, context?: Partial<OperationContext> | undefined) => {
      const result = await mutation(variables, context);
      if (result.error) {
        if (handleErrors !== false) {
          const message = getErrorMessage(result.error);
          if (message) {
            createToast({ message: message, style: ToastStyle.Error });
          }
        }

        throw result.error;
      }

      return result;
    },
    [mutation],
  );

  return [data, wrappedMutation];
};
