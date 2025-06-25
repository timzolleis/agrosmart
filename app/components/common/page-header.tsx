interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className='mb-10'>
      <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
      {description && <p className='mt-1 text-sm text-muted-foreground'>{description}</p>}
    </div>
  );
};
