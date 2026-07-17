import "server-only";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

// Reuse the Admin service account so there's no separate API key to manage.
function credentials() {
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials for reCAPTCHA assessment");
  }
  return { client_email: clientEmail, private_key: privateKey };
}

const PROJECT_ID = process.env.FIREBASE_ADMIN_PROJECT_ID ?? "galaxy-robot-academy";
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
const MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");

// Lazily-created singleton (survives serverless warm invocations / HMR).
const g = globalThis as unknown as { __recaptchaClient?: RecaptchaEnterpriseServiceClient };
function client(): RecaptchaEnterpriseServiceClient {
  g.__recaptchaClient ??= new RecaptchaEnterpriseServiceClient({
    projectId: PROJECT_ID,
    credentials: credentials(),
  });
  return g.__recaptchaClient;
}

export interface AssessResult {
  ok: boolean;
  score: number | null;
  reason: string | null;
}

// Create an assessment for a reCAPTCHA token and decide pass/fail.
// Fails CLOSED on a clear bot signal (invalid token, action mismatch, low
// score); fails OPEN on infrastructure errors so a transient outage can't lock
// legitimate students out.
export async function assessRecaptcha(
  token: string,
  expectedAction: string,
): Promise<AssessResult> {
  if (!token) return { ok: false, score: null, reason: "missing-token" };

  try {
    const c = client();
    const [assessment] = await c.createAssessment({
      parent: c.projectPath(PROJECT_ID),
      assessment: { event: { token, siteKey: SITE_KEY, expectedAction } },
    });

    const props = assessment.tokenProperties;
    if (!props?.valid) {
      return { ok: false, score: null, reason: String(props?.invalidReason ?? "invalid-token") };
    }
    if (props.action !== expectedAction) {
      return { ok: false, score: null, reason: "action-mismatch" };
    }

    const score = assessment.riskAnalysis?.score ?? null;
    if (score !== null && score < MIN_SCORE) {
      return { ok: false, score, reason: "low-score" };
    }
    return { ok: true, score, reason: null };
  } catch (err) {
    // Fail open on service errors — log for visibility.
    console.warn("reCAPTCHA assessment error (allowing):", err instanceof Error ? err.message : err);
    return { ok: true, score: null, reason: "assessment-error" };
  }
}
