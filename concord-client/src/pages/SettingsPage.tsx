import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Palette,
  User,
  Mic,
  Settings,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/components/theme-provider";
import { useAuthStore } from "@/stores/authStore";
import { Slider } from "@/components/ui/slider";

type SettingsSection = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
};

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "account",
    title: "My Account",
    icon: User,
    description: "Profile, privacy, and account settings",
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: Palette,
    description: "Themes, display, and accessibility",
  },
  {
    id: "voice",
    title: "Voice & Video",
    icon: Mic,
    description: "Audio and video settings",
  },
];

const AccountSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const handleSave = async () => {
    setSaveError("");
    setSaveSuccess("");
    setIsSaving(true);

    try {
      // TODO: Implement actual profile update API call

      // Update local state
      // updateUser({
      //   username: username.trim(),
      //   nickname: nickname.trim() || null,
      //   bio: bio.trim() || null,
      // });

      setSaveSuccess("Profile updated successfully");
      setIsChanged(false);
    } catch (error) {
      setSaveError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = () => {
    setIsChanged(true);
    setSaveError("");
    setSaveSuccess("");
  };

  return (
    <div className="space-y-6 flex flex-col justify-center self-center items-stretch w-full">
      <Card className="w-full p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Update your profile information and display settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {saveError && (
            <Alert variant="destructive">
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}

          {saveSuccess && (
            <Alert>
              <AlertDescription>{saveSuccess}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  handleChange();
                }}
                className="max-w-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nickname">Display Name</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  handleChange();
                }}
                className="max-w-sm"
                placeholder="How others see your name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  handleChange();
                }}
                className="max-w-sm"
                placeholder="Tell others about yourself"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button onClick={handleSave} disabled={!isChanged || isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            {isChanged && (
              <Button
                variant="outline"
                onClick={() => {
                  setUsername(user?.username || "");
                  setNickname(user?.nickname || "");
                  setBio(user?.bio || "");
                  setIsChanged(false);
                  setSaveError("");
                  setSaveSuccess("");
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AppearanceSettings: React.FC = () => {
  const {
    currentLightTheme,
    currentDarkTheme,
    getThemesForMode,
    mode,
    setMode,
    setTheme,
  } = useTheme();
  const lightThemes = getThemesForMode("light");
  const darkThemes = getThemesForMode("dark");

  const getModeIcon = (themeMode: "light" | "dark" | "system") => {
    switch (themeMode) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 flex flex-col justify-center self-center items-center w-full">
      {/* Theme Mode Selection */}
      <Card className="w-full p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getModeIcon(mode)}
            Theme Mode
          </CardTitle>
          <CardDescription>
            Choose between light, dark, or system preference.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setMode("light")}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                mode === "light"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <Sun className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">Light</div>
                <div className="text-xs text-muted-foreground">
                  Always use light theme
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode("dark")}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                mode === "dark"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <Moon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">Dark</div>
                <div className="text-xs text-muted-foreground">
                  Always use dark theme
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode("system")}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                mode === "system"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <Monitor className="h-6 w-6 text-gray-500" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">System</div>
                <div className="text-xs text-muted-foreground">
                  Match system preference
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Card className="w-full p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Selection
          </CardTitle>
          <CardDescription>
            Choose themes for light and dark mode. You can also create custom
            themes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Theme Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                <Label className="text-sm font-medium">Light Theme</Label>
              </div>
              <div className="font-medium">{currentLightTheme.name}</div>
              {currentLightTheme.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {currentLightTheme.description}
                </p>
              )}
              <div className="flex gap-1 mt-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentLightTheme.colors.primary }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: currentLightTheme.colors.secondary,
                  }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentLightTheme.colors.accent }}
                />
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="h-4 w-4 text-blue-400" />
                <Label className="text-sm font-medium">Dark Theme</Label>
              </div>
              <div className="font-medium">{currentDarkTheme.name}</div>
              {currentDarkTheme.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {currentDarkTheme.description}
                </p>
              )}
              <div className="flex gap-1 mt-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentDarkTheme.colors.primary }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentDarkTheme.colors.secondary }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentDarkTheme.colors.accent }}
                />
              </div>
            </div>
          </div>

          {/* Theme Grid */}
          <div className="mt-6">
            <Label className="text-sm font-medium">Available Themes</Label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {/* Light Themes */}
              {lightThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    currentLightTheme.id === theme.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{theme.name}</span>
                    <Sun className="h-4 w-4 text-yellow-500" />
                  </div>
                  {theme.description && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {theme.description}
                    </p>
                  )}
                  <div className="flex gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                </button>
              ))}

              {/* Dark Themes */}
              {darkThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    currentDarkTheme.id === theme.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{theme.name}</span>
                    <Moon className="h-4 w-4 text-blue-400" />
                  </div>
                  {theme.description && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {theme.description}
                    </p>
                  )}
                  <div className="flex gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold">{lightThemes.length}</div>
              <div className="text-sm text-muted-foreground">Light Themes</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold">{darkThemes.length}</div>
              <div className="text-sm text-muted-foreground">Dark Themes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const VoiceSettings: React.FC = () => {
  const [inputVolume, setInputVolume] = useState(75);
  const [outputVolume, setOutputVolume] = useState(100);

  return (
    <div className="space-y-6 flex flex-col justify-center self-center items-stretch w-full">
      <Card className="w-full p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Settings
          </CardTitle>
          <CardDescription>
            Configure your microphone and audio settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Input Volume: {inputVolume}%</Label>
            <Slider
              defaultValue={[inputVolume]}
              value={[inputVolume]}
              max={100}
              onValueChange={(v) => {
                setInputVolume(v[0]);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Output Volume: {outputVolume}%</Label>
            <Slider
              defaultValue={[outputVolume]}
              value={[outputVolume]}
              max={100}
              onValueChange={(v) => {
                setOutputVolume(v[0]);
              }}
            />
          </div>

          <Separator />
        </CardContent>
      </Card>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { section } = useParams();
  const currentSection = section || "account";
  const navigate = useNavigate();

  const renderSettingsContent = () => {
    switch (currentSection) {
      case "account":
        return <AccountSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "voice":
        return <VoiceSettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-1/4 flex flex-col bg-concord-secondary border-r border-concord">
        <div className="px-4 py-4 border-b border-concord">
          <h1 className="text-2xl font-semibold text-concord-primary">
            Settings
          </h1>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {SETTINGS_SECTIONS.map((settingsSection) => {
              const Icon = settingsSection.icon;
              const isActive = currentSection === settingsSection.id;

              return (
                <Button
                  key={settingsSection.id}
                  variant={isActive ? "secondary" : "ghost"}
                  onClick={() => navigate(`/settings/${settingsSection.id}`)}
                  className="w-full justify-start mb-1 h-auto p-2"
                  asChild
                >
                  <div>
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{settingsSection.title}</div>
                      {settingsSection.description && (
                        <div className="text-xs text-muted-foreground">
                          {settingsSection.description}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-concord">
          <div className="flex items-center gap-2">
            {(() => {
              const section = SETTINGS_SECTIONS.find(
                (s) => s.id === currentSection,
              );
              const Icon = section?.icon || Settings;
              return <Icon className="h-5 w-5" />;
            })()}
            <h1 className="text-2xl font-bold text-concord-primary">
              {SETTINGS_SECTIONS.find((s) => s.id === currentSection)?.title ||
                "Settings"}
            </h1>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="min-h-0 w-full bg-concord-primary h-full">
          <div className="p-6 flex w-full">{renderSettingsContent()}</div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SettingsPage;
