import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync("cockpit_campanha_renato_araujo.html", "utf8");

const style = html.match(/<style>([\s\S]*?)<\/style>/i)?.[1] ?? "";
const body = html.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ?? "";
const appStart = body.indexOf('<div id="app">');

if (appStart === -1) {
  throw new Error("Could not find #app in cockpit_campanha_renato_araujo.html");
}

const appMarkup = body
  .slice(appStart)
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .trim();

const sectionMatches = [...appMarkup.matchAll(/<div id="sec-([a-z-]+)" class="section(?: active)?">/g)];
const sections = {};

for (let index = 0; index < sectionMatches.length; index += 1) {
  const match = sectionMatches[index];
  const id = match[1];
  const start = match.index;
  const end = index + 1 < sectionMatches.length ? sectionMatches[index + 1].index : appMarkup.indexOf('<div class="mockup-warning">');
  const rawSection = appMarkup.slice(start, end).trim();
  const normalizedSection = rawSection
    .replace(/\sonclick="showCandidateDetail\('([^']+)'\)"/g, ' data-candidate-key="$1"')
    .replace(/<div class="rank-item" data-candidate-key=/g, '<div class="rank-item" role="button" tabindex="0" data-candidate-key=')
    .replace(/<div class="cand-card([^"]*)" data-candidate-key=/g, '<div class="cand-card$1" role="button" tabindex="0" data-candidate-key=')
    .replace(/data-candidate-key="([^"]+)"\s+data-candidate-key="[^"]+"/g, 'data-candidate-key="$1"')
    .replace(/\sonchange="calcCoef\(\)"/g, "")
    .replace(/\sonchange="calcQP\(\)"/g, "");

  sections[id] = normalizedSection;
}

const pageTitlesStart = html.indexOf("const pageTitles = ");
const candidateDetailsStart = html.indexOf("const candidateDetails = ");
const showSectionStart = html.indexOf("function showSection");

if (pageTitlesStart === -1 || candidateDetailsStart === -1 || showSectionStart === -1) {
  throw new Error("Could not extract campaign data blocks from cockpit HTML");
}

const pageTitlesLiteral = html
  .slice(pageTitlesStart + "const pageTitles = ".length, candidateDetailsStart)
  .trim()
  .replace(/;$/, "");
const candidateDetailsLiteral = html
  .slice(candidateDetailsStart + "const candidateDetails = ".length, showSectionStart)
  .trim()
  .replace(/;$/, "");

const pageTitles = vm.runInNewContext(`(${pageTitlesLiteral})`);
const candidateDetails = vm.runInNewContext(`(${candidateDetailsLiteral})`);

const globals = `@import "tailwindcss";\n@import "tw-animate-css";\n\n${style}\n`;

fs.writeFileSync("app/globals.css", globals);
fs.writeFileSync(
  "components/campaign-data.ts",
  [
    `export const campaignSections = ${JSON.stringify(sections, null, 2)} as const;`,
    `export const pageTitles = ${JSON.stringify(pageTitles, null, 2)} as const;`,
    `export const candidateDetails = ${JSON.stringify(candidateDetails, null, 2)} as const;`,
  ].join("\n\n") + "\n",
);
