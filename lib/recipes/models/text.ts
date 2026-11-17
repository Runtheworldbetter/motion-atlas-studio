/** Conservative width estimates keep labels inside a fixed canvas; full text stays in data rows. */
export function textUnits(text:string):number {
  return [...text].reduce((sum,char) => {
    if (/\p{Mark}/u.test(char)) return sum;
    const point = char.codePointAt(0) || 0;
    if (point >= 0x2e80) return sum + 1.08;
    if (/[MW@#%&]/.test(char)) return sum + 0.95;
    if (/[ilI1.,:;'!| ]/.test(char)) return sum + 0.34;
    return sum + 0.64;
  },0);
}

export function fitText(text:string,maxWidth:number,fontSize:number):string {
  if (textUnits(text) * fontSize <= maxWidth) return text;
  let fitted = '';
  for (const char of text) {
    if (textUnits(fitted + char + '…') * fontSize > maxWidth) break;
    fitted += char;
  }
  return fitted.trimEnd() + '…';
}

export function wrapLabel(text:string,maxWidth:number,fontSize:number):string {
  const words = text.split(/\s+/);
  let first = '', second = '';
  while (words.length) {
    const next = first ? `${first} ${words[0]}` : words[0];
    if (textUnits(next) * fontSize > maxWidth) break;
    first = next; words.shift();
  }
  if (!first) return fitText(text,maxWidth,fontSize);
  second = words.join(' ');
  return second ? first + '\n' + fitText(second,maxWidth,fontSize) : first;
}
