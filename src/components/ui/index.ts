/**
 * VA-PC UI Components
 *
 * A collection of cyberpunk-styled React components with:
 * - Glassmorphism effects
 * - Neon glow animations
 * - Purple/Magenta color scheme
 * - Framer Motion animations
 *
 * @example
 * ```tsx
 * import { Button, Card, Badge, Input, GlassCard } from '@/components/ui';
 *
 * <Card variant="glass" hoverEffect="glow">
 *   <CardHeader>
 *     <CardTitle>RTX 4090 Build</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     <Badge variant="nvidia">RTX 4090</Badge>
 *     <Badge variant="intel">i9-14900K</Badge>
 *   </CardContent>
 *   <CardFooter>
 *     <Button variant="primary">Buy Now</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */

// Base UI Components
export { Button, buttonVariants } from "./button";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  ProductCard as CardProductCard,
} from "./card";
export { Badge, badgeVariants, SpecBadge } from "./badge";
export { Input, inputVariants, SearchInput } from "./input";
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  CartSheet,
  CartSheetContent,
} from "./sheet";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  AlertDialog,
} from "./dialog";
export {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
  CardSkeleton,
  ProductCardSkeleton,
  TableRowSkeleton,
  InputSkeleton,
  HeaderSkeleton,
} from "./skeleton";

// Custom VA-PC Components
export { AnimatedBackground } from "./AnimatedBackground";
export { GlassCard } from "./GlassCard";
export { GlowButton } from "./GlowButton";
export { ProductCard } from "./ProductCard";
export { FeatureCard } from "./FeatureCard";
