import Image from "next/image";
import storyForgeImg from "@/public/images/whyImg.png";

export default function WhatIsStoryForge() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            What is FableCraft?
          </h2>
          <p className="text-gray-700 text-sm  md:text-lg text-justify ">
            FableCraft is a powerful platform designed to help you generate stories effortlessly.
            You can save your stories, export them as PDFs, and even convert text to speech for
            easy listening. Whether you are a writer, educator, or just love storytelling,
            StoryForge brings your imagination to life!
          </p>
        </div>


        <div className="lg:w-1/2 flex justify-center">
          <Image
            src={storyForgeImg}
            alt="StoryForge Illustration"
            className=""
          />
        </div>

      </div>
    </section>
  );
}
