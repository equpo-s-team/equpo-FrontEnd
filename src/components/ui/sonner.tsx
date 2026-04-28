import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast font-body text-sm bg-white border border-grey-150 shadow-card rounded-xl text-grey-800',
          description: 'text-grey-500 text-xs',
          actionButton: 'bg-blue text-white text-xs rounded-lg px-2 py-1',
          cancelButton: 'bg-secondary text-grey-600 text-xs rounded-lg px-2 py-1',
          success: 'border-green/40',
          error: 'border-red/40',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
