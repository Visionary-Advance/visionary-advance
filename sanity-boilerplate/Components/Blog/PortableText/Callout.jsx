// Components/Blog/PortableText/Callout.jsx
// Callout boxes with different types (info, warning, success, tip)

import { Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

const CALLOUT_STYLES = {
  info: {
    container: 'bg-blue-500/10 border-blue-500/30',
    icon: 'text-blue-400',
    title: 'text-blue-300',
    Icon: Info,
  },
  warning: {
    container: 'bg-yellow-500/10 border-yellow-500/30',
    icon: 'text-yellow-400',
    title: 'text-yellow-300',
    Icon: AlertTriangle,
  },
  success: {
    container: 'bg-green-500/10 border-green-500/30',
    icon: 'text-green-400',
    title: 'text-green-300',
    Icon: CheckCircle,
  },
  tip: {
    container: 'bg-[#008070]/10 border-[#008070]/30',
    icon: 'text-[#008070]',
    title: 'text-[#008070]',
    Icon: Lightbulb,
  },
};

export default function Callout({ value }) {
  const { type = 'info', title, content } = value;
  const style = CALLOUT_STYLES[type] || CALLOUT_STYLES.info;
  const IconComponent = style.Icon;

  return (
    <div className={`my-8 rounded-xl border p-6 ${style.container}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 ${style.icon}`}>
          <IconComponent size={24} />
        </div>

        {/* Content */}
        <div className="flex-1">
          {title && (
            <h4 className={`font-manrope font-bold text-lg mb-2 ${style.title}`}>
              {title}
            </h4>
          )}
          <div className="font-manrope text-gray-300 leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
