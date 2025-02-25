export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm bg-gray6 px-1.5 py-0.5 font-light text-gray9 text-xs tracking-tighter">
      {children}
    </span>
  )
}
