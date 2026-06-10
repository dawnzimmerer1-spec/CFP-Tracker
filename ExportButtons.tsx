'use client';

import { Proposal } from '@/lib/types';
import { downloadProposalsCsv, downloadProposalsDocx, downloadProposalsPdf } from '@/lib/export';

export function ExportButtons({ proposals, teamName }: { proposals: Proposal[]; teamName: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn-secondary" type="button" onClick={() => downloadProposalsCsv(proposals)}>Export CSV</button>
      <button className="btn-secondary" type="button" onClick={() => downloadProposalsPdf(proposals, teamName)}>Export PDF</button>
      <button className="btn-secondary" type="button" onClick={() => downloadProposalsDocx(proposals, teamName)}>Export Word</button>
    </div>
  );
}
