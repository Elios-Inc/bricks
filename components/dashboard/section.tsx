type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function Section({ eyebrow, title, description, children }: Props) {
  return (
    <section className="flex flex-col gap-6">
      <div className="sticky top-16 z-30 -mx-6 border-b border-white/5 bg-[#0D0D0D]/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
              {title}
            </h2>
          </div>
          {description && (
            <p className="max-w-md text-xs text-white/50">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
