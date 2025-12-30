'use client';

/**
 * OrderModal - Checkout form for PC configurator
 *
 * Features:
 * - Personal info collection (name, phone, email)
 * - Delivery options (CDEK PVZ or Pickup)
 * - Payment method selection (cash, card, online)
 * - Order summary with configuration details
 * - Form validation
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  Store,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle,
  Loader2,
  MessageSquare,
  Gift,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrderFormData, ConfiguratorState } from './types';
import { formatPrice } from './data';
import { Button } from '@/components/ui/button';

// ============================================================================
// TYPES
// ============================================================================

interface OrderModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Close modal callback */
  onClose: () => void;
  /** Submit order callback */
  onSubmit: (data: OrderFormData) => Promise<void>;
  /** Current configurator state */
  config: ConfiguratorState;
  /** Form data */
  formData: OrderFormData;
  /** Update form data */
  onUpdateForm: (data: Partial<OrderFormData>) => void;
}

type FormStep = 'info' | 'delivery' | 'payment' | 'confirm';

// ============================================================================
// CONSTANTS
// ============================================================================

const FORM_STEPS: { id: FormStep; title: string; icon: React.ReactNode }[] = [
  { id: 'info', title: 'Контакты', icon: <User className="w-4 h-4" /> },
  { id: 'delivery', title: 'Доставка', icon: <Truck className="w-4 h-4" /> },
  { id: 'payment', title: 'Оплата', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'confirm', title: 'Проверка', icon: <CheckCircle className="w-4 h-4" /> },
];

// ============================================================================
// INPUT COMPONENT
// ============================================================================

interface FormInputProps {
  label: string;
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

function FormInput({
  label,
  icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  error,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-white/70">
        {icon}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full px-4 py-3 rounded-lg',
            'bg-white/5 border transition-all duration-300',
            'text-white placeholder:text-white/30',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
            error
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 hover:border-white/20 focus:border-purple-500/50'
          )}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// OPTION CARD COMPONENT
// ============================================================================

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  isSelected: boolean;
  onClick: () => void;
  badge?: string;
}

function OptionCard({
  icon,
  title,
  description,
  isSelected,
  onClick,
  badge,
}: OptionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative w-full p-4 rounded-xl text-left',
        'border-2 transition-all duration-300',
        isSelected
          ? 'bg-purple-500/10 border-purple-500 shadow-lg shadow-purple-500/20'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'p-3 rounded-lg transition-colors',
            isSelected ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/50'
          )}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn('font-medium', isSelected ? 'text-white' : 'text-white/70')}>
              {title}
            </span>
            {badge && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-300">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-white/50">{description}</p>
          )}
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center"
          >
            <CheckCircle className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

// ============================================================================
// FORM STEPS
// ============================================================================

function ContactInfoStep({
  formData,
  onUpdate,
  errors,
}: {
  formData: OrderFormData;
  onUpdate: (data: Partial<OrderFormData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <FormInput
        label="Имя"
        icon={<User className="w-4 h-4" />}
        value={formData.firstName}
        onChange={(v) => onUpdate({ firstName: v })}
        placeholder="Ваше имя"
        required
        error={errors.firstName}
      />

      <FormInput
        label="Фамилия"
        icon={<User className="w-4 h-4" />}
        value={formData.lastName}
        onChange={(v) => onUpdate({ lastName: v })}
        placeholder="Ваша фамилия"
        required
        error={errors.lastName}
      />

      <FormInput
        label="Телефон"
        icon={<Phone className="w-4 h-4" />}
        type="tel"
        value={formData.phone}
        onChange={(v) => onUpdate({ phone: v })}
        placeholder="+7 (999) 999-99-99"
        required
        error={errors.phone}
      />

      <FormInput
        label="Email"
        icon={<Mail className="w-4 h-4" />}
        type="email"
        value={formData.email || ''}
        onChange={(v) => onUpdate({ email: v })}
        placeholder="email@example.com"
      />
    </motion.div>
  );
}

function DeliveryStep({
  formData,
  onUpdate,
}: {
  formData: OrderFormData;
  onUpdate: (data: Partial<OrderFormData>) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <OptionCard
        icon={<Truck className="w-5 h-5" />}
        title="Доставка СДЭК"
        description="Доставка до пункта выдачи в вашем городе"
        isSelected={formData.deliveryType === 'cdek'}
        onClick={() => onUpdate({ deliveryType: 'cdek' })}
        badge="3-7 дней"
      />

      <OptionCard
        icon={<Store className="w-5 h-5" />}
        title="Самовывоз"
        description="Бесплатно из нашего офиса в Москве"
        isSelected={formData.deliveryType === 'pickup'}
        onClick={() => onUpdate({ deliveryType: 'pickup' })}
        badge="Бесплатно"
      />

      {formData.deliveryType === 'cdek' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 pt-4 border-t border-white/10"
        >
          <FormInput
            label="Город"
            icon={<MapPin className="w-4 h-4" />}
            value={formData.cdekAddress?.city || ''}
            onChange={(v) =>
              onUpdate({ cdekAddress: { ...formData.cdekAddress!, city: v, pvzCode: '', pvzAddress: '' } })
            }
            placeholder="Введите город"
            required
          />

          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm text-purple-300">
              <MapPin className="w-4 h-4 inline mr-2" />
              После оформления заказа менеджер свяжется с вами для уточнения ПВЗ СДЭК
            </p>
          </div>
        </motion.div>
      )}

      {formData.deliveryType === 'pickup' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
        >
          <p className="text-sm text-emerald-300 flex items-start gap-2">
            <Store className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Адрес офиса:</strong> г. Москва, ул. Примерная, д. 1<br />
              <span className="text-emerald-300/70">Пн-Сб 10:00 - 20:00</span>
            </span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function PaymentStep({
  formData,
  onUpdate,
}: {
  formData: OrderFormData;
  onUpdate: (data: Partial<OrderFormData>) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <OptionCard
        icon={<CreditCard className="w-5 h-5" />}
        title="Картой при получении"
        description="Оплата банковской картой курьеру или в ПВЗ"
        isSelected={formData.paymentMethod === 'card'}
        onClick={() => onUpdate({ paymentMethod: 'card' })}
      />

      <OptionCard
        icon={<Banknote className="w-5 h-5" />}
        title="Наличными"
        description="Оплата наличными при получении"
        isSelected={formData.paymentMethod === 'cash'}
        onClick={() => onUpdate({ paymentMethod: 'cash' })}
      />

      <OptionCard
        icon={<Smartphone className="w-5 h-5" />}
        title="Онлайн оплата"
        description="Visa, Mastercard, СБП, ЮMoney"
        isSelected={formData.paymentMethod === 'card_online'}
        onClick={() => onUpdate({ paymentMethod: 'card_online' })}
        badge="Скидка 2%"
      />

      {/* Promo code */}
      <div className="pt-4 border-t border-white/10">
        <FormInput
          label="Промокод"
          icon={<Gift className="w-4 h-4" />}
          value={formData.promoCode || ''}
          onChange={(v) => onUpdate({ promoCode: v })}
          placeholder="Введите промокод"
        />
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-white/70">
          <MessageSquare className="w-4 h-4" />
          Комментарий к заказу
        </label>
        <textarea
          value={formData.comment || ''}
          onChange={(e) => onUpdate({ comment: e.target.value })}
          placeholder="Дополнительные пожелания..."
          rows={3}
          className={cn(
            'w-full px-4 py-3 rounded-lg resize-none',
            'bg-white/5 border border-white/10',
            'text-white placeholder:text-white/30',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50',
            'transition-all duration-300'
          )}
        />
      </div>
    </motion.div>
  );
}

function ConfirmStep({
  formData,
  config,
}: {
  formData: OrderFormData;
  config: ConfiguratorState;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Order summary */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
        <h4 className="font-medium text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Ваша конфигурация
        </h4>

        <div className="space-y-2 text-sm">
          {config.selectedLine && (
            <div className="flex justify-between">
              <span className="text-white/50">Линейка</span>
              <span className="text-white">{config.selectedLine.name}</span>
            </div>
          )}
          {config.components.cpu && (
            <div className="flex justify-between">
              <span className="text-white/50">Процессор</span>
              <span className="text-white truncate ml-4">{config.components.cpu.name}</span>
            </div>
          )}
          {config.components.gpu && (
            <div className="flex justify-between">
              <span className="text-white/50">Видеокарта</span>
              <span className="text-white truncate ml-4">{config.components.gpu.name}</span>
            </div>
          )}
          {config.waterCooling.enabled && (
            <div className="flex justify-between">
              <span className="text-white/50">Водяное охлаждение</span>
              <span className="text-purple-400">Да</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-white">Итого</span>
            <span className="text-gradient-purple">{formatPrice(config.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Contact info summary */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <h4 className="font-medium text-white flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" />
          Контактные данные
        </h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">Имя</span>
            <span className="text-white">{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Телефон</span>
            <span className="text-white">{formData.phone}</span>
          </div>
          {formData.email && (
            <div className="flex justify-between">
              <span className="text-white/50">Email</span>
              <span className="text-white">{formData.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delivery summary */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <h4 className="font-medium text-white flex items-center gap-2">
          <Truck className="w-4 h-4 text-purple-400" />
          Доставка
        </h4>

        <div className="text-sm">
          <span className="text-white">
            {formData.deliveryType === 'cdek' ? 'СДЭК' : 'Самовывоз'}
          </span>
          {formData.deliveryType === 'cdek' && formData.cdekAddress?.city && (
            <span className="text-white/50 ml-2">• {formData.cdekAddress.city}</span>
          )}
        </div>
      </div>

      {/* Payment summary */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <h4 className="font-medium text-white flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-purple-400" />
          Оплата
        </h4>

        <div className="text-sm text-white">
          {formData.paymentMethod === 'card' && 'Картой при получении'}
          {formData.paymentMethod === 'cash' && 'Наличными при получении'}
          {formData.paymentMethod === 'card_online' && 'Онлайн оплата'}
        </div>
      </div>

      {/* Agreement notice */}
      <p className="text-xs text-white/40 text-center">
        Нажимая "Оформить заказ", вы соглашаетесь с условиями обработки персональных данных
      </p>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrderModal({
  isOpen,
  onClose,
  onSubmit,
  config,
  formData,
  onUpdateForm,
}: OrderModalProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStepIndex = FORM_STEPS.findIndex((s) => s.id === currentStep);

  // Validate current step
  const validateStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'info') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Введите имя';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Введите фамилию';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Введите телефон';
      } else if (!/^\+?[\d\s()-]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Неверный формат телефона';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formData]);

  // Navigate between steps
  const goToNextStep = useCallback(() => {
    if (!validateStep()) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < FORM_STEPS.length) {
      setCurrentStep(FORM_STEPS[nextIndex].id);
    }
  }, [currentStepIndex, validateStep]);

  const goToPrevStep = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(FORM_STEPS[prevIndex].id);
    }
  }, [currentStepIndex]);

  // Submit order
  const handleSubmit = useCallback(async () => {
    if (currentStep !== 'confirm') {
      goToNextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, formData, goToNextStep, onClose, onSubmit]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="h-full md:h-auto max-h-[90vh] flex flex-col rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-white">Оформление заказа</h2>
                  <p className="text-sm text-white/50 mt-0.5">
                    {formatPrice(config.totalPrice)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/50" />
                </button>
              </div>

              {/* Step indicators */}
              <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  {FORM_STEPS.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <button
                        onClick={() => index <= currentStepIndex && setCurrentStep(step.id)}
                        disabled={index > currentStepIndex}
                        className={cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-full transition-all',
                          currentStep === step.id
                            ? 'bg-purple-500/20 text-purple-400'
                            : index < currentStepIndex
                            ? 'text-emerald-400 cursor-pointer hover:bg-white/5'
                            : 'text-white/30 cursor-not-allowed'
                        )}
                      >
                        {index < currentStepIndex ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          step.icon
                        )}
                        <span className="text-sm hidden sm:inline">{step.title}</span>
                      </button>
                      {index < FORM_STEPS.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-white/20 mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  {currentStep === 'info' && (
                    <ContactInfoStep
                      formData={formData}
                      onUpdate={onUpdateForm}
                      errors={errors}
                    />
                  )}
                  {currentStep === 'delivery' && (
                    <DeliveryStep formData={formData} onUpdate={onUpdateForm} />
                  )}
                  {currentStep === 'payment' && (
                    <PaymentStep formData={formData} onUpdate={onUpdateForm} />
                  )}
                  {currentStep === 'confirm' && (
                    <ConfirmStep formData={formData} config={config} />
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                {currentStepIndex > 0 ? (
                  <Button variant="ghost" onClick={goToPrevStep} className="gap-2">
                    Назад
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={cn(
                    'gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-500',
                    'hover:from-purple-600 hover:to-fuchsia-600'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Отправка...
                    </>
                  ) : currentStep === 'confirm' ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Оформить заказ
                    </>
                  ) : (
                    <>
                      Далее
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default OrderModal;
