type PageHeaderProps = {
    title: string;
    subtitle: string;
  };
  
  export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
          {title}
        </h1>
        <p className="text-base text-muted-foreground mt-1">{subtitle}</p>
      </div>
    );
  }
  