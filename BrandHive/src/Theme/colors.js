const colors = {
  // 60% DOMINANT (Light / Clean Backgrounds, Cards, Borders)
  background: "#F8FAFC",      // Slate 50: Very clean off-white screen backgrounds
  card: "#FFFFFF",            // Pure White: Base surface for cards and containers
  white: "#FFFFFF",           // Standard white
  inputBg: "#F1F5F9",         // Slate 100: Input field background
  border: "#E2E8F0",          // Slate 200: Soft border divider lines
  lightGray: "#F8FAFC",       // Clean light gray helper
  shadow: "rgba(15, 23, 42, 0.05)", // Soft slate-900 shadow
  overlay: "rgba(15, 23, 42, 0.4)",  // Muted dark backdrop overlay
  
  // 30% SECONDARY (Deep Slate / Dark text, icons & structures)
  textPrimary: "#0F172A",     // Slate 900: High-contrast title and body text
  textSecondary: "#64748B",   // Slate 500: Medium-contrast subtitles and labels
  textMuted: "#94A3B8",       // Slate 400: Lighter muted text / placeholders
  iconPrimary: "#0F172A",     // Slate 900: Active or main icons
  iconSecondary: "#64748B",   // Slate 500: Inactive or secondary icons
  structureDark: "#151515",   // Slate 900: Bottom navbar background & dark theme wrappers
  buttonSecondary: "#1E293B", // Slate 800: Secondary buttons and action fields
  darkGray: "#344054",        // Charcoal gray for minor dark badges

  // 10% ACCENT (Vibrant Blue highlights & active states)
  primary: "#3B82F6",         // Vibrant Electric Blue: Call to action buttons & active states
  accent: "#3B82F6",          // Accent alias
  accentLight: "#EFF6FF",     // Soft blue tint (Blue 50) for selected badge background
  accentDark: "#155E75",      // Deeper blue for active borders
  button: "#3B82F6",          // Main action trigger color
  
  // UTILITY / STATUS COLORS
  success: "#10B981",         // Emerald 500: Success status
  error: "#EF4444",           // Rose 500: Error/danger alert status
  warning: "#F59E0B",         // Amber 500: Warning status
};

export default colors;