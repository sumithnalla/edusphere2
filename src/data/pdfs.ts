export interface QuestionPDF {
  pdf_id: number;
  title: string;
  subject: 'maths' | 'physics' | 'chemistry' | 'general';
  description: string;
  pdf_url: string;
  uploaded_at: string;
  is_active: boolean;
}

export const STATIC_PDFS: QuestionPDF[] = [
  {
    pdf_id: 1,
    title: '1A imp',
    subject: 'maths',
    description: 'Important revision notes for 1A.',
    pdf_url: '/pdfs/1A%20IMP.pdf',
    uploaded_at: '',
    is_active: true,
  },
  {
    pdf_id: 2,
    title: '1B imp',
    subject: 'maths',
    description: 'Important revision notes for 1B.',
    pdf_url: '/pdfs/1B%20IMP.pdf',
    uploaded_at: '',
    is_active: true,
  },
  {
    pdf_id: 3,
    title: '2A imp',
    subject: 'maths',
    description: 'Important questions for 2A.',
    pdf_url: '/pdfs/2A%20IMP%20.pdf',
    uploaded_at: '',
    is_active: true,
  },
  {
    pdf_id: 4,
    title: '2B imp',
    subject: 'maths',
    description: 'Important questions for 2B.',
    pdf_url: '/pdfs/2B%20IMP%20.pdf',
    uploaded_at: '',
    is_active: true,
  },
  {
    pdf_id: 5,
    title: '2A Full Module',
    subject: 'maths',
    description: 'Complete module for 2A preparation.',
    pdf_url: '/pdfs/2A%20Full%20Module.pdf',
    uploaded_at: '',
    is_active: true,
  },
  {
    pdf_id: 6,
    title: '2A Formulas IMP.',
    subject: 'maths',
    description: 'Important 2A formula sheet.',
    pdf_url: '/pdfs/2A%20Formulas%20IMP.%20.pdf',
    uploaded_at: '',
    is_active: true,
  },
  {
    pdf_id: 7,
    title: 'Jr chemistry',
    subject: 'chemistry',
    description: 'Junior chemistry exclusive notes.',
    pdf_url: '/pdfs/Jr%20Chemistry%20%20.pdf',
    uploaded_at: '',
    is_active: true,
  },
  {
    pdf_id: 8,
    title: 'Jr physics',
    subject: 'physics',
    description: 'Junior physics exclusive notes.',
    pdf_url: '/pdfs/Jr%20Physics.pdf',
    uploaded_at: '',
    is_active: true,
  },
];
