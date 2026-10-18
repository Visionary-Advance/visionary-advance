export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  title: 'Data Deletion | Visionary Advance',
};

export default function DataDeletionLayout({ children }) {
  return <>{children}</>;
}
