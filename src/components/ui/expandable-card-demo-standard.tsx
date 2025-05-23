
"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Our sophisticated AI algorithms match candidates with your job requirements with unparalleled precision",
    title: "AI-Powered Matching",
    src: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ctaText: "Learn More",
    ctaLink: "#",
    content: () => {
      return (
        <div>
          <p className="mb-4">
            Our AI-Powered Matching system revolutionizes how you find the perfect candidates for your open positions. Using advanced machine learning algorithms and natural language processing, we analyze job requirements and candidate profiles to create precise matches.
          </p>
          <h4 className="font-semibold mb-2">Key Features:</h4>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Semantic analysis of job descriptions and resumes</li>
            <li>Skills-based matching with confidence scores</li>
            <li>Cultural fit assessment through behavioral analysis</li>
            <li>Continuous learning from hiring outcomes</li>
          </ul>
          <h4 className="font-semibold mb-2">Benefits:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Reduce time-to-hire by up to 70%</li>
            <li>Improve quality of hire with data-driven insights</li>
            <li>Eliminate unconscious bias in initial screening</li>
            <li>Scale your recruitment process efficiently</li>
          </ul>
        </div>
      );
    },
  },
  {
    description: "Filter and sort candidates based on skills, experience, and cultural fit to find your perfect match",
    title: "Smart Candidate Filtering",
    src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ctaText: "Learn More",
    ctaLink: "#",
    content: () => {
      return (
        <div>
          <p className="mb-4">
            Smart Candidate Filtering empowers recruiters with advanced search and filtering capabilities that go beyond basic keyword matching. Our intelligent system understands context and relationships between skills, experiences, and job requirements.
          </p>
          <h4 className="font-semibold mb-2">Advanced Filtering Options:</h4>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Multi-dimensional skill assessment and ranking</li>
            <li>Experience level and industry background filters</li>
            <li>Location preferences and remote work compatibility</li>
            <li>Salary expectations and negotiation flexibility</li>
          </ul>
          <h4 className="font-semibold mb-2">Smart Features:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Fuzzy matching for similar skills and technologies</li>
            <li>Boolean search with natural language queries</li>
            <li>Save and share custom filter combinations</li>
            <li>Real-time candidate pool analytics</li>
          </ul>
        </div>
      );
    },
  },
  {
    description: "Track your hiring pipeline with comprehensive analytics and reports to optimize your recruitment process",
    title: "Recruiting Analytics",
    src: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ctaText: "Learn More",
    ctaLink: "#",
    content: () => {
      return (
        <div>
          <p className="mb-4">
            Our comprehensive Recruiting Analytics dashboard provides deep insights into your hiring process, helping you make data-driven decisions and continuously improve your recruitment strategy.
          </p>
          <h4 className="font-semibold mb-2">Analytics Dashboard:</h4>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Real-time pipeline tracking and stage conversions</li>
            <li>Time-to-hire metrics and bottleneck identification</li>
            <li>Source effectiveness and ROI analysis</li>
            <li>Interviewer performance and bias detection</li>
          </ul>
          <h4 className="font-semibold mb-2">Reporting Features:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Customizable reports and executive summaries</li>
            <li>Predictive analytics for hiring success</li>
            <li>Diversity and inclusion tracking</li>
            <li>Cost-per-hire and efficiency metrics</li>
          </ul>
        </div>
      );
    },
  },
  {
    description: "Streamline your interview process with automated scheduling and calendar integrations",
    title: "Automated Interview Scheduling",
    src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ctaText: "Learn More",
    ctaLink: "#",
    content: () => {
      return (
        <div>
          <p className="mb-4">
            Automated Interview Scheduling eliminates the back-and-forth emails and phone calls that slow down your hiring process. Our intelligent scheduling system coordinates between multiple stakeholders seamlessly.
          </p>
          <h4 className="font-semibold mb-2">Scheduling Features:</h4>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Calendar integration with all major platforms</li>
            <li>Automatic timezone detection and conversion</li>
            <li>Multi-interviewer coordination and availability</li>
            <li>Candidate self-scheduling with custom time slots</li>
          </ul>
          <h4 className="font-semibold mb-2">Smart Automation:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Automated email confirmations and reminders</li>
            <li>Video conference link generation</li>
            <li>Rescheduling and cancellation handling</li>
            <li>Interview preparation materials delivery</li>
          </ul>
        </div>
      );
    },
  },
];
