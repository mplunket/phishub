import { Resend } from "resend";

export const createResendClient = () =>
  new Resend(
    process.env.NEXT_PUBLIC_RESEND_KEY!,
  );
