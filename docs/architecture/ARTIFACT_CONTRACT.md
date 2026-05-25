# DaniniHub Artifact Contract

DaniniHub must not produce loose, unstructured AI text as a final system result.

Every important result should be normalized into a structured artifact.

## Contract location

- `core/contracts/artifact.schema.json`
- `core/artifacts/createArtifact.js`

## Storage

- JSON artifacts: `artifacts/json/`
- PDF-ready artifacts: `artifacts/pdf/`
- Generated PDFs: `outputs/pdf/`
- Email bodies: `outputs/email/`

## Required runtime fields

- run id
- timestamp
- mode
- input
- agent
- evidence
- result
- risks
- next step
- controller validation

## Purpose

The same artifact must be usable for:

1. CLI output
2. PDF generation
3. email delivery
4. dashboard display
5. Stripe success result
6. audit and rollback
