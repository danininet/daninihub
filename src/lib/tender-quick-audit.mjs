// Initial self-assessment, not legal eligibility or award probability.
export const weights = Object.freeze([25,20,20,20,15]);
export const choices = Object.freeze(["yes","partial","no","unknown"]);
export function assess(answers) {
  if (!Array.isArray(answers) || answers.length !== weights.length ||
      !Array.from(answers).every(a => choices.includes(a))) throw new TypeError("Five valid answers required");
  const score = answers.reduce((s,a,i)=>s+weights[i]*(a==="yes"?1:a==="partial"?0.5:0),0);
  const gaps = answers.flatMap((a,i)=>a==="yes"?[]:[i]);
  return {score,gaps,status:answers.includes("unknown")?"review":score>=80?"initial-ready":score>=50?"partial":"prepare",eligibility:"unverified"};
}
