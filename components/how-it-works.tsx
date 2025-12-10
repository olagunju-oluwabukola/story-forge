import Image from "next/image";
import workingImg from "@/public/images/howitworks.jpg";

export default function HowItWorks() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center gap-12">
    <div className="lg:w-1/2 flex justify-center">
          <Image
            src={workingImg}
            alt="How StoryForge Works Illustration"
            className="h-92 object-cover rounded-3xl"
          />
        </div>

        <div className="lg:w-1/2 space-y-6 ">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            How Does It Work?
          </h2>
          <p className="text-gray-700 text-sm  md:text-lg text-justify">
            StoryForge uses <span className="font-semibold ">Grok AI</span> to help you generate stories effortlessly.
            Simply provide a prompt or idea,the  AI will craft your story in seconds.
            You can save your stories, export them as PDFs, and even convert them to speech
            for easy listening. It’s like having your personal AI storywriter at your fingertips.
          </p>
        </div>

      </div>
    </section>
  );
}
