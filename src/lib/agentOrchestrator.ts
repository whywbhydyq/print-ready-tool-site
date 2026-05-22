export type AgentId =
  | 'requirements-auditor'
  | 'code-quality-auditor'
  | 'seo-auditor'
  | 'deployment-auditor'
  | 'formula-auditor'
  | 'qa-merge-auditor';

export type AgentSpec = {
  id: AgentId;
  name: string;
  role: string;
  instructions: string;
};

export const agentCatalog: AgentSpec[] = [
  {
    id: 'requirements-auditor',
    name: 'Requirements Auditor',
    role: '需求审计 worker',
    instructions:
      'Audit the project strictly against requirements and development plan text. Return completed, missing, partial, risks, and concrete next fixes. Do not write code unless asked.',
  },
  {
    id: 'code-quality-auditor',
    name: 'Code Quality Auditor',
    role: '代码质量 worker',
    instructions:
      'Review implementation quality, architecture, typing, maintainability, and likely runtime/build errors. Produce actionable patch-level recommendations.',
  },
  {
    id: 'seo-auditor',
    name: 'SEO Auditor',
    role: 'SEO worker',
    instructions:
      'Audit metadata, canonical URLs, sitemap, robots, internal links, content depth, page titles, descriptions, and indexability. Flag placeholders and thin content.',
  },
  {
    id: 'deployment-auditor',
    name: 'Deployment Auditor',
    role: '部署 worker',
    instructions:
      'Audit deployment readiness, Vercel compatibility, environment variables, build commands, production URLs, route availability, caching, and operational risks.',
  },
  {
    id: 'formula-auditor',
    name: 'Formula Auditor',
    role: '公式/计算 worker',
    instructions:
      'Audit calculator formulas, units, rounding, validation, edge cases, and examples for DPI, bleed, KDP cover/interior, Etsy ratio packs, and common print sizes.',
  },
  {
    id: 'qa-merge-auditor',
    name: 'QA Merge Auditor',
    role: '汇总 worker',
    instructions:
      'Merge findings from other workers. Deduplicate, prioritize severity, identify conflicts, and produce a final execution plan with acceptance criteria.',
  },
];

export function pickAgents(ids?: AgentId[]) {
  if (!ids || ids.length === 0) return agentCatalog.slice(0, 5);
  const allowed = new Set(ids);
  return agentCatalog.filter((agent) => allowed.has(agent.id));
}

export function makeWorkerInput(args: {
  goal: string;
  context?: string;
  repository?: string;
  extra?: Record<string, unknown>;
  agent: AgentSpec;
}) {
  return [
    `Goal:\n${args.goal}`,
    args.repository ? `Repository:\n${args.repository}` : '',
    args.context ? `Context:\n${args.context}` : '',
    args.extra ? `Extra JSON:\n${JSON.stringify(args.extra, null, 2)}` : '',
    `Worker identity:\n${args.agent.name} (${args.agent.role})`,
  ]
    .filter(Boolean)
    .join('\n\n---\n\n');
}

export function extractResponseText(payload: any): string {
  if (!payload) return '';
  if (typeof payload.output_text === 'string') return payload.output_text;
  const parts: string[] = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === 'string') parts.push(content.text);
    }
  }
  return parts.join('\n').trim();
}
