import React from 'react';
import {
  Bird,
  BookOpen,
  Sparkles,
  Home,
  Calculator,
  Gift,
  Trophy,
  Gamepad2,
  Utensils,
  Package,
  Heart,
  Smile,
  Star,
  Award,
  Zap,
  Coins
} from 'lucide-react';

export const IconRenderer = ({ name, className = "w-5 h-5" }) => {
  switch (name) {
    case 'Bird':
      return <Bird className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Gift':
      return <Gift className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Gamepad2':
      return <Gamepad2 className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Package':
      return <Package className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Smile':
      return <Smile className={className} />;
    case 'Star':
      return <Star className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Coins':
      return <Coins className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
