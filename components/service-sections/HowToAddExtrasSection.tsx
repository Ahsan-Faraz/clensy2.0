"use client";

import Image from "next/image";
import { Plus, Check } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface Step {
  stepNumber?: number;
  title: string;
  description: string;
  badge?: string;
  icon?: string;
}

interface HowToAddExtrasSectionProps {
  heading: string;
  subheading: string;
  steps: Step[];
  /** First 4 extras to show in phone mockup (name, price, priceUnit) */
  mockupExtras?: Array<{ name: string; price?: string; priceUnit?: string }>;
  logoUrl?: string;
}

const DEFAULT_LOGO =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clensy-3YxRqAp8bxVkkiFlQmcTlgTeLxuJ4t.png";

const STEP_ICON_MAP: Record<string, keyof typeof LucideIcons> = {
  Sparkles: "Sparkles",
  Check: "Check",
  Calendar: "Calendar",
  Plus: "Plus",
  FolderOpen: "FolderOpen",
};

function getStepIcon(iconName: string) {
  const key = iconName || "Plus";
  const componentName = STEP_ICON_MAP[key] || "Plus";
  return (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[componentName] || LucideIcons.Plus;
}

export default function HowToAddExtrasSection({
  heading,
  subheading,
  steps,
  mockupExtras = [
    { name: "Window Cleaning", price: "$5", priceUnit: "per window" },
    { name: "Refrigerator Cleaning", price: "$35", priceUnit: "per service" },
    { name: "Oven Cleaning", price: "$35", priceUnit: "per service" },
    { name: "Laundry Service", price: "$20", priceUnit: "per service" },
  ],
  logoUrl = DEFAULT_LOGO,
}: HowToAddExtrasSectionProps) {
  const selectedIndex = 1;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Phone Mockup - matches Clensy-3-data device-mockup */}
          <div className="relative mx-auto">
            <div className="device-mockup phone mx-auto">
              <div className="screen">
                <div className="bg-black text-white p-4">
                  <h4 className="text-center font-medium flex justify-center">
                    <Image
                      src={logoUrl}
                      alt="Clensy Logo"
                      width={80}
                      height={30}
                      className="brightness-0 invert"
                    />
                  </h4>
                </div>
                <div className="p-6">
                  <h5 className="text-lg font-medium mb-6">Add Extra Services</h5>
                  <div className="space-y-6 mb-8">
                    {mockupExtras.slice(0, 4).map((extra, i) => (
                      <div
                        key={i}
                        className={`flex justify-between items-center rounded-lg p-4 ${
                          i === selectedIndex ? "border-2 border-blue-500" : ""
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-900">{extra.name}</div>
                          <div className="text-sm text-gray-500">
                            {extra.price} {extra.priceUnit}
                          </div>
                        </div>
                        {i === selectedIndex ? (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0">
                            <Plus className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="w-full bg-black text-white py-3 rounded-lg font-medium"
                  >
                    Continue Booking
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Process Steps - step-indicator layout matching Clensy-3-data */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const IconComponent = getStepIcon(step.icon || "Plus");
              return (
                <div key={index} className="step-indicator">
                  <div className="step-number">{step.stepNumber ?? index + 1}</div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    {step.badge && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center text-sm text-gray-600">
                          <IconComponent className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                          <span>{step.badge}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
