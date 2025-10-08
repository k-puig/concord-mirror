import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Hash, Volume2, Loader2 } from "lucide-react";
import { useCreateChannel } from "@/hooks/useServers";
import { CategoryWithChannels } from "@/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  instanceId: string;
  categories: CategoryWithChannels[] | undefined;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  categories,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"text" | "voice">("text");
  const [categoryId, setCategoryId] = useState("");

  const createChannelMutation = useCreateChannel();

  // Reset form when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setType("text");
      setCategoryId("");
    } else {
      setCategoryId("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation: ensure name is not empty and a category is selected
    if (!name.trim() || !categoryId || categoryId === "no-categories") {
      console.warn("Channel name and a valid category are required.");
      toast("Error", {
        description: "Channel name and a valid category are required.",
      });
      return;
    }

    try {
      await createChannelMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        type,
        categoryId,
      });

      // Reset form after successful creation
      setName("");
      setDescription("");
      setType("text");
      setCategoryId(""); // Reset to default or empty
      onClose();
    } catch (error) {
      console.error("Failed to create channel:", error);
      toast("Error", { description: <p>{`${error}`}</p> });
    }
  };

  // Helper to determine if the form is in a valid state for submission
  const isFormInvalid =
    !name.trim() || // Name is required and cannot be just whitespace
    !categoryId || // Category must be selected
    categoryId === "no-categories" || // Handle the "no categories available" placeholder
    createChannelMutation.isPending; // Disable while mutation is in progress

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel Type Selection */}
          <div className="space-y-2">
            <Label>Channel Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === "text" ? "secondary" : "ghost"}
                onClick={() => setType("text")}
                className="flex-1"
              >
                <Hash className="h-4 w-4 mr-2" />
                Text
              </Button>
              <Button
                type="button"
                variant={type === "voice" ? "secondary" : "ghost"}
                onClick={() => setType("voice")}
                className="flex-1"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Voice
              </Button>
            </div>
          </div>

          {/* Channel Name Input */}
          <div className="space-y-2">
            <Label htmlFor="channel-name">Channel Name</Label>
            <Input
              id="channel-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="awesome-channel"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="channel-category">Category</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  // Display this option if there are no categories
                  <SelectItem value="no-categories" disabled>
                    No categories available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Channel Description Textarea */}
          <div className="space-y-2">
            <Label htmlFor="channel-description">Description</Label>
            <Textarea
              id="channel-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isFormInvalid}>
              {createChannelMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Channel"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
