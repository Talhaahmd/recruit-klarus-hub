import React from 'react';
import { Card, CardContent } from '@/components/UI/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoleOption } from '@/types/onboarding';

interface RoleSelectionCardProps {
  role: RoleOption;
  isSelected: boolean;
  onSelect: () => void;
}

const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  role,
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
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={onSelect}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-blue-500 rounded-full p-1 shadow-lg">
            <Check className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      <CardContent className="p-6">
        {/* Icon */}
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto",
          role.bgColor
        )}>
          <span className="text-2xl">{role.icon}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-center mb-2 text-gray-900 dark:text-white">
          {role.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4 text-sm">
          {role.description}
        </p>

        {/* Benefits */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            What you'll get:
          </h4>
          <ul className="space-y-1">
            {role.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleSelectionCard;
