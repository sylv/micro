import {
  useMutation,
  type AnyVariables,
  type DocumentInput,
  type OperationContext,
  type UseMutationResponse,
} from "@urql/preact";
import { useCallback } from "preact/hooks";
import { getErrorMessage } from "../helpers/get-error-message.helper";
import { useToasts } from "../components/toast";

export const useErrorMutation = <Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  handleErrors?: boolean,
): UseMutationResponse<Data, Variables> => {
  const [data, mutation] = useMutation(query);
  const createToast = useToasts();
  const wrappedMutation = useCallback(
    async (variables: Variables, context?: Partial<OperationContext> | undefined) => {
      const result = await mutation(variables, context);
      if (result.error) {
        if (handleErrors !== false) {
          const message = getErrorMessage(result.error);
          if (message) {
            createToast({ text: message, error: true });
          }
        }

        throw result.error;
      }

      return result;
    },
    [mutation, createToast],
  );

  return [data, wrappedMutation];
};
