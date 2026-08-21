import { z } from "zod";

export const opportunitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  provider: z.string().min(2),
  summary: z.string().min(10),
  opportunity_type: z.enum(["hackathon", "grant", "scholarship", "program"]),
  deadline: z.iso.datetime(),
  location: z.string().min(2),
  remote: z.boolean(),
  amount_text: z.string().nullable(),
  eligibility: z.array(z.string()).min(1),
  tags: z.array(z.string()).min(1),
  source_url: z.url(),
  collected_at: z.iso.datetime(),
});

export type Opportunity = z.infer<typeof opportunitySchema>;

export type ValidationCheck = {
  id: "schema" | "completeness" | "semantics" | "volume" | "freshness";
  label: string;
  score: number;
  passed: boolean;
  detail: string;
};

export type HealthReport = {
  score: number;
  passed: boolean;
  validRecords: Opportunity[];
  invalidRecords: number;
  checks: ValidationCheck[];
};
