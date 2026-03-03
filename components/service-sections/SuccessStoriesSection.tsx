"use client";

import { Star } from "lucide-react";

interface SuccessStory {
  propertyName: string;
  metric: string;
  quote: string;
  author: string;
  role: string;
  avatarColor?: string;
}

interface SuccessStoriesSectionProps {
  heading?: string;
  subheading?: string;
  stories?: SuccessStory[];
}

const AVATAR_COLORS: Record<string, string> = {
  "bg-pink-500": "bg-pink-500",
  "bg-blue-500": "bg-blue-500",
  "bg-green-500": "bg-green-500",
  "pink-500": "bg-pink-500",
  "blue-500": "bg-blue-500",
  "green-500": "bg-green-500",
};

const DEFAULT_STORIES: SuccessStory[] = [
  {
    propertyName: "Downtown Loft",
    metric: "Rating increased by 1.2 stars",
    quote:
      "After switching to Clensy, my cleanliness ratings went from 4.2 to 4.9. Guests now regularly mention how spotless the apartment is.",
    author: "Rachel",
    role: "Superhost since 2019",
    avatarColor: "bg-pink-500",
  },
  {
    propertyName: "Beachfront Villa",
    metric: "Bookings up 40%",
    quote:
      "Clensy's reliability means I can accept more last-minute bookings. Their quick turnovers and attention to detail have helped me become a Superhost.",
    author: "David",
    role: "Property Manager",
    avatarColor: "bg-blue-500",
  },
  {
    propertyName: "Mountain Retreat",
    metric: "Revenue increased by 25%",
    quote:
      "With Clensy handling the cleaning, I've been able to raise my nightly rates. The quality of cleaning justifies the premium price, and guests are happy to pay it.",
    author: "Sarah",
    role: "Host since 2017",
    avatarColor: "bg-green-500",
  },
];

export default function SuccessStoriesSection({
  heading = "Host Success Stories",
  subheading = "See how our specialized Airbnb cleaning services have transformed hosting experiences and helped boost ratings.",
  stories = DEFAULT_STORIES,
}: SuccessStoriesSectionProps) {
  if (!stories?.length) return null;

  return (
    <section className="py-24 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {  stories.map((story, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-8 shadow-md h-full flex flex-col"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 text-yellow-400"
                    fill="currentColor"
                  />
                ))}
                <span className="ml-2 text-sm font-medium">{story.metric}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{story.propertyName}</h3>
              <p className="text-gray-600 mb-4 flex-grow">&ldquo;{story.quote}&rdquo;</p>
              <div className="flex items-center pt-4 border-t border-gray-100 mt-auto">
                <div
                  className={`w-10 h-10 rounded-full ${AVATAR_COLORS[story.avatarColor || ""] || AVATAR_COLORS["blue-500"]} flex items-center justify-center mr-3`}
                >
                  <span className="text-white text-sm font-semibold">
                    {story.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{story.author}</p>
                  <p className="text-gray-500 text-sm">{story.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
