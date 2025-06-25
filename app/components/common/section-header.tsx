interface SectionHeaderProps {
  title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
  return <h2 className='text-lg font-medium'>{title}</h2>;
};
