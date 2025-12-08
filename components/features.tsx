import { Cpu, Save, FileText, Volume2, Smile,Sparkles } from "lucide-react";

const features = [
  {
    title: "AI-Powered Story Generation",
    description: "Create unique stories in seconds using Grok AI.",
    icon: Cpu,
  },
  {
    title: "Save Your Stories",
    description: "Keep your stories organized and accessible anytime.",
    icon: Save,
  },
  {
    title: "Export as PDF",
    description: "Download your stories as PDFs for easy sharing.",
    icon: FileText,
  },
  {
    title: "Text-to-Speech",
    description: "Convert your stories to audio and listen on the go.",
    icon: Volume2,
  },
  {
    title: "Kids Mode",
    description: "Enable a safe and fun environment for kids.",
    icon: Smile,
  },
  {
    title: "Multi-Language Stories",
    description: "Generate stories in English, French, Spanish and more.",
    icon: Sparkles,
  },
];


export default function FeatureCards() {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-700 text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
