export default function ServicesPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Услуги</h1>
      <ul className="grid sm:grid-cols-2 gap-4 text-white/80">
        <li className="bg-white/[0.03] border border-white/10 rounded-xl p-4">Подбор конфигурации под ваши задачи</li>
        <li className="bg-white/[0.03] border border-white/10 rounded-xl p-4">Сборка, диагностика и стресс‑тесты</li>
        <li className="bg-white/[0.03] border border-white/10 rounded-xl p-4">Оптимизация Windows и драйверов</li>
        <li className="bg-white/[0.03] border border-white/10 rounded-xl p-4">Апгрейд и обслуживание</li>
      </ul>
    </section>
  );
}

