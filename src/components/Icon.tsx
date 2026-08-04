import {
  ArrowLeftRight, Wallet, CreditCard, Smartphone, PlusCircle, MoreHorizontal, Users, PieChart,
  CalendarDays, Headphones, Download, Target, Landmark, QrCode, Compass, Home, Building2, Zap,
  Flame, Droplet, Globe, Tv, GraduationCap, Gift, Bell, HeartHandshake, Car, Accessibility, Mic,
  ShieldCheck, Fingerprint, ScanFace, KeyRound, History, FileText, Award, Sparkles, TrendingUp,
  PiggyBank, Repeat, Send, BookmarkCheck, Clock, Receipt, Settings, LifeBuoy, HelpCircle,
  Languages, MonitorSmartphone, LogIn, Banknote, BadgePercent, Plane, Laptop, ShoppingBag,
  UserPlus, Share2, IdCard, Camera, Lock, Snowflake, ListChecks, Moon, Coins, ChartColumn,
  Lightbulb, CircleDollarSign, Star, ChevronRight, Info, Package, LayoutGrid, ArrowRight,
  Crown, Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  ArrowLeftRight, Wallet, CreditCard, Smartphone, PlusCircle, MoreHorizontal, Users, PieChart,
  CalendarDays, Headphones, Download, Target, Landmark, QrCode, Compass, Home, Building2, Zap,
  Flame, Droplet, Globe, Tv, GraduationCap, Gift, Bell, HeartHandshake, Car, Accessibility, Mic,
  ShieldCheck, Fingerprint, ScanFace, KeyRound, History, FileText, Award, Sparkles, TrendingUp,
  PiggyBank, Repeat, Send, BookmarkCheck, Clock, Receipt, Settings, LifeBuoy, HelpCircle,
  Languages, MonitorSmartphone, LogIn, Banknote, BadgePercent, Plane, Laptop, ShoppingBag,
  UserPlus, Share2, IdCard, Camera, Lock, Snowflake, ListChecks, Moon, Coins, ChartColumn,
  Lightbulb, CircleDollarSign, Star, ChevronRight, Info, Package, LayoutGrid, ArrowRight,
  Crown, Check,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Info;
  return <C className={className} strokeWidth={1.7} />;
}
