import { ReactNode } from "react";

type Props = { title: string; subtitle?: string; children: ReactNode };

const SimplePage = ({ title, subtitle, children }: Props) => (
  <article className="container-bethel px-4 lg:px-8 py-16 md:py-24 max-w-4xl">
    <header className="mb-10">
      <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-3">{title}</h1>
      {subtitle && <p className="font-body text-base md:text-lg text-muted-foreground">{subtitle}</p>}
    </header>
    <div className="prose prose-neutral max-w-none font-body text-foreground/90 space-y-4 leading-relaxed">
      {children}
    </div>
  </article>
);

export default SimplePage;
