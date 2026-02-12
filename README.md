# WhatsApp Chat Analyzer

A powerful Next.js application that analyzes WhatsApp chat export files and provides detailed insights on conversation patterns, message frequency, response times, and activity patterns.

![WhatsApp Chat Analyzer](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![pnpm](https://img.shields.io/badge/pnpm-10.26-orange?logo=pnpm)

## ✨ Features

- 📤 **File Upload**: Drag-and-drop or browse for WhatsApp `.txt` export files
- 👥 **Auto-detect Participants**: Automatically identifies all chat participants (no hardcoding)
- 📊 **Interactive Charts**: Visualize data with Recharts
- 📈 **Key Metrics**:
  - Message frequency by month/year per participant
  - Average response time between participants
  - Most active hours of the day per participant
  - Longest time without responding (clickable to see conversation context!)
- 🔍 **Deep Dive**: Click on longest gap bars to see the actual conversation and understand what happened
- 🎨 **Beautiful UI**: Built with shadcn/ui and Tailwind CSS
- 🔒 **Privacy First**: All processing happens client-side - no data sent to servers
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🌓 **Dark Mode**: Full dark mode support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20+)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
cd whatsapp-analyzer
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
pnpm build
pnpm start
```

## 📖 How to Use

### Step 1: Export Your WhatsApp Chat

**On iOS:**
1. Open the WhatsApp chat you want to analyze
2. Tap the contact/group name at the top
3. Scroll down and tap "Export Chat"
4. Select "Without Media"
5. Save the `.txt` file

**On Android:**
1. Open the WhatsApp chat
2. Tap the three dots (⋮) menu
3. Select "More" → "Export chat"
4. Choose "Without Media"
5. Save the `.txt` file

### Step 2: Upload & Analyze

1. Visit the application homepage
2. Drag and drop your `.txt` file or click to browse
3. Click "Analyze Chat"
4. View your comprehensive analytics dashboard!

### Step 3: Explore Insights

- **Message Frequency**: See how many messages each participant sent over time
- **Response Time**: Analyze average response times by month
- **Active Hours**: Discover when each participant is most active (per-person breakdown)
- **Longest Gap**: See the longest delay before responding per participant
  - 💡 **Interactive**: Click on any bar to open a modal showing the actual conversation context!
  - See what was said before and after the delay
  - Understand why the gap occurred
- **Filter by Month**: Focus on specific time periods

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📁 Project Structure

```
whatsapp-analyzer/
├── app/
│   ├── page.tsx              # Landing page with file upload
│   ├── dashboard/
│   │   └── page.tsx          # Analytics dashboard
│   └── layout.tsx            # Root layout with Toaster
├── components/
│   ├── ui/                   # shadcn components
│   ├── FileUpload.tsx        # File upload component
│   ├── MessageFrequencyChart.tsx
│   ├── ResponseTimeChart.tsx
│   └── ActiveHoursChart.tsx
├── lib/
│   ├── parser.ts             # WhatsApp message parsing logic
│   ├── metrics.ts            # Metrics calculation
│   ├── types.ts              # TypeScript interfaces
│   ├── type-guards.ts        # Type guards for safe narrowing
│   └── utils.ts              # Helper functions
└── public/
    └── sample-chat.txt       # Sample data for testing
```

## 🔍 Key Implementation Details

### Unicode Handling
The parser correctly handles WhatsApp's use of narrow no-break space (`\u202f`) between time and AM/PM:
```typescript
const MESSAGE_REGEX = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}[\s\u202f]?[AP]M)\s-\s([^:]+):\s(.+)/;
```

### Type Safety
Extensive use of TypeScript type guards ensures safe data handling:
- `isValidMessage()` - Validates parsed messages
- `isSystemMessage()` - Filters out system messages
- `isValidDate()` - Ensures valid Date objects

### Participant Detection
Automatically extracts unique participants from the chat file, preserving exact names including emojis and special characters.

### Response Time Calculation
Calculates the time between consecutive messages from different participants, filtering out gaps > 24 hours to focus on active conversations.

## 🧪 Testing

A sample chat file is provided at `public/sample-chat.txt` for testing. You can use this to verify all features work correctly.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/whatsapp-analyzer)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and configure build settings
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)

---

**Note**: This application processes all data locally in your browser. No chat data is ever sent to any server or stored anywhere except your browser's localStorage (only for the current session).

