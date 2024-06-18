import { useQuery } from "@urql/preact";
import clsx from "clsx";
import { QRCodeSVG } from "qrcode.react";
import type { FC } from "react";
import { Fragment, useCallback, useMemo } from "react";
import { FiChevronLeft, FiChevronRight, FiCopy, FiDownload } from "react-icons/fi";
import { graphql } from "../../../@generated/gql";
import { Button, ButtonStyle } from "../../../components/button";
import { Container } from "../../../components/container";
import { Error } from "../../../components/error";
import { OtpInput } from "../../../components/input/otp";
import { PageLoader } from "../../../components/page-loader";
import { Steps } from "../../../components/steps";
import { navigate } from "../../../helpers/routing";
import { useAsync } from "../../../hooks/useAsync";
import { useQueryState } from "../../../hooks/useQueryState";
import { useErrorMutation } from "../../../hooks/useErrorMutation";
import { createToast } from "../../../components/toast/store";

const GenerateOtp = graphql(`
  query GenerateOTP {
    generateOTP {
      recoveryCodes
      qrauthUrl
      secret
    }
  }
`);

const ConfirmOTP = graphql(`
  mutation ConfirmOTP($otpCode: String!) {
    confirmOTP(otpCode: $otpCode)
  }
`);

export const Page: FC = () => {
  const [result] = useQuery({ query: GenerateOtp });
  const [currentStep, setCurrentStep] = useQueryState("step", 0, Number);
  const [, confirmOtp] = useErrorMutation(ConfirmOTP);

  const copyable = useMemo(() => {
    if (!result.data) return;
    const prefix =
      "Use these in place of OTP codes in emergency situations. \nEach code will only work once. If you are close to running out, you should generate new codes.\n\n";
    const body = result.data.generateOTP.recoveryCodes.join("\n");
    return prefix + body;
  }, [result.data]);

  const download = useCallback(() => {
    if (!copyable) return;
    const element = document.createElement("a");
    const file = new Blob([copyable], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${window.location.host}-recovery-codes.txt`;
    document.body.append(element);
    element.click();
  }, [copyable]);

  const copy = useCallback(() => {
    if (!copyable) return;
    navigator.clipboard.writeText(copyable);
    createToast({
      message: "Copied recovery codes!",
    });
  }, [createToast, copyable]);

  const [confirm, confirming] = useAsync(async (otpCode: string) => {
    await confirmOtp({ otpCode });
    createToast({ message: "Successfully enabled 2FA!" });
    navigate("/dashboard", { overwriteLastHistoryEntry: true });
  });

  if (result.fetching) return <PageLoader />;
  if (!result.data) return <Error error={result.error} />;

  return (
    <Container>
      <Steps steps={["Backup", "Scan", "Verify"]} stepIndex={currentStep} />
      <div className="max-w-xl mx-auto mt-16">
        <div className="flex gap-8 md:h-[20em] flex-col-reverse md:grid md:grid-cols-6">
          {currentStep === 0 && (
            <Fragment>
              <div className="bg-gray-900 p-4 h-min rounded-xl font-mono whitespace-pre truncate text-gray-600 col-span-2 select-none text-center">
                {result.data.generateOTP.recoveryCodes.join("\n")}
              </div>
              <div className="col-span-4">
                <h2>Store your backup codes</h2>
                <p className="max-w-xl text-gray-500 text-sm mt-2">
                  You should store these codes somewhere safe. If you lose access to your authenticator, you
                  can use these codes to access your account. Each code will only work once.
                </p>
                <div className="flex mt-8 gap-2">
                  <Button style={ButtonStyle.Secondary} className="w-auto" onClick={download}>
                    <FiDownload className="h-3.5 w-3.5" />
                    Download Codes
                  </Button>
                  <Button style={ButtonStyle.Secondary} className="w-auto" onClick={copy}>
                    <FiCopy className="h-3.5 w-3.5" />
                    Copy Codes
                  </Button>
                </div>
              </div>
            </Fragment>
          )}
          {currentStep === 1 && (
            <Fragment>
              <div className="p-4 rounded-xl h-min bg-white col-span-2">
                <QRCodeSVG className="w-full h-full" size={128} value={result.data.generateOTP.qrauthUrl} />
              </div>
              <div className="col-span-4">
                <h2>Scan the QR code</h2>
                <div className="max-w-xl text-gray-500 text-sm mt-2 space-y-2">
                  <p>
                    Scan this QR code with your authenticator app. You can use any authenticator app that
                    supports TOTP, such as Google Authenticator and Authy.
                  </p>
                  <p className="text-xs text-gray-600">
                    If you can&apos;t scan the QR code, you can enter the code{" "}
                    <code className="text-purple-400">{result.data.generateOTP.secret}</code> manually.
                  </p>
                </div>
              </div>
            </Fragment>
          )}
          {currentStep === 2 && (
            <Fragment>
              <div className="col-span-full">
                <h2>Verify your code</h2>
                <p className="max-w-xl text-gray-500 text-sm mt-2">
                  Enter the code from your authenticator app to verify that it is working.
                </p>
                <div className="flex mt-4 gap-2">
                  <OtpInput loading={confirming} onCode={confirm} />
                </div>
              </div>
            </Fragment>
          )}
        </div>
        <div className="w-full flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 0}
            className={clsx(
              "text-gray-400 flex items-center gap-1 hover:underline",
              currentStep === 0 && "opacity-0 pointer-events-none",
            )}
          >
            <FiChevronLeft className="h-4 w-4" /> Back
          </button>
          <Button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep === 2}
            className="w-auto ml-auto"
          >
            Next <FiChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Container>
  );
};
