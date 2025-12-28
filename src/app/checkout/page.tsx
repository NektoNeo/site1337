'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Package,
  Zap,
  Cpu,
  CreditCard,
  Clock,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useCartStore, formatPrice, generateOrderNumber, OrderInfo } from '@/store/cart.store';
import { useRouter } from 'next/navigation';

// Animated Background Orb Component
function AnimatedOrb({
  className,
  color,
  size,
  animationDuration
}: {
  className: string;
  color: string;
  size: number;
  animationDuration: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[128px] ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{
        duration: animationDuration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Checkout Background Component
function CheckoutBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient orbs */}
      <AnimatedOrb
        className="top-0 right-1/4"
        color="rgba(139, 92, 246, 0.2)"
        size={400}
        animationDuration={8}
      />
      <AnimatedOrb
        className="bottom-1/4 left-1/4"
        color="rgba(6, 182, 212, 0.15)"
        size={350}
        animationDuration={10}
      />
      <AnimatedOrb
        className="top-1/3 left-0"
        color="rgba(168, 85, 247, 0.1)"
        size={300}
        animationDuration={12}
      />

      {/* Hexagon pattern for tech feel */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.015]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon
              points="30,2 55,15 55,37 30,50 5,37 5,15"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)"/>
      </svg>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-magenta-500/20 to-transparent"
        animate={{
          top: ['-5%', '105%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-500/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Step Progress Indicator
function CheckoutProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    { icon: CreditCard, label: 'Контакты' },
    { icon: Send, label: 'Отправка' },
    { icon: CheckCircle2, label: 'Готово' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="hidden md:flex items-center justify-center gap-2 mb-8"
    >
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="flex items-center">
            <motion.div
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-lg
                transition-all duration-300
                ${isActive
                  ? 'bg-purple-500/20 border border-purple-500/40'
                  : isCompleted
                    ? 'bg-green-500/20 border border-green-500/40'
                    : 'bg-white/5 border border-white/10'
                }
              `}
              animate={isActive ? {
                boxShadow: ['0 0 10px rgba(139,92,246,0.2)', '0 0 20px rgba(139,92,246,0.4)', '0 0 10px rgba(139,92,246,0.2)'],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : isCompleted ? 'text-green-400' : 'text-white/40'}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-purple-300' : isCompleted ? 'text-green-300' : 'text-white/40'}`}>
                {step.label}
              </span>
            </motion.div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-px mx-2 ${isCompleted ? 'bg-green-500/50' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

type ContactMethod = 'phone' | 'telegram' | 'whatsapp';

interface CheckoutFormData {
  name: string;
  phone: string;
  email: string;
  contactMethod: ContactMethod;
  comments?: string;
}

const contactMethods: { value: ContactMethod; label: string; icon: string }[] = [
  { value: 'phone', label: 'Телефон', icon: '📞' },
  { value: 'telegram', label: 'Telegram', icon: '✈️' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems, clearCart, isHydrated } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ success: boolean; orderNumber: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      contactMethod: 'phone',
    },
  });

  const selectedContactMethod = watch('contactMethod');
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && isHydrated && items.length === 0 && !orderResult) {
      router.push('/cart');
    }
  }, [mounted, isHydrated, items.length, orderResult, router]);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderNumber = generateOrderNumber();
    
    // In real app, you would send this to your backend
    console.log('Order submitted:', {
      orderNumber,
      customer: data,
      items,
      total: totalPrice,
    });

    setOrderResult({ success: true, orderNumber });
    clearCart();
    setIsSubmitting(false);
  };

  // Loading state
  if (!mounted || !isHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CheckoutBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-magenta-500/10 border border-purple-500/30 flex items-center justify-center">
              <Package className="w-10 h-10 text-purple-400" />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: '0 0 40px rgba(139,92,246,0.3)' }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
          <div className="text-center">
            <p className="text-white/50 font-mono text-sm tracking-wider mb-2">
              PREPARING CHECKOUT...
            </p>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-purple-500 to-magenta-500 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (orderResult?.success) {
    return <OrderSuccess orderNumber={orderResult.orderNumber} />;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Advanced Background Effects */}
      <CheckoutBackground />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Progress Steps */}
        <CheckoutProgress currentStep={isSubmitting ? 1 : 0} />

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/cart"
            className="
              inline-flex items-center gap-2 mb-6
              text-white/50 hover:text-white
              transition-colors duration-200
              group
            "
          >
            <motion.span whileHover={{ x: -4 }}>
              <ArrowLeft className="w-4 h-4" />
            </motion.span>
            <span className="text-sm font-medium">Вернуться в корзину</span>
          </Link>

          <div className="flex items-center gap-4 flex-wrap">
            <motion.div
              className="
                relative p-4 rounded-2xl
                bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-magenta-500/10
                border border-purple-500/30
                backdrop-blur-sm
              "
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Package className="w-8 h-8 text-purple-400" />

              {/* RGB Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(139,92,246,0.3)',
                    '0 0 40px rgba(6,182,212,0.3)',
                    '0 0 20px rgba(139,92,246,0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-purple-500/50"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
              >
                <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                  Оформление заказа
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/50 mt-2 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-green-400" />
                Безопасное оформление
              </motion.p>
            </div>

            <motion.div
              className="hidden md:flex items-center gap-3 ml-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <Cpu className="w-4 h-4 text-magenta-500" />
                </motion.div>
                <span className="text-xs text-white/40 font-mono tracking-wider">VA-PC.CHECKOUT.v2</span>
              </div>
            </motion.div>
          </div>

          {/* Decorative line with animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="mt-8 h-px bg-gradient-to-r from-purple-500/50 via-magenta-500/30 to-transparent origin-left relative"
          >
            <motion.div
              className="absolute left-0 top-0 w-20 h-px bg-gradient-to-r from-purple-500 to-magenta-500"
              animate={{ x: ['0%', '500%', '0%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </motion.header>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information Card */}
              <div className="
                relative rounded-2xl overflow-hidden
                bg-gradient-to-br from-white/[0.08] to-white/[0.02]
                backdrop-blur-xl
                border border-white/10
                p-6
              ">
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-purple-500/50" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-magenta-500/50" />

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  Контактные данные
                </h2>

                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Имя <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input
                        type="text"
                        {...register('name', { 
                          required: 'Введите ваше имя',
                          minLength: { value: 2, message: 'Минимум 2 символа' }
                        })}
                        placeholder="Ваше имя"
                        className={`
                          w-full pl-12 pr-4 py-4 rounded-xl
                          bg-white/5 border
                          text-white placeholder-white/30
                          outline-none
                          transition-all duration-300
                          ${errors.name 
                            ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                            : 'border-white/10 focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                          }
                        `}
                      />
                    </div>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {errors.name.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Телефон <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input
                        type="tel"
                        {...register('phone', { 
                          required: 'Введите номер телефона',
                          pattern: {
                            value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                            message: 'Введите корректный номер телефона'
                          }
                        })}
                        placeholder="+7 (___) ___-__-__"
                        className={`
                          w-full pl-12 pr-4 py-4 rounded-xl
                          bg-white/5 border
                          text-white placeholder-white/30
                          outline-none font-mono
                          transition-all duration-300
                          ${errors.phone 
                            ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                            : 'border-white/10 focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                          }
                        `}
                      />
                    </div>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {errors.phone.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Введите email',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Введите корректный email'
                          }
                        })}
                        placeholder="your@email.com"
                        className={`
                          w-full pl-12 pr-4 py-4 rounded-xl
                          bg-white/5 border
                          text-white placeholder-white/30
                          outline-none
                          transition-all duration-300
                          ${errors.email 
                            ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                            : 'border-white/10 focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                          }
                        `}
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Contact Method Selection */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Предпочтительный способ связи
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {contactMethods.map((method) => (
                        <motion.button
                          key={method.value}
                          type="button"
                          onClick={() => setValue('contactMethod', method.value)}
                          className={`
                            flex items-center gap-2 px-4 py-3 rounded-xl
                            border transition-all duration-300
                            ${selectedContactMethod === method.value
                              ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                              : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:bg-white/10'
                            }
                          `}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>{method.icon}</span>
                          <span className="text-sm font-medium">{method.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Comments Field */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Комментарий к заказу
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-white/30" />
                      <textarea
                        {...register('comments')}
                        placeholder="Дополнительные пожелания или вопросы..."
                        rows={4}
                        className="
                          w-full pl-12 pr-4 py-4 rounded-xl
                          bg-white/5 border border-white/10
                          text-white placeholder-white/30
                          outline-none resize-none
                          transition-all duration-300
                          focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Manager Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="
                  relative rounded-xl p-5
                  bg-gradient-to-br from-magenta-500/10 to-purple-500/10
                  border border-magenta-500/20
                "
              >
                <div className="flex items-start gap-4">
                  <div className="
                    flex-shrink-0 p-2 rounded-lg
                    bg-magenta-500/20 border border-magenta-500/30
                  ">
                    <ShieldCheck className="w-5 h-5 text-magenta-400" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Наш менеджер свяжется с вами для уточнения деталей и оформления оплаты
                    </p>
                    <p className="text-white/40 text-xs mt-2">
                      Обычно мы отвечаем в течение 30 минут в рабочее время
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`
                  relative w-full py-5 px-8 rounded-xl
                  font-bold text-lg text-white
                  overflow-hidden
                  transition-all duration-300
                  group
                  ${isSubmitting 
                    ? 'bg-purple-600/50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-magenta-500'
                  }
                `}
                whileHover={!isSubmitting ? { scale: 1.01 } : undefined}
                whileTap={!isSubmitting ? { scale: 0.99 } : undefined}
              >
                {/* Glow */}
                {!isSubmitting && (
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: '0 0 40px rgba(139,92,246,0.5)',
                    }}
                  />
                )}

                {/* Shimmer */}
                {!isSubmitting && (
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
                    <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  </div>
                )}

                <span className="relative flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Отправка заявки...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>Отправить заявку</span>
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="
              sticky top-24
              rounded-2xl overflow-hidden
              bg-gradient-to-br from-white/[0.08] to-white/[0.02]
              backdrop-blur-xl
              border border-white/10
            ">
              {/* Header */}
              <button
                onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
                className="
                  w-full p-6 
                  flex items-center justify-between
                  border-b border-white/10
                  lg:cursor-default
                "
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-white">Ваш заказ</span>
                  <span className="
                    px-2 py-1 rounded-full
                    bg-purple-500/20 text-purple-400
                    text-xs font-mono
                  ">
                    {totalItems}
                  </span>
                </div>
                <div className="lg:hidden">
                  {orderSummaryOpen ? (
                    <ChevronUp className="w-5 h-5 text-white/50" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/50" />
                  )}
                </div>
              </button>

              {/* Items List */}
              <AnimatePresence>
                {(orderSummaryOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden lg:!h-auto lg:!opacity-100"
                  >
                    <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                        >
                          <div className="
                            relative w-12 h-12 rounded-lg overflow-hidden
                            bg-gradient-to-br from-purple-900/30 to-black
                            border border-white/10
                            flex-shrink-0
                          ">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Package className="w-5 h-5 text-purple-500/50" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{item.name}</p>
                            <p className="text-xs text-white/40">
                              {item.quantity} x {formatPrice(item.price)}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-white">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Total */}
              <div className="p-6 border-t border-white/10">
                <div className="flex justify-between items-end">
                  <span className="text-white/60">Итого к оплате</span>
                  <span className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">
                      {formatPrice(totalPrice)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
        {/* Gradient line */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        {/* Corner accents */}
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-purple-500/20 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-magenta-500/20 rounded-br-lg" />
      </div>
    </div>
  );
}

/**
 * Order Success Component
 */
function OrderSuccess({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Advanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-[128px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-magenta-600/20 rounded-full blur-[128px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.15, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Success confetti particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${50 + (Math.random() - 0.5) * 60}%`,
              top: '50%',
              background: i % 3 === 0 ? '#22C55E' : i % 3 === 1 ? '#8B5CF6' : '#06B6D4',
            }}
            initial={{ y: 0, opacity: 1, scale: 0 }}
            animate={{
              y: [0, -200 - Math.random() * 200],
              x: [(Math.random() - 0.5) * 200],
              opacity: [1, 0],
              scale: [0, 1, 0.5],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: 0.5 + i * 0.05,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center px-4 max-w-lg"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2
          }}
          className="relative w-36 h-36 mx-auto mb-8"
        >
          {/* Outer animated rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-500/40"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-magenta-500/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-purple-500/20"
            animate={{ scale: [1, 1.7, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          />

          {/* Main circle with glow */}
          <motion.div
            className="
              absolute inset-0 rounded-full
              bg-gradient-to-br from-green-500/20 via-magenta-500/10 to-purple-500/10
              border-2 border-green-500/40
              flex items-center justify-center
              backdrop-blur-sm
            "
            animate={{
              boxShadow: [
                '0 0 30px rgba(34,197,94,0.3)',
                '0 0 60px rgba(34,197,94,0.5)',
                '0 0 30px rgba(34,197,94,0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle2 className="w-20 h-20 text-green-400" />
            </motion.div>
          </motion.div>

          {/* Sparkles */}
          <motion.div
            className="absolute -top-3 -right-3"
            animate={{ rotate: 360, scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-magenta-400" />
          </motion.div>
          <motion.div
            className="absolute -bottom-3 -left-3"
            animate={{ rotate: -360, scale: [1, 1.4, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
          </motion.div>
          <motion.div
            className="absolute top-1/2 -right-6"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <Sparkles className="w-5 h-5 text-green-400" />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 via-magenta-400 to-purple-400 bg-clip-text text-transparent">
              Заявка отправлена!
            </span>
          </h1>

          <motion.div
            className="
              inline-block px-8 py-4 mb-6 rounded-2xl
              bg-gradient-to-r from-green-500/10 via-purple-500/10 to-magenta-500/10
              border border-green-500/30
              backdrop-blur-sm
            "
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-white/60 text-sm block mb-1">Номер заказа</span>
            <p className="text-2xl font-mono font-bold bg-gradient-to-r from-green-400 to-magenta-400 bg-clip-text text-transparent">
              {orderNumber}
            </p>
          </motion.div>

          <motion.p
            className="text-white/60 mb-8 leading-relaxed text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Мы свяжемся с вами в ближайшее время для уточнения деталей и оформления оплаты
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Link href="/">
              <motion.button
                className="
                  relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                  bg-gradient-to-r from-purple-600 to-magenta-600
                  font-semibold text-white
                  overflow-hidden
                  group
                "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </div>
                <span className="relative">На главную</span>
              </motion.button>
            </Link>

            <Link href="/catalog">
              <motion.button
                className="
                  inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                  bg-white/5 border border-white/20
                  font-semibold text-white
                  hover:bg-white/10 hover:border-white/30
                  transition-all duration-300
                "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>В каталог</span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom decorative elements */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        />
      </div>
    </div>
  );
}
