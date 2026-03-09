type PageHeaderProps = {
    title: string;
    subtitle: string;
  };
  
  export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-black font-headline text-white uppercase tracking-tighter">
          {title.split(' ')[0]} <span className="text-primary">{title.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-xs font-bold text-white/50 mt-1 uppercase tracking-widest leading-relaxed">{subtitle}</p>
      </div>
    );
  }