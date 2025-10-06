import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryWithChannels } from "@/types/api";
import ChannelItem from "@/components/channel/ChannelItem";

interface CategoryHeaderProps {
  category: CategoryWithChannels;
  isExpanded: boolean;
  onToggle: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  category,
  isExpanded,
  onToggle,
}) => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-between p-4 h-6 text-md text-primary-foreground font-semibold interactive-hover uppercase tracking-wide group"
      onClick={() => {
        onToggle();
      }}
    >
      <div className="flex items-center">
        {isExpanded ? (
          <ChevronDown size={12} className="mr-1" />
        ) : (
          <ChevronRight size={12} className="mr-1" />
        )}
        <span className="truncate">{category.name}</span>
      </div>
    </Button>
  );
};

interface ChannelListProps {
  categories: CategoryWithChannels[];
}

const ChannelList: React.FC<ChannelListProps> = ({ categories }) => {
  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((cat) => cat.id)), // Start with all expanded
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="text-sm text-gray-400 px-2 py-4 text-center">
        No channels available
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {categories
        .sort((a, b) => a.position - b.position)
        .map((category) => {
          const isExpanded = expandedCategories.has(category.id);

          return (
            <div key={category.id} className="space-y-0.5">
              {/* Category Header */}
              <CategoryHeader
                category={category}
                isExpanded={isExpanded}
                onToggle={() => toggleCategory(category.id)}
              />

              <div
                className={`ml-2 space-y-0.5 transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {category.channels
                  .sort((a, b) => a.position - b.position)
                  .map((channel) => (
                    <ChannelItem key={channel.id} channel={channel} />
                  ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ChannelList;
