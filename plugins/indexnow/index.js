/**
 * Pings IndexNow after a successful production deploy.
 *
 * onSuccess rather than onPostBuild: the notification is only honest once the
 * new pages are actually being served, because a crawler that arrives early
 * re-reads the old content and the ping is wasted.
 *
 * Deploy previews and branch builds are skipped. They live on netlify.app
 * subdomains that the IndexNow key does not cover, so submitting them would be
 * rejected — and even if it were not, a preview is not something to invite a
 * crawler into.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

export const onSuccess = async ({ utils }) => {
  if (process.env.CONTEXT !== "production") {
    console.log(`IndexNow: skipped (context: ${process.env.CONTEXT})`);
    return;
  }

  /*
   * A failed ping must not fail the deploy. The site is live and correct at
   * this point; search engines finding out a few hours later via the ordinary
   * crawl is a delay, not a defect, and failing here would roll back a good
   * build over a notification.
   */
  try {
    const { stdout } = await run("node", ["scripts/ping-indexnow.mjs"]);
    console.log(stdout.trim());
  } catch (error) {
    console.log(`IndexNow: ping failed, deploy unaffected — ${error.message}`);
    utils.status.show({
      title: "IndexNow ping failed",
      summary: "The deploy succeeded. Search engines will pick the changes up on their next crawl.",
    });
  }
};
