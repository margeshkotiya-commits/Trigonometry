import TrigSimulation from '@/components/TrigSimulation';

export default function Page() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#f4f1de] dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-300">
      <TrigSimulation />
    </main>
  );
}
