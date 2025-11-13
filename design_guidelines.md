Nexus Cosmos Map - Design Guidelines
Design Approach
Reference-Based + System Hybrid: Drawing from Google Earth's navigation patterns, NASA mission control aesthetics, and Material Design's systematic approach for data-heavy interfaces. The interface should evoke scientific precision with subtle sci-fi sophistication - think SpaceX mission control meets Google Maps, not Star Trek.

Core Design Principles
Information Clarity Over Spectacle: Data visualization serves analysis, not decoration
Dark-Adapted Interface: Optimized for extended viewing sessions like astronomical tools
Spatial Hierarchy: Clear zones for navigation, visualization, controls, and data
Progressive Disclosure: Complex features revealed contextually
Typography
Font Families:

Primary: Inter (via Google Fonts) - UI, controls, data labels
Monospace: JetBrains Mono - technical data, coordinates, timestamps
Scale (Tailwind classes):

Hero/Headers: text-3xl font-semibold to text-5xl font-bold
Section Titles: text-xl font-semibold
Body: text-base (default readable)
Captions/Metadata: text-sm text-slate-400
Data Values: text-sm font-mono
Layout System
Spacing Units: Consistent use of 2, 4, 8, 12, 16, 24 (e.g., p-4, gap-8, mt-12)

Grid Architecture:

Dashboard (Main Page): Full-viewport layout with fixed sidebars

Left Sidebar: w-64 (collapsible to w-16 icon-only on toggle)
Top Bar: h-16 fixed header
Cosmos Viewer: Remaining space (flex-1)
Right Info Panel: w-96 (slide-in overlay on mobile)
Catalog Pages: Centered container max-w-7xl mx-auto px-8

Two-column layouts: 70/30 split (main content / filters sidebar)
Component Library
Navigation
Left Sidebar:

Fixed position, dark background (bg-slate-900/95 backdrop-blur)
Icon + label layout with gap-3 spacing
Active state: bg-blue-600/20 border-l-4 border-blue-500
Hover: bg-slate-800/50 transition-colors
Collapsed state shows icons only with tooltips
Top Bar:

App title: text-xl font-semibold with gradient text effect
Prototype badge: px-2 py-1 text-xs bg-amber-500/20 text-amber-400 rounded
User avatar: w-8 h-8 rounded-full with dropdown
Cosmos Viewer (Dashboard Centerpiece)
Mode Switcher (top-left of viewer):

Tabs component: bg-slate-800/50 rounded-lg p-1
Options: "2D Sky Map" | "Deep 3D" | "Real Data" | "Temporal"
Active tab: bg-slate-700
Viewport Controls (floating overlay, bottom-right):

Translucent panel: bg-slate-900/80 backdrop-blur-xl rounded-xl p-4
Zoom controls, reset view, layer toggles
Use icon buttons (w-10 h-10 rounded-lg)
Coordinate Display (top-right):

Real-time RA/Dec display: font-mono text-sm
Format: RA: 14h 29m 42.9s | Dec: -62° 40' 46"
Temporal Controls (when in Temporal Mode):

Bottom bar spanning full width: h-20 bg-slate-900/90 backdrop-blur
Play/pause button (left)
Timeline scrubber (center, full width flex-1)
Time display (right): font-mono text-lg
Speed controls: 1x, 10x, 100x, 1000x options
Info Panels
Object/Event Detail Panel (right side):

Slide-in drawer: w-96 on desktop, full-screen overlay on mobile
Header: Object name + type badge
Sections with space-y-6:
Basic Info (coordinates, distance, mass)
Source & Attribution
Related Objects/Events
Actions (View in 3D, Add to Watch List)
Filters Panel:

Collapsible sections with space-y-4
Object Type: Multi-select checkboxes in grid grid-cols-2 gap-2
Distance Range: Dual-handle slider
Time Range: Date picker or slider
Data Source: Toggle buttons for NASA/ESA/LIGO/GAIA
Catalog Tables
Objects/Events Lists:

Dense table layout with hover rows: hover:bg-slate-800/30
Sortable columns with caret icons
Row actions on hover (View, Select, Details)
Pagination: items-per-page selector + page numbers
Search bar: w-full max-w-md with icon, top-left above table
Cards (Patterns Page)
Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
Card: bg-slate-800/50 rounded-xl p-6 border border-slate-700/50
Header: Category badge + title
Metrics in 2-column grid: Label (left), Value (right, font-mono text-blue-400)
Footer: "View Details" link
AI Assistant (Chat Interface)
Left: Suggested queries (pill buttons, flex-wrap gap-2)
Center: Chat thread with message bubbles:
User: bg-blue-600/20 ml-auto max-w-[80%]
AI: bg-slate-800/50 mr-auto max-w-[80%]
Bottom: Input bar with send button, fixed to bottom
Data Sources Dashboard
Grid: grid-cols-1 md:grid-cols-2 gap-6
Source cards showing:
Status indicator: w-3 h-3 rounded-full (green/yellow/red)
Last sync time: font-mono text-xs
Object/event counts
Mini sparkline chart (trend visualization)
Visual Treatment
Dark Sci-Fi Theme:

Base: bg-slate-950
Panels: bg-slate-900/90
Elevated: bg-slate-800/50
Borders: border-slate-700/50
Text primary: text-slate-100
Text secondary: text-slate-400
Accent blue: For interactive elements, data highlights
Warning amber: For alerts, prototype badges
Success green: For status indicators
Depth & Layering:

Use backdrop-blur-xl for floating panels over 3D viewer
Subtle shadows: shadow-xl shadow-black/50 for elevated cards
Glassmorphism for overlays: semi-transparent with blur
Interactive States:

Buttons: bg-blue-600 hover:bg-blue-500 with smooth transitions
Links: text-blue-400 hover:text-blue-300 underline-offset-4
No neon glows or heavy animations
3D Viewer Specifics
Canvas background: Pure black (#000000)
Stars/objects: Subtle glow using Three.js materials
Grid helper: Faint white lines (opacity: 0.1)
Selection highlight: Blue outline shader
Camera controls: Smooth damping, constrained zoom limits
Responsive Behavior
Mobile (<768px): Sidebar collapses to hamburger menu, single-column catalogs
Tablet (768-1024px): Maintain dual-pane where critical, else stack
Desktop (>1024px): Full multi-panel layout as described
Images
No hero images required. This is a data-centric application where the 3D cosmos viewer serves as the visual centerpiece. All imagery is generated within Three.js canvas or represents actual space data overlays.