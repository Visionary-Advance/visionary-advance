'use client'

const INDUSTRIES = [
  {
    label: 'Construction',
    subcategories: ['General Contractor', 'Roofing', 'Electrical', 'Plumbing', 'HVAC', 'Concrete & Masonry'],
  },
  {
    label: 'Home Services',
    subcategories: ['Landscaping', 'Cleaning', 'Pest Control', 'Painting', 'Handyman'],
  },
  {
    label: 'Real Estate',
    subcategories: ['Residential', 'Commercial', 'Property Management'],
  },
  {
    label: 'Healthcare',
    subcategories: ['Dental', 'Chiropractic', 'Medical Practice', 'Veterinary'],
  },
  {
    label: 'Legal',
    subcategories: ['Personal Injury', 'Family Law', 'Criminal Defense', 'Business Law'],
  },
  {
    label: 'Restaurant & Food',
    subcategories: ['Restaurant', 'Catering', 'Food Truck', 'Bakery'],
  },
  {
    label: 'Automotive',
    subcategories: ['Auto Repair', 'Dealership', 'Detailing'],
  },
  {
    label: 'Fitness & Wellness',
    subcategories: ['Gym', 'Yoga Studio', 'Personal Training', 'Spa'],
  },
  {
    label: 'Retail',
    subcategories: ['E-commerce', 'Brick & Mortar', 'Boutique'],
  },
  {
    label: 'Professional Services',
    subcategories: ['Accounting', 'Consulting', 'Marketing Agency', 'Insurance'],
  },
  {
    label: 'Technology',
    subcategories: ['Software', 'IT Services', 'Web Development'],
  },
  {
    label: 'Education',
    subcategories: ['Tutoring', 'Online Courses', 'Trade School'],
  },
]

export { INDUSTRIES }

export default function IndustrySelect({ value, onChange, className }) {
  const parts = (value || '').split(' - ')
  const selectedIndustry = INDUSTRIES.find(i => i.label === parts[0]) ? parts[0] : ''
  const selectedSub = parts[1] || ''

  const industryData = INDUSTRIES.find(i => i.label === selectedIndustry)
  const subcategories = industryData?.subcategories || []

  const selectClass = className || 'w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none'

  return (
    <div className="space-y-2">
      <select
        value={selectedIndustry}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        <option value="">Select industry...</option>
        {INDUSTRIES.map((ind) => (
          <option key={ind.label} value={ind.label}>
            {ind.label}
          </option>
        ))}
      </select>
      {selectedIndustry && subcategories.length > 0 && (
        <select
          value={selectedSub}
          onChange={(e) => {
            const sub = e.target.value
            onChange(sub ? `${selectedIndustry} - ${sub}` : selectedIndustry)
          }}
          className={selectClass}
        >
          <option value="">Specialty (optional)</option>
          {subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
