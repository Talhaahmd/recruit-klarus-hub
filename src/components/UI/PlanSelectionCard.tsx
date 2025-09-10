import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanOption } from '@/types/onboarding';

interface PlanSelectionCardProps {
  plan: PlanOption;
  isSelected: boolean;
  onSelect: () => void;
}

const PlanSelectionCard: React.FC<PlanSelectionCardProps> = ({
  plan,
  isSelected,
  onSelect
}) => {
  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105",
        "border-2",
        isSelected 
          ? "border-blue-500 shadow-lg scale-105" 
          : "border-gray-200 hover:border-gray-300",
        plan.isPopular && "ring-2 ring-blue-200"
      )}
      onClick={onSelect}
    >
      {/* Popular badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-blue-500 text-white px-3 py-1 text-xs font-medium">
            <Star className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-blue-500 rounded-full p-1 shadow-lg">
            <Check className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          {plan.name}
        </CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ${plan.price}
          </span>
          <span className="text-gray-600 dark:text-gray-300 ml-1">
            /{plan.period}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {plan.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Free trial banner */}
        {plan.trialDays && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="text-center">
              <div className="text-green-800 dark:text-green-200 font-semibold text-sm">
                🎉 {plan.trialDays}-Day Free Trial
              </div>
              <div className="text-green-600 dark:text-green-300 text-xs mt-1">
                Full access, no credit card required
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            What's included:
          </h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="mt-6">
          <button
            className={cn(
              "w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors",
              isSelected
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? 'Selected' : 'Select Plan'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanSelectionCard;
