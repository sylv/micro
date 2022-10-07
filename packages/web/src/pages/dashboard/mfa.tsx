import { Button, ButtonStyle, Container, useAsync, useToasts } from '@ryanke/pandora';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { QRCodeSVG } from 'qrcode.react';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Copy, Download } from 'react-feather';
import { OtpInput } from 'src/components/input/otp';
import { PageLoader } from 'src/components/page-loader';
import { Steps } from 'src/components/steps';
import type { GenerateOtpMutation } from 'src/generated/graphql';
import { useConfirmOtpMutation, useGenerateOtpMutation } from 'src/generated/graphql';
import { useQueryState } from 'src/hooks/useQueryState';

export default function Generate() {
  const [generate] = useGenerateOtpMutation();
  const [result, setResult] = useState<GenerateOtpMutation | null>(null);
  const createToast = useToasts();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useQueryState('step', 0, Number);
  const [confirmOtp] = useConfirmOtpMutation();

  useEffect(() => {
    generate()
      .then(({ data }) => {
        if (!data) return;
        setResult(data);
      })
      .catch((error) => {
        createToast({
          text: error.message,
          error: true,
        });
        router.push('/dashboard');
      });
  }, []);

  const copyable = useMemo(() => {
    if (!result) return;
    const prefix = `Use these in place of OTP codes in emergency situations on ${window.location.host}. \nEach code will only work once. If you are close to running out, you should generate new codes.\n\n`;
    const body = result.generateOTP.recoveryCodes.join('\n');
    return prefix + body;
  }, [result]);

  const download = useCallback(() => {
    if (!copyable) return;
    const element = document.createElement('a');
    const file = new Blob([copyable], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${window.location.host}-recovery-codes.txt`;
    document.body.append(element);
    element.click();
  }, [copyable]);

  const copy = useCallback(() => {
    if (!copyable) return;
    navigator.clipboard.writeText(copyable);
    createToast({
      text: 'Copied recovery codes!',
    });
  }, [createToast, copyable]);

  const [confirm, confirming] = useAsync(async (otpCode: string) => {
    try {
      await confirmOtp({ variables: { otpCode } });
      createToast({ text: 'Successfully enabled 2FA!' });
      router.replace('/dashboard');
    } catch (error: any) {
      if (error.message) {
        createToast({
          text: error.message,
          error: true,
        });
      }
    }
  });

  if (!result) {
    return <PageLoader />;
  }

  return (
    <Container>
      <Steps steps={['Backup', 'Scan', 'Verify']} stepIndex={currentStep} />
      <div className="max-w-xl mx-auto mt-16">
        <div className="flex gap-8 md:h-[20em] flex flex-col-reverse md:grid md:grid-cols-6">
          {currentStep === 0 && (
            <Fragment>
              <div className="bg-gray-900 p-4 h-min rounded-xl font-mono whitespace-pre truncate text-gray-600 col-span-2 select-none text-center">
                {result.generateOTP.recoveryCodes.join('\n')}
              </div>
              <div className="col-span-4">
                <h2>Store your backup codes</h2>
                <p className="max-w-xl text-gray-500 text-sm mt-2">
                  You should store these codes somewhere safe. If you lose access to your authenticator, you can use
                  these codes to access your account. Each code will only work once.
                </p>
                <div className="flex mt-8 gap-2">
                  <Button style={ButtonStyle.Secondary} className="w-auto" onClick={download}>
                    <Download className="h-3.5 w-3.5" />
                    Download Codes
                  </Button>
                  <Button style={ButtonStyle.Secondary} className="w-auto" onClick={copy}>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Codes
                  </Button>
                </div>
              </div>
            </Fragment>
          )}
          {currentStep === 1 && (
            <Fragment>
              <div className="p-4 rounded-xl h-min bg-white col-span-2">
                <QRCodeSVG className="w-full h-full" size={128} value={result.generateOTP.qrauthUrl} />
              </div>
              <div className="col-span-4">
                <h2>Scan the QR code</h2>
                <div className="max-w-xl text-gray-500 text-sm mt-2 space-y-2">
                  <p>
                    Scan this QR code with your authenticator app. You can use any authenticator app that supports TOTP,
                    such as Google Authenticator and Authy.
                  </p>
                  <p className="text-xs text-gray-600">
                    If you can't scan the QR code, you can enter the code{' '}
                    <code className="text-purple-400">{result.generateOTP.secret}</code> manually.
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
            className={classNames(
              `text-gray-400 flex items-center gap-1 hover:underline`,
              currentStep === 0 && 'opacity-0 pointer-events-none'
            )}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <Button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep === 2}
            className="w-auto ml-auto"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Container>
  );
}
