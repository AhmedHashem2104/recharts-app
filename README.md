# AI Chart Generator with CopilotKit

A Generative UI application that uses AI to generate interactive charts and graphs based on data and natural language prompts. Built with React, TypeScript, Vite, CopilotKit, and Recharts.

## Features

- 🤖 **AI-Powered Chart Generation**: Describe your chart in natural language and let AI generate it
- 📊 **Multiple Chart Types**: Supports line charts, bar charts, pie charts, area charts, and more
- 💬 **Interactive Chat Interface**: Use the CopilotKit sidebar to chat with AI about your charts
- 🎨 **Beautiful UI**: Modern, responsive design with gradient backgrounds
- ⚡ **Real-time Updates**: See your charts update as you modify data or prompts

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn (or npm)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
yarn install
```

### Configuration

The server is configured with `EmptyAdapter` by default, which allows the server to start but won't provide AI responses. For full AI functionality, you need to configure a service adapter.

**For AI Capabilities:**

1. **Option 1: Use CopilotKit Cloud** (Recommended for demo)
   - Sign up at [CopilotKit](https://www.copilotkit.ai/)
   - Get your API key
   - Create a `.env` file in the root directory:
   ```
   VITE_COPILOTKIT_API_KEY=your_api_key_here
   ```

2. **Option 2: Configure a Local AI Service**
   - Install the required adapter package (e.g., `@ai-sdk/openai` for OpenAI)
   - Update `server.ts` to use a real service adapter:
   ```typescript
   import { OpenAIAdapter } from "@copilotkit/runtime";
   
   // In the endpoint handler:
   serviceAdapter: new OpenAIAdapter({ 
     model: "gpt-4",
     apiKey: process.env.OPENAI_API_KEY 
   })
   ```
   - Add your API key to `.env`:
   ```
   OPENAI_API_KEY=your_openai_key_here
   ```

### Running the Application

The application requires both a frontend (Vite) and backend (CopilotKit runtime) server to run.

**Start both servers:**
```bash
yarn dev
```

This will start:
- Frontend server at `http://localhost:5173`
- Backend server at `http://localhost:3001`

**Or run them separately:**
```bash
# Terminal 1: Start backend server
yarn dev:server

# Terminal 2: Start frontend server
yarn dev:client
```

The application will be available at `http://localhost:5173`

## Usage

1. **Enter Your Data**: Paste JSON data in the data input field
   - Example: `[{"name": "Jan", "value": 400}, {"name": "Feb", "value": 300}]`

2. **Describe Your Chart**: Enter a description of the chart you want
   - Examples:
     - "Create a bar chart showing sales data"
     - "Make a line graph with the data"
     - "Show me a pie chart"

3. **Use the Chat Interface**: Click the CopilotKit sidebar icon to chat with AI
   - Ask questions like: "Generate a chart with this data: [your data]"
   - The AI will automatically create the appropriate chart

4. **View Your Chart**: The generated chart will appear in the right panel

## Example Data Formats

### Time Series Data
```json
[
  {"month": "January", "sales": 4000},
  {"month": "February", "sales": 3000},
  {"month": "March", "sales": 5000}
]
```

### Categorical Data
```json
[
  {"category": "Product A", "value": 45},
  {"category": "Product B", "value": 30},
  {"category": "Product C", "value": 25}
]
```

## Technologies Used

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **CopilotKit**: AI integration and Generative UI
- **Recharts**: Charting library
- **CSS3**: Styling with modern gradients

## Project Structure

```
src/
  ├── components/
  │   └── ChartGenerator.tsx    # Chart rendering component
  ├── App.tsx                   # Main application component
  ├── App.css                   # Application styles
  ├── main.tsx                  # Entry point with CopilotKit setup
  └── index.css                 # Global styles
```

## Features in Detail

### Generative UI
The application uses CopilotKit's Generative UI feature to dynamically generate chart components based on:
- The provided data structure
- Natural language descriptions
- AI suggestions and recommendations

### Chart Types Supported
- **Line Charts**: For trends over time
- **Bar Charts**: For categorical comparisons
- **Pie Charts**: For proportional data
- **Area Charts**: For cumulative data visualization

### AI Actions
The app includes a `generateChart` action that allows the AI to:
- Parse and understand your data
- Select appropriate chart types
- Configure axes and labels
- Generate the visualization

## Development

### Building for Production

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.