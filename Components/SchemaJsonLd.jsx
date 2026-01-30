// Components/SchemaJsonLd.jsx
// Component to inject JSON-LD structured data into pages

export default function SchemaJsonLd({ schema }) {
  if (!schema) return null

  // Handle single schema or array of schemas
  const schemas = Array.isArray(schema) ? schema : [schema]

  return (
    <>
      {schemas.map((s, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  )
}
