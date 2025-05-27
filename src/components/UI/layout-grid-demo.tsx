
"use client";
import React from "react";
import { LayoutGrid } from "@/components/ui/layout-grid";

export default function LayoutGridDemo() {
  return (
    <div className="h-screen py-20 w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        AI-Powered Matching
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Our sophisticated AI algorithms match candidates with your job requirements with unparalleled precision, saving you time and ensuring better hires.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Smart Candidate Filtering
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Filter and sort candidates based on skills, experience, and cultural fit to find your perfect match in record time.
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Recruiting Analytics
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Track your hiring pipeline with comprehensive analytics and reports to optimize your recruitment process and make data-driven decisions.
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Automated Interview Scheduling
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Streamline your interview process with automated scheduling and calendar integrations, making it easier to coordinate with candidates.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail:
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail:
      "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail:
      "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];
