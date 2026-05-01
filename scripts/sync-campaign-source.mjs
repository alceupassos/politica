import fs from "node:fs";

const html = fs.readFileSync("cockpit_campanha_renato_araujo.html", "utf8");

const style = html.match(/<style>([\s\S]*?)<\/style>/i)?.[1] ?? "";
const body = html.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ?? "";
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1].trim())
  .filter(Boolean);

const appStart = body.indexOf('<div id="app">');
if (appStart === -1) {
  throw new Error("Could not find #app in cockpit_campanha_renato_araujo.html");
}

const appMarkup = body
  .slice(appStart)
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .trim();

const globals = `@import "tailwindcss";\n@import "tw-animate-css";\n\n${style}\n`;

const runtimeWithAdapter = `${scripts.join("\n\n")}

window.__campaignCockpitApi = {
  buildCharts,
  calcCoef,
  calcQP,
  updateCountdown,
  reloadCharts,
};
`;

fs.writeFileSync("app/globals.css", globals);
fs.writeFileSync(
  "components/campaign-source.ts",
  `export const campaignAppMarkup = ${JSON.stringify(appMarkup)};\n\nexport const campaignRuntime = ${JSON.stringify(runtimeWithAdapter)};\n`,
);
