import type { FC } from "react";
import { graphql } from "../../../../@generated";
import type { ChangePasswordMutationVariables } from "../../../../@generated/graphql";
import { Breadcrumbs } from "../../../../components/breadcrumbs";
import { Container } from "../../../../components/container";
import { Title } from "../../../../components/title";
import { PasswordForm } from "../../../../containers/password-form";
import { navigate, prefetch } from "../../../../helpers/routing";
import { useAsync } from "../../../../hooks/useAsync";
import { useErrorMutation } from "../../../../hooks/useErrorMutation";
import { useUser } from "../../../../hooks/useUser";
import { createToast } from "../../../../components/toast/store";

const ChangePassword = graphql(`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $oldPassword, newPassword: $newPassword)
  }
`);

export const Page: FC = () => {
  const [, changeInner] = useErrorMutation(ChangePassword, false);
  const [change] = useAsync(async (values: ChangePasswordMutationVariables) => {
    prefetch("/dashboard/preferences");
    try {
      await changeInner(values);
      createToast({ message: "Your password has been changed." });
      navigate("/dashboard/preferences");
    } catch (error: any) {
      if (error.message.toLowerCase().includes("unauthorized")) {
        createToast({ message: "Invalid password." });
        return;
      } else {
        createToast({ message: "An error occurred changing your password." });
      }
    }
  });

  useUser();

  return (
    <Container>
      <Title>Change Password</Title>
      <div className="flex justify-center top-[40vh]">
        <div className="w-[80vw] md:w-[50vw] lg:w-[30vw]">
          <Breadcrumbs href="/dashboard/preferences" className="mb-4">
            Dashboard / Preferences
          </Breadcrumbs>
          <h1 className="my-5 text-4xl font-bold">Change Password</h1>
          <PasswordForm onSubmit={change} />
        </div>
      </div>
    </Container>
  );
};
