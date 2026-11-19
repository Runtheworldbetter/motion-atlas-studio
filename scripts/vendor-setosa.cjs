/* Compile only the original Markov article, using isolated legacy build tools. */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

async function main() {
  const [work, output, toolDirectory] = process.argv.slice(2);
  const fromTools = createRequire(path.join(toolDirectory, 'package.json'));
  for (const [name, expected] of Object.entries({ jade: '1.7.0', marked: '0.3.2', less: '2.7.3' })) {
    if (fromTools(`${name}/package.json`).version !== expected) throw new Error(`Expected ${name}@${expected}`);
  }
  const jade = fromTools('jade');
  const marked = fromTools('marked');
  const less = fromTools('less');
  jade.filters.markdown = (text) => marked(text);
  const globals = JSON.parse(fs.readFileSync(path.join(work, 'locals.json'), 'utf8'));
  const article = globals.explanations.find((item) => item.slug === 'markov-chains');
  const locals = { ...globals, ...article, basepath: './', path: '.', dev: true, pretty: true,
    href: 'https://setosa.io/ev/markov-chains/' };
  const filename = path.join(work, 'client/explanations/markov-chains/index.jade');
  const html = jade.compile(fs.readFileSync(filename, 'utf8'), { filename, pretty: true })(locals);
  fs.writeFileSync(path.join(output, 'index.html'), html);
  const variables = Object.entries(locals).filter(([, value]) => typeof value === 'string')
    .map(([key, value]) => `@${key}: ${value.startsWith('#') || value.startsWith('rgb') ? value : JSON.stringify(value)};`).join('\n');
  let globalStyle = fs.readFileSync(path.join(work, 'client/styles/style.less'), 'utf8');
  globalStyle = globalStyle.replace('@import "../../.tmp/styles/globals.less";', variables)
    .replace(/@font-face\s*\{[^}]*STIX-Regular[^}]*\}/, '')
    .replace(/\.setosa-logo\s*\{[\s\S]*?\n\}/, '');
  const fonts = [100, 300, 400].map((weight) =>
    `@font-face{font-family:Lato;font-style:normal;font-weight:${weight};font-display:swap;src:url('../fonts/Lato-${weight}.ttf') format('truetype');}`
  ).join('\n');
  const css = await less.render(globalStyle);
  fs.mkdirSync(path.join(output, 'styles'), { recursive: true });
  fs.writeFileSync(path.join(output, 'styles/style.css'), fonts + '\n' + css.css);
  const articleStyle = await less.render(fs.readFileSync(path.join(work, 'client/explanations/markov-chains/style.less'), 'utf8'));
  fs.writeFileSync(path.join(output, 'style.css'), articleStyle.css);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
