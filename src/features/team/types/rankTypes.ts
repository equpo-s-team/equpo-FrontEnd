import { Crown, Medal, Trophy, Rocket, Target, Key, Hammer, BookOpen, Footprints, Swords } from "lucide-react";

export type Rank = {
  name: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
};

export const ranks: Rank[] = [
  { name: "Novato", color: "text-grey-500", bgColor: "bg-grey-100", icon: Footprints },
  { name: "Aprendiz", color: "text-green-300", bgColor: "bg-green-100", icon: BookOpen },
  { name: "Practicante", color: "text-blue-300", bgColor: "bg-blue-100", icon: Hammer },
  { name: "Avanzado", color: "text-blue-foreground", bgColor: "bg-blue-50", icon: Rocket },
  { name: "Experto", color: "text-purple-300", bgColor: "bg-purple-100", icon: Target },
  { name: "Mentor", color: "text-orange-200", bgColor: "bg-orange-100", icon: Key },
  { name: "Maestro", color: "text-grey-400", bgColor: "bg-grey-150", icon: Trophy },
  { name: "Élite", color: "text-red-300", bgColor: "bg-red-100", icon: Swords },
  { name: "Campeón", color: "text-orange-300", bgColor: "bg-orange-150", icon: Medal },
  { name: "Legendario", color: "text-grey-800", bgColor: "bg-grey-200", icon: Crown },
];
