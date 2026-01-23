export default function EmptyCard({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4">
      <div className="w-24 h-24 bg-cyan-50 rounded-full border border-cyan-100" />
      <p className="max-w-lg text-sm font-medium text-slate-700 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
}
