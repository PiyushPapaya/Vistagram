export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-black px-4 py-8">
      <div className="w-full max-w-[350px] flex flex-col gap-3">
        {children}
      </div>

      {/* Footer links */}
      <div className="mt-8 flex flex-wrap justify-center gap-x-3 gap-y-1 max-w-[350px]">
        {[
          'Meta', 'About', 'Blog', 'Jobs', 'Help', 'API', 'Privacy',
          'Terms', 'Locations', 'Instagram Lite', 'Threads', 'Contact',
          'Upload contacts and non-users', 'Meta Verified',
        ].map(l => (
          <span key={l} className="text-[12px] text-muted-foreground cursor-pointer hover:underline">{l}</span>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-muted-foreground">English (UK)</p>
      <p className="mt-3 text-[12px] text-muted-foreground">© 2026 Instagram from Meta</p>
    </div>
  )
}
