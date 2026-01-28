## Project Summary
Mockup Studio is a professional web application for screen printing workshops. Its purpose is to generate technical production mockups (spec sheets) with accurate measurements in centimeters. It is designed to be a production tool rather than a marketing design tool.

## Tech Stack
- Next.js 15 (Turbopack)
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- jsPDF (PDF Generation)
- html2canvas (Image Generation)
- Radix UI (Tabs, Sliders, etc. via shadcn/ui)

## Architecture
- **Data-Driven Rendering**: The UI and exports are derived from a centralized state representing products, zones, designs, and inks.
- **Centimeters to Pixels**: All internal calculations for positions and sizes are based on a conversion factor (CM_TO_PX).
- **Multi-Product Support**: Projects can contain multiple products, each with its own views (Front, Back, Sleeves) and print zones.

## User Preferences
- Technical production mockups over marketing visuals.
- Professional, clean workshop-oriented UI.
- High-resolution exports (JPG + PDF).
- Inclusion of Pantone ink specifications.

## Project Guidelines
- All measurements must be displayed and handled in centimeters.
- Non-destructive data models (versioned and forward-compatible).
- Preservation of garment aspect ratios in all views and exports.
- Clear separation between garment colors and ink colors.
