type NeonLoadingOverlayProps = {
  message?: string;
};

export default function NeonLoadingOverlay({ message = 'Cargando ambiente...' }: NeonLoadingOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-100">
      <div className="relative h-24 w-24 animate-spin rounded-full bg-gray-100 shadow-neonBlue [animation-duration:1.2s]">
        <span className="absolute inset-0 rounded-full bg-gradient-blue-bg blur-[5px]" />
        <span className="absolute inset-0 rounded-full bg-gradient-green-bg blur-[10px]" />
        <span className="absolute inset-0 rounded-full bg-gradient-blue-bg blur-[25px]" />
        <span className="absolute inset-0 rounded-full bg-gradient-green-bg-bg blur-[50px]" />

        <div className="absolute inset-[10px] rounded-full border-[5px] border-gray-100 bg-gray-100" />
      </div>

      <p className="mt-4 animate-pulse-neon text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
        {message}
      </p>
    </div>
  );
}






