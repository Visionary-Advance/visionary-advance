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
  title: 'Privacy Policy | Visionary Advance',
};

export default function PrivacyPolicyLayout({ children }) {
  return <>{children}</>;
}
