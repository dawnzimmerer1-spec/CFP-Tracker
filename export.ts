import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import jsPDF from 'jspdf';
import { Proposal } from '@/lib/types';

function clean(value: unknown) {
  return value === null || value === undefined || value === '' ? '' : String(value);
}

const exportHeaders = [
  'Proposal title', 'Conference', 'Deadline', 'Status', 'Owner', 'Review due', 'Submission date', 'Decision date',
  'Result', 'Presentation date/time', 'Session format', 'Draft link', 'Submission confirmation', 'Tags/topics',
  'Short description', 'Abstract', 'Learning outcomes', 'Needed materials', 'Notes'
];

export function proposalToRow(proposal: Proposal) {
  return [
    proposal.title,
    proposal.conference?.name,
    proposal.conference?.proposal_deadline,
    proposal.status,
    proposal.primary_owner?.name,
    proposal.review_due_date,
    proposal.submission_date,
    proposal.decision_date,
    proposal.result,
    proposal.presentation_datetime,
    proposal.session_format_selected,
    proposal.draft_link,
    proposal.submission_confirmation_note,
    proposal.tags_topics,
    proposal.short_description,
    proposal.abstract,
    proposal.learning_outcomes,
    proposal.needed_materials,
    proposal.notes
  ].map(clean);
}

export function proposalsToCsv(proposals: Proposal[]) {
  const rows = [exportHeaders, ...proposals.map(proposalToRow)];
  return rows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
    .join('\n');
}

export function downloadTextFile(filename: string, text: string, type = 'text/csv;charset=utf-8') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadProposalsCsv(proposals: Proposal[]) {
  downloadTextFile('cfp-tracker-proposals.csv', proposalsToCsv(proposals));
}

export function downloadProposalsPdf(proposals: Proposal[], teamName = 'CFP Tracker') {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 40;
  let y = 48;
  doc.setFontSize(18);
  doc.text(`${teamName} Proposal Export`, margin, y);
  y += 28;
  doc.setFontSize(10);
  proposals.forEach((proposal, index) => {
    if (y > 700) { doc.addPage(); y = 48; }
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${proposal.title}`, margin, y);
    y += 16;
    doc.setFontSize(10);
    const lines = [
      `Conference: ${clean(proposal.conference?.name)} | Deadline: ${clean(proposal.conference?.proposal_deadline)}`,
      `Status: ${proposal.status} | Owner: ${clean(proposal.primary_owner?.name)} | Review due: ${clean(proposal.review_due_date)}`,
      `Session format: ${clean(proposal.session_format_selected)} | Presentation: ${clean(proposal.presentation_datetime)}`,
      `Draft: ${clean(proposal.draft_link)}`,
      `Confirmation: ${clean(proposal.submission_confirmation_note)}`,
      `Abstract: ${clean(proposal.abstract)}`,
      `Notes: ${clean(proposal.notes)}`
    ];
    lines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, 520);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 12 + 3;
    });
    y += 10;
  });
  doc.save('cfp-tracker-proposals.pdf');
}

export async function downloadProposalsDocx(proposals: Proposal[], teamName = 'CFP Tracker') {
  const rows = [
    new TableRow({ children: exportHeaders.slice(0, 7).map((header) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: header, bold: true })] })] })) }),
    ...proposals.map((proposal) => new TableRow({ children: proposalToRow(proposal).slice(0, 7).map((cell) => new TableCell({ children: [new Paragraph(cell)] })) }))
  ];

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ children: [new TextRun({ text: `${teamName} Proposal Export`, bold: true, size: 32 })] }),
        new Paragraph(''),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }),
        new Paragraph(''),
        ...proposals.flatMap((proposal) => [
          new Paragraph({ children: [new TextRun({ text: proposal.title, bold: true, size: 26 })] }),
          new Paragraph(`Conference: ${clean(proposal.conference?.name)}`),
          new Paragraph(`Status: ${proposal.status}`),
          new Paragraph(`Owner: ${clean(proposal.primary_owner?.name)}`),
          new Paragraph(`Abstract: ${clean(proposal.abstract)}`),
          new Paragraph(`Learning outcomes: ${clean(proposal.learning_outcomes)}`),
          new Paragraph(`Notes: ${clean(proposal.notes)}`),
          new Paragraph('')
        ])
      ]
    }]
  });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'cfp-tracker-proposals.docx';
  anchor.click();
  URL.revokeObjectURL(url);
}
